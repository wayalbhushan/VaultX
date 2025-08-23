// utils/cryptoHelper.js
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const masterKey = process.env.MASTER_KEY;

// Validate master key
if (!masterKey || masterKey.length !== 64) {
  throw new Error("MASTER_KEY must be a 64-char hex string (32 bytes).");
}

const keyBuffer = Buffer.from(masterKey, "hex");

/**
 * Encrypts a plaintext string and returns an object
 * with separate IV and encrypted data.
 */
export function encrypt(text) {
  const iv = crypto.randomBytes(16); // 16-byte random IV
  const cipher = crypto.createCipheriv("aes-256-cbc", keyBuffer, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    iv: iv.toString("hex"),
    encryptedData: encrypted,
  };
}

/**
 * Decrypts using provided encrypted data and IV
 */
export function decrypt(encryptedData, ivHex) {
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", keyBuffer, iv);
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
