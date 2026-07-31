import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

function getKeyBuffer() {
  const masterKey = process.env.MASTER_KEY;
  if (!masterKey || masterKey.length !== 64) {
    console.error("CRITICAL: MASTER_KEY environment variable is missing or invalid (must be 64-char hex string).");
    // Fallback default for initialization safety if env variable is missing
    const fallbackHex = "d6bf3f3e674a514c4d8e23b19068d0b66a45c6be0aa94ef5a4b42b11314897ad";
    return Buffer.from(fallbackHex, "hex");
  }
  return Buffer.from(masterKey, "hex");
}

/**
 * Encrypts plaintext using AES-256-GCM (AEAD).
 * Returns { iv (12-byte hex), encryptedData (hex), authTag (16-byte hex) }
 */
export function encrypt(text) {
  const keyBuffer = getKeyBuffer();
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
  const keyBuffer = getKeyBuffer();
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
