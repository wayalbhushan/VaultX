import mongoose from "mongoose";
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
    const { title, data, type = "secret", description = "" } = req.body;

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
 * @desc    Get all secrets for the authenticated user
 * @route   GET /api/secrets
 * @access  Private
 */
export const getAllSecrets = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { userId: req.user.id };
    if (type) filter.type = type;

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

    // Decrypt data verifying AEAD authentication tag
    const decryptedData = decrypt(secret.encryptedData, secret.iv, secret.authTag);

    await recordActivity(req.user.id, `Viewed secret: "${secret.title}"`);

    res.status(200).json({
      _id: secret._id,
      userId: secret.userId,
      title: secret.title,
      data: decryptedData,
      type: secret.type,
      description: secret.description,
      createdAt: secret.createdAt,
      updatedAt: secret.updatedAt,
    });
  } catch (err) {
    console.error("Error fetching single secret:", err.message);
    res.status(500).json({ message: "Failed to retrieve secret" });
  }
};

/**
 * @desc    Update a secret by ID
 * @route   PUT /api/secrets/:id
 * @access  Private
 */
export const updateSecret = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Secret not found" });
    }

    const { title, data, description, type } = req.body;
    
    // Direct multi-field query: IDOR protection filtering by BOTH _id AND userId
    const secret = await Secret.findOne({ _id: req.params.id, userId: req.user.id });

    if (!secret) {
      return res.status(404).json({ message: "Secret not found" });
    }

    if (title) secret.title = title;
    if (description !== undefined) secret.description = description;
    if (type) secret.type = type;

    if (data) {
      const { iv, encryptedData, authTag } = encrypt(data);
      secret.iv = iv;
      secret.encryptedData = encryptedData;
      secret.authTag = authTag;
    }

    const updatedSecret = await secret.save();

    await recordActivity(req.user.id, `Updated secret: "${updatedSecret.title}"`);

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

    // Direct multi-field query: IDOR protection filtering by BOTH _id AND userId
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
