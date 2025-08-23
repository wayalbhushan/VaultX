// 📂 controllers/secretController.js
// PURPOSE: Handles all business logic for secrets (CRUD operations).

import Secret from "../models/Secret.js";
import Activity from "../models/Activity.js";
// Import from your chosen crypto utility file
import { encrypt, decrypt } from "../utils/cryptoHelper.js"; 

// @desc    Create a new secret
// @route   POST /api/secrets
// @access  Private
export const createSecret = async (req, res) => {
  try {
    const { title, data, type = "secret", description = "" } = req.body;

    if (!title || !data) {
      return res.status(400).json({ message: "Title and data are required" });
    }

    const { iv, encryptedData } = encrypt(data);

    const newSecret = new Secret({
      userId: req.user.id,
      title,
      encryptedData,
      iv,
      type,
      description,
    });

    const savedSecret = await newSecret.save();

    // Log activity
    await Activity.create({
      userId: req.user.id,
      action: `Created new secret: "${title}"`,
    });

    // Respond with the newly created secret (without decrypted data)
    res.status(201).json(savedSecret);
  } catch (err) {
    console.error("Error creating secret:", err.message);
    res.status(500).json({ message: "Failed to save secret" });
  }
};

// @desc    Get all secrets for a user (without decrypting)
// @route   GET /api/secrets
// @access  Private
export const getAllSecrets = async (req, res) => {
  try {
    // This route returns the secrets without decrypting them.
    // This is efficient for just listing titles on a dashboard.
    const secrets = await Secret.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(secrets);
  } catch (err) {
    console.error("Error fetching secrets:", err.message);
    res.status(500).json({ message: "Failed to fetch secrets" });
  }
};

// @desc    Get a single secret by ID (and decrypt it)
// @route   GET /api/secrets/:id
// @access  Private
export const getSecretById = async (req, res) => {
  try {
    const secret = await Secret.findOne({ _id: req.params.id, userId: req.user.id });

    if (!secret) {
      return res.status(404).json({ message: "Secret not found" });
    }

    const decryptedData = decrypt(secret.encryptedData, secret.iv);

    // Log activity for viewing
    await Activity.create({
      userId: req.user.id,
      action: `Viewed secret: "${secret.title}"`,
    });

    // Return the full secret object with the decrypted data
    res.status(200).json({
      _id: secret._id,
      userId: secret.userId,
      title: secret.title,
      data: decryptedData, // Decrypted data
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

// @desc    Update a secret
// @route   PUT /api/secrets/:id
// @access  Private
export const updateSecret = async (req, res) => {
  try {
    const { title, data, description, type } = req.body;
    const secret = await Secret.findOne({ _id: req.params.id, userId: req.user.id });

    if (!secret) {
      return res.status(404).json({ message: "Secret not found" });
    }

    // Update fields if they are provided in the request body
    if (title) secret.title = title;
    if (description) secret.description = description;
    if (type) secret.type = type;

    // If new data is provided, re-encrypt it
    if (data) {
      const { iv, encryptedData } = encrypt(data);
      secret.iv = iv;
      secret.encryptedData = encryptedData;
    }

    const updatedSecret = await secret.save();

    // Log activity
    await Activity.create({
      userId: req.user.id,
      action: `Updated secret: "${updatedSecret.title}"`,
    });

    res.status(200).json(updatedSecret);
  } catch (err)
  {
    console.error("Error updating secret:", err.message);
    res.status(500).json({ message: "Failed to update secret" });
  }
};

// @desc    Delete a secret
// @route   DELETE /api/secrets/:id
// @access  Private
export const deleteSecret = async (req, res) => {
  try {
    const secret = await Secret.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!secret) {
      return res.status(404).json({ message: "Secret not found" });
    }

    // Log activity
    await Activity.create({
      userId: req.user.id,
      action: `Deleted secret: "${secret.title}"`,
    });

    res.status(200).json({ message: "Secret deleted successfully" });
  } catch (err) {
    console.error("Error deleting secret:", err.message);
    res.status(500).json({ message: "Failed to delete secret" });
  }
};
