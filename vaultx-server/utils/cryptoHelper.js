import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const masterKey = process.env.MASTER_KEY;

if (!masterKey || masterKey.length !== 64) {
  throw new Error("CRITICAL: MASTER_KEY must be a 64-char hex string (32 bytes).");
}

const keyBuffer = Buffer.from(masterKey, "hex");

/**
 * Encrypts plaintext using AES-256-GCM (AEAD).
 * Returns { iv (12-byte hex), encryptedData (hex), authTag (16-byte hex) }
 */
export function encrypt(text) {
  const iv = crypto.randomBytes(12); // Standard 12-byte IV for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", keyBuffer, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  return {
    iv: iv.toString("hex"),
    encryptedData: encrypted,
    authTag: authTag,
  };
}

/**
 * Decrypts data using AES-256-GCM (with authentication tag validation).
 * Falls back to AES-256-CBC for legacy ciphertext without authTag.
 */
export function decrypt(encryptedData, ivHex, authTagHex = null) {
  if (authTagHex) {
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-gcm", keyBuffer, iv);
    decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } else {
    // Legacy fallback for CBC ciphertext
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", keyBuffer, iv);
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
}
