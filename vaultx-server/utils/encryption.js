import crypto from "crypto";

const ALGO = "aes-256-cbc";
const MASTER_KEY = process.env.MASTER_KEY; // Must be 32 bytes

// Encrypt plain text
export function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGO, Buffer.from(MASTER_KEY, "utf-8"), iv);
  let encrypted = cipher.update(text, "utf-8", "base64");
  encrypted += cipher.final("base64");

  return {
    iv: iv.toString("base64"),
    encryptedData: encrypted,
  };
}

// Decrypt cipher text
export function decrypt(encryptedData, iv) {
  const decipher = crypto.createDecipheriv(
    ALGO,
    Buffer.from(MASTER_KEY, "utf-8"),
    Buffer.from(iv, "base64")
  );
  let decrypted = decipher.update(encryptedData, "base64", "utf-8");
  decrypted += decipher.final("utf-8");

  return decrypted;
}
