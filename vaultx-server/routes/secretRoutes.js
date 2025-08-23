import express from "express";
import Secret from "../models/Secret.js";
import Activity from "../models/Activity.js";
import authMiddleware from "../middleware/authMiddleware.js";
import crypto from "crypto";

const router = express.Router();

const ALGO = "aes-256-cbc";
const rawKey = process.env.SECRET_KEY || "defaultfallbackkey1234567890";
const ENC_KEY = rawKey.padEnd(32, "0").substring(0, 32); // ensure 32 bytes

// Helper to encrypt
const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGO, Buffer.from(ENC_KEY), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { iv: iv.toString("hex"), encryptedData: encrypted };
};

// FIX: Added the missing decrypt helper function
const decrypt = (encryptedData, iv) => {
  const decipher = crypto.createDecipheriv(
    ALGO,
    Buffer.from(ENC_KEY),
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};


// ======================
// GET all secrets
// ======================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { userId: req.user.id };
    if (type) filter.type = type;

    const secrets = await Secret.find(filter).sort({ createdAt: -1 });
    res.json(secrets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch secrets" });
  }
});

// FIX: Added the missing route to get a single secret by ID
// ======================
// GET a single secret by ID
// ======================
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const secret = await Secret.findOne({ _id: req.params.id, userId: req.user.id });
    if (!secret) {
      return res.status(404).json({ message: "Secret not found" });
    }

    const decryptedData = decrypt(secret.encryptedData, secret.iv);

    // Log the view activity
    await Activity.create({
      userId: req.user.id,
      action: `Viewed secret "${secret.title}"`,
    });

    // Return the decrypted data along with other secret info
    res.json({
      _id: secret._id,
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
});


// ======================
// POST a new secret
// ======================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, data, type = "secret", description = "" } = req.body;

    if (!title || !data)
      return res.status(400).json({ message: "Title and data are required" });

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
      action: `Added new secret "${title}" of type "${type}"`,
    });

    res.status(201).json(savedSecret);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save secret" });
  }
});

// ======================
// PUT edit a secret by ID
// ======================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, data, description, type } = req.body;
    const secret = await Secret.findOne({ _id: req.params.id, userId: req.user.id });

    if (!secret) return res.status(404).json({ message: "Secret not found" });

    if (title) secret.title = title;
    if (data) {
      const { iv, encryptedData } = encrypt(data);
      secret.iv = iv;
      secret.encryptedData = encryptedData;
    }
    if (description) secret.description = description;
    if (type) secret.type = type;

    const updated = await secret.save();

    // Log activity
    await Activity.create({
      userId: req.user.id,
      action: `Updated secret "${secret.title}"`,
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update secret" });
  }
});

// ======================
// DELETE a secret
// ======================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const secret = await Secret.findOne({ _id: req.params.id, userId: req.user.id });
    if (!secret) return res.status(404).json({ message: "Secret not found" });

    await secret.deleteOne();

    // Log activity
    await Activity.create({
      userId: req.user.id,
      action: `Deleted secret "${secret.title}"`,
    });

    res.json({ message: "Secret deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete secret" });
  }
});

export default router;
