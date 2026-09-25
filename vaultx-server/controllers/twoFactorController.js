

import speakeasy from "speakeasy";
import qrcode from "qrcode";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { encrypt, decrypt } from "../utils/cryptoHelper.js";

/**
 * @desc    Generate a new 2FA secret and QR code for the user
 * @route   POST /api/2fa/generate
 * @access  Private
 */
export const generateTwoFactorSecret = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const secret = speakeasy.generateSecret({
      name: `VaultX (${user.email})`,
    });
    
    // Encrypt TOTP secret before persisting to database
    const encryptedSecret = encrypt(secret.base32);
    user.twoFactorSecret = {
      encryptedData: encryptedSecret.encryptedData,
      iv: encryptedSecret.iv,
      authTag: encryptedSecret.authTag,
    };
    await user.save();

    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
      if (err) {
        console.error("QR Code generation error:", err);
        return res.status(500).json({ message: "Could not generate QR code" });
      }
      res.json({ qrCodeUrl: data_url });
    });
  } catch (err) {
    console.error("2FA secret generation error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Verify the 2FA token and enable 2FA for the user
 * @route   POST /api/2fa/verify
 * @access  Private
 */
export const verifyTwoFactorToken = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user.id);
    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ message: "2FA not set up or user not found" });
    }

    let decryptedSecret;
    if (typeof user.twoFactorSecret === "string") {
      decryptedSecret = user.twoFactorSecret;
    } else if (user.twoFactorSecret.encryptedData) {
      decryptedSecret = decrypt(
        user.twoFactorSecret.encryptedData,
        user.twoFactorSecret.iv,
        user.twoFactorSecret.authTag
      );
    } else {
      return res.status(400).json({ message: "Invalid 2FA secret format" });
    }

    const verified = speakeasy.totp.verify({
      secret: decryptedSecret,
      encoding: "base32",
      token: token,
    });
    if (verified) {
      user.isTwoFactorEnabled = true;
      await user.save();
      res.json({ message: "2FA enabled successfully" });
    } else {
      res.status(400).json({ message: "Invalid 2FA token" });
    }
  } catch (err) {
    console.error("2FA verification error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Disable 2FA for the user after password confirmation
 * @route   POST /api/2fa/disable
 * @access  Private
 */
export const disableTwoFactor = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Security check: Verify password before allowing 2FA disable
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password." });
    }

    // If password is correct, disable 2FA
    user.isTwoFactorEnabled = false;
    user.twoFactorSecret = { encryptedData: null, iv: null };
    await user.save();

    res.json({ message: "2FA has been disabled." });
  } catch (err) {
    console.error("2FA disable error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};