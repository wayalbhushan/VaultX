import mongoose from "mongoose";
import crypto from "crypto";
import Secret from "../models/Secret.js";
import { recordActivity } from "./activityController.js";
import { encrypt, decrypt } from "../utils/cryptoHelper.js";

/**
 * @desc    Create a new secret (AES-256-GCM AEAD Encrypted)
 * @route   POST /api/secrets
 * @access  Private
 */
export const createSecret = async (req, res) => {
  try {
    const {
      title,
      data,
      type = "secret",
      description = "",
      expiresAt = null,
      rotationReminderDays = null,
      tags = [],
      folder = "",
      isFavorite = false,
    } = req.body;

    if (!title || !data) {
      return res.status(400).json({ message: "Title and data are required" });
    }

    const { iv, encryptedData, authTag } = encrypt(data);

    const newSecret = new Secret({
      userId: req.user.id,
      title,
      encryptedData,
      iv,
      authTag,
      type,
      description,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      rotationReminderDays: rotationReminderDays || null,
      tags: Array.isArray(tags) ? tags : [],
      folder: folder || "",
      isFavorite: Boolean(isFavorite),
      version: 1,
      versions: [],
    });

    const savedSecret = await newSecret.save();

    await recordActivity(req.user.id, `Created new secret: "${title}"`);

    res.status(201).json(savedSecret);
  } catch (err) {
    console.error("Error creating secret:", err.message);
    res.status(500).json({ message: "Failed to save secret" });
  }
};

/**
 * @desc    Get all secrets for the authenticated user with search & filtering
 * @route   GET /api/secrets
 * @access  Private
 */
export const getAllSecrets = async (req, res) => {
  try {
    const { type, search, tag, folder, isFavorite } = req.query;
    const filter = { userId: req.user.id };

    if (type) filter.type = type;
    if (tag) filter.tags = tag;
    if (folder !== undefined && folder !== "") filter.folder = folder;
    if (isFavorite === "true") filter.isFavorite = true;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const secrets = await Secret.find(filter).sort({ createdAt: -1 });
    res.status(200).json(secrets);
  } catch (err) {
    console.error("Error fetching secrets:", err.message);
    res.status(500).json({ message: "Failed to fetch secrets" });
  }
};

/**
 * @desc    Get a single secret by ID (and decrypt it with GCM auth tag check)
 * @route   GET /api/secrets/:id
 * @access  Private
 */
export const getSecretById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Secret not found" });
    }

    // Direct multi-field query: IDOR protection filtering by BOTH _id AND userId
    const secret = await Secret.findOne({ _id: req.params.id, userId: req.user.id });

    if (!secret) {
      return res.status(404).json({ message: "Secret not found" });
    }

    const decryptedData = decrypt(secret.encryptedData, secret.iv, secret.authTag);

    await recordActivity(req.user.id, `Viewed secret: "${secret.title}"`);

    // Determine expiration status
    let expirationStatus = "active";
    if (secret.expiresAt) {
      const now = new Date();
      const expirationDate = new Date(secret.expiresAt);
      if (now > expirationDate) {
        expirationStatus = "expired";
      } else if (expirationDate.getTime() - now.getTime() <= 7 * 24 * 60 * 60 * 1000) {
        expirationStatus = "expiring_soon";
      }
    }

    res.status(200).json({
      _id: secret._id,
      userId: secret.userId,
      title: secret.title,
      data: decryptedData,
      type: secret.type,
      description: secret.description,
      version: secret.version,
      versionCount: secret.versions?.length || 0,
      expiresAt: secret.expiresAt,
      rotationReminderDays: secret.rotationReminderDays,
      expirationStatus,
      tags: secret.tags,
      folder: secret.folder,
      isFavorite: secret.isFavorite,
      createdAt: secret.createdAt,
      updatedAt: secret.updatedAt,
    });
  } catch (err) {
    console.error("Error fetching single secret:", err.message);
    res.status(500).json({ message: "Failed to retrieve secret" });
  }
};

/**
 * @desc    Update a secret by ID (with secret versioning history snapshot)
 * @route   PUT /api/secrets/:id
 * @access  Private
 */
export const updateSecret = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Secret not found" });
    }

    const {
      title,
      data,
      description,
      type,
      expiresAt,
      rotationReminderDays,
      tags,
      folder,
      isFavorite,
    } = req.body;

    const secret = await Secret.findOne({ _id: req.params.id, userId: req.user.id });

    if (!secret) {
      return res.status(404).json({ message: "Secret not found" });
    }

    // Versioning: Snapshot current state before updating
    secret.versions.push({
      version: secret.version,
      title: secret.title,
      encryptedData: secret.encryptedData,
      iv: secret.iv,
      authTag: secret.authTag,
      type: secret.type,
      description: secret.description,
      createdAt: secret.updatedAt || secret.createdAt,
    });
    secret.version += 1;

    if (title) secret.title = title;
    if (description !== undefined) secret.description = description;
    if (type) secret.type = type;
    if (expiresAt !== undefined) secret.expiresAt = expiresAt ? new Date(expiresAt) : null;
    if (rotationReminderDays !== undefined) secret.rotationReminderDays = rotationReminderDays;
    if (tags !== undefined) secret.tags = Array.isArray(tags) ? tags : [];
    if (folder !== undefined) secret.folder = folder;
    if (isFavorite !== undefined) secret.isFavorite = Boolean(isFavorite);

    if (data) {
      const { iv, encryptedData, authTag } = encrypt(data);
      secret.iv = iv;
      secret.encryptedData = encryptedData;
      secret.authTag = authTag;
    }

    const updatedSecret = await secret.save();

    await recordActivity(req.user.id, `Updated secret: "${updatedSecret.title}" (v${updatedSecret.version})`);

    res.status(200).json(updatedSecret);
  } catch (err) {
    console.error("Error updating secret:", err.message);
    res.status(500).json({ message: "Failed to update secret" });
  }
};

/**
 * @desc    Delete a secret by ID
 * @route   DELETE /api/secrets/:id
 * @access  Private
 */
export const deleteSecret = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Secret not found" });
    }

    const secret = await Secret.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!secret) {
      return res.status(404).json({ message: "Secret not found" });
    }

    await recordActivity(req.user.id, `Deleted secret: "${secret.title}"`);

    res.status(200).json({ message: "Secret deleted successfully" });
  } catch (err) {
    console.error("Error deleting secret:", err.message);
    res.status(500).json({ message: "Failed to delete secret" });
  }
};

/**
 * @desc    Get version history for a secret
 * @route   GET /api/secrets/:id/versions
 * @access  Private
 */
export const getSecretVersions = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Secret not found" });
    }

    const secret = await Secret.findOne({ _id: req.params.id, userId: req.user.id });
    if (!secret) {
      return res.status(404).json({ message: "Secret not found" });
    }

    const versions = secret.versions.map((v) => ({
      version: v.version,
      title: v.title,
      type: v.type,
      description: v.description,
      createdAt: v.createdAt,
    }));

    res.status(200).json({
      currentVersion: secret.version,
      history: versions,
    });
  } catch (err) {
    console.error("Error fetching secret versions:", err.message);
    res.status(500).json({ message: "Failed to fetch secret versions" });
  }
};

/**
 * @desc    Rollback a secret to a previous version
 * @route   POST /api/secrets/:id/rollback/:targetVersion
 * @access  Private
 */
export const rollbackSecretVersion = async (req, res) => {
  try {
    const { id, targetVersion } = req.params;
    const targetVersionNum = parseInt(targetVersion, 10);

    if (!mongoose.Types.ObjectId.isValid(id) || isNaN(targetVersionNum)) {
      return res.status(400).json({ message: "Invalid parameters" });
    }

    const secret = await Secret.findOne({ _id: id, userId: req.user.id });
    if (!secret) {
      return res.status(404).json({ message: "Secret not found" });
    }

    const targetSnapshot = secret.versions.find((v) => v.version === targetVersionNum);
    if (!targetSnapshot) {
      return res.status(404).json({ message: `Version ${targetVersionNum} not found in history` });
    }

    // Push current state into version history before rollback
    secret.versions.push({
      version: secret.version,
      title: secret.title,
      encryptedData: secret.encryptedData,
      iv: secret.iv,
      authTag: secret.authTag,
      type: secret.type,
      description: secret.description,
      createdAt: new Date(),
    });

    secret.version += 1;
    secret.title = targetSnapshot.title;
    secret.encryptedData = targetSnapshot.encryptedData;
    secret.iv = targetSnapshot.iv;
    secret.authTag = targetSnapshot.authTag;
    secret.type = targetSnapshot.type;
    secret.description = targetSnapshot.description;

    const restoredSecret = await secret.save();

    await recordActivity(
      req.user.id,
      `Rolled back secret "${secret.title}" to version ${targetVersionNum} (new v${restoredSecret.version})`
    );

    res.status(200).json({
      message: `Rolled back successfully to version ${targetVersionNum}`,
      secret: restoredSecret,
    });
  } catch (err) {
    console.error("Error rolling back secret:", err.message);
    res.status(500).json({ message: "Failed to rollback secret" });
  }
};

/**
 * @desc    Toggle favorite status of a secret
 * @route   PUT /api/secrets/:id/favorite
 * @access  Private
 */
export const toggleFavoriteSecret = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Secret not found" });
    }

    const secret = await Secret.findOne({ _id: req.params.id, userId: req.user.id });
    if (!secret) {
      return res.status(404).json({ message: "Secret not found" });
    }

    secret.isFavorite = !secret.isFavorite;
    await secret.save();

    res.status(200).json({
      _id: secret._id,
      isFavorite: secret.isFavorite,
      message: secret.isFavorite ? "Added to favorites" : "Removed from favorites",
    });
  } catch (err) {
    console.error("Error toggling favorite:", err.message);
    res.status(500).json({ message: "Failed to update favorite status" });
  }
};

/**
 * @desc    Get secrets requiring rotation or expired
 * @route   GET /api/secrets/expired
 * @access  Private
 */
export const getExpiredSecrets = async (req, res) => {
  try {
    const secrets = await Secret.find({
      userId: req.user.id,
      expiresAt: { $ne: null },
    });

    const now = new Date();
    const expiredOrExpiring = secrets
      .map((s) => {
        const expDate = new Date(s.expiresAt);
        const daysRemaining = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
        let status = "active";
        if (daysRemaining <= 0) status = "expired";
        else if (daysRemaining <= 7) status = "expiring_soon";

        return {
          _id: s._id,
          title: s.title,
          type: s.type,
          expiresAt: s.expiresAt,
          daysRemaining,
          status,
        };
      })
      .filter((s) => s.status !== "active");

    res.status(200).json(expiredOrExpiring);
  } catch (err) {
    console.error("Error fetching expired secrets:", err.message);
    res.status(500).json({ message: "Failed to fetch expired secrets" });
  }
};

/**
 * @desc    Export encrypted vault container protected by PBKDF2 passphrase
 * @route   POST /api/secrets/export
 * @access  Private
 */
export const exportVault = async (req, res) => {
  try {
    const { passphrase } = req.body;
    if (!passphrase || passphrase.length < 6) {
      return res.status(400).json({ message: "Passphrase must be at least 6 characters long" });
    }

    const secrets = await Secret.find({ userId: req.user.id });

    // Decrypt all user secrets into raw export payload
    const decryptedSecretsPayload = secrets.map((s) => ({
      title: s.title,
      data: decrypt(s.encryptedData, s.iv, s.authTag),
      type: s.type,
      description: s.description,
      tags: s.tags,
      folder: s.folder,
      isFavorite: s.isFavorite,
    }));

    const jsonString = JSON.stringify(decryptedSecretsPayload);

    // Derive 256-bit key using PBKDF2 (100,000 iterations)
    const salt = crypto.randomBytes(16);
    const key = crypto.pbkdf2Sync(passphrase, salt, 100000, 32, "sha256");

    // Encrypt vault JSON using AES-256-GCM
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    let encryptedVault = cipher.update(jsonString, "utf8", "hex");
    encryptedVault += cipher.final("hex");
    const authTag = cipher.getAuthTag().toString("hex");

    await recordActivity(req.user.id, `Exported encrypted vault backup (${secrets.length} items)`);

    res.status(200).json({
      version: "1.0",
      algorithm: "PBKDF2-SHA256-AES-256-GCM",
      salt: salt.toString("hex"),
      iv: iv.toString("hex"),
      authTag: authTag,
      encryptedVault: encryptedVault,
      exportedAt: new Date().toISOString(),
      itemCount: secrets.length,
    });
  } catch (err) {
    console.error("Error exporting vault:", err.message);
    res.status(500).json({ message: "Failed to export vault" });
  }
};

/**
 * @desc    Import passphrase-protected vault container
 * @route   POST /api/secrets/import
 * @access  Private
 */
export const importVault = async (req, res) => {
  try {
    const { passphrase, backupData } = req.body;
    if (!passphrase || !backupData || !backupData.salt || !backupData.iv || !backupData.encryptedVault) {
      return res.status(400).json({ message: "Valid passphrase and backup container are required" });
    }

    const salt = Buffer.from(backupData.salt, "hex");
    const iv = Buffer.from(backupData.iv, "hex");
    const authTag = Buffer.from(backupData.authTag, "hex");

    // Re-derive key via PBKDF2
    const key = crypto.pbkdf2Sync(passphrase, salt, 100000, 32, "sha256");

    // Decrypt backup container
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);
    let decryptedString = decipher.update(backupData.encryptedVault, "hex", "utf8");
    decryptedString += decipher.final("utf8");

    const items = JSON.parse(decryptedString);
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: "Invalid backup file structure" });
    }

    // Re-encrypt items with server master key and batch insert
    const newSecrets = items.map((item) => {
      const { iv: encIv, encryptedData, authTag: encTag } = encrypt(item.data);
      return {
        userId: req.user.id,
        title: item.title,
        encryptedData,
        iv: encIv,
        authTag: encTag,
        type: item.type || "secret",
        description: item.description || "",
        tags: item.tags || [],
        folder: item.folder || "",
        isFavorite: Boolean(item.isFavorite),
      };
    });

    const inserted = await Secret.insertMany(newSecrets);

    await recordActivity(req.user.id, `Imported ${inserted.length} secrets from backup container`);

    res.status(201).json({
      message: `Successfully imported ${inserted.length} secrets`,
      importedCount: inserted.length,
    });
  } catch (err) {
    console.error("Error importing vault:", err.message);
    res.status(400).json({ message: "Failed to import vault. Invalid passphrase or corrupted backup file." });
  }
};
