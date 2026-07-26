import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import speakeasy from "speakeasy";
import User from "../models/user.js";
import RefreshToken from "../models/RefreshToken.js";
import { decrypt } from "../utils/cryptoHelper.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

const generateTokensAndSetCookies = async (res, user, req) => {
  // 1. Issue Access Token (15 min)
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_TTL || "15m",
  });

  // 2. Issue Refresh Token (7 days) and save hashed version to DB session table
  const rawRefreshToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawRefreshToken).digest("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await RefreshToken.create({
    userId: user._id,
    tokenHash,
    expiresAt,
    ipAddress: req.ip || "",
    userAgent: req.headers["user-agent"] || "",
  });

  // 3. Double-submit CSRF token
  const csrfToken = crypto.randomBytes(16).toString("hex");

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", rawRefreshToken, {
    ...cookieOptions,
    path: "/api/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("csrfToken", csrfToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return { csrfToken };
};

export const signupUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email, and password are required." });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ error: "Username or Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword });

    res.status(201).json({
      message: "User registered successfully",
      user: { username: newUser.username, email: newUser.email },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Username or Email already exists." });
    }
    console.error("Signup error:", error.message);
    res.status(500).json({ error: "Server error during registration." });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // 2FA Enforcement check
    if (user.isTwoFactorEnabled) {
      // Issue temporary 5-minute pre-auth token bound to 2FA scope
      const tempToken = jwt.sign(
        { id: user._id, stage: "2fa_pending" },
        process.env.JWT_SECRET,
        { expiresIn: "5m" }
      );

      return res.status(206).json({
        message: "2FA authentication required.",
        twoFactorRequired: true,
        tempToken,
      });
    }

    const { csrfToken } = await generateTokensAndSetCookies(res, user, req);

    res.json({
      message: "Logged in successfully",
      user: { username: user.username, email: user.email },
      csrfToken,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Server error during login." });
  }
};

export const validateLoginToken = async (req, res) => {
  try {
    const { tempToken, token } = req.body;

    if (!tempToken || !token) {
      return res.status(401).json({ error: "Temporary 2FA token and TOTP code are required." });
    }

    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired 2FA session token." });
    }

    if (decoded.stage !== "2fa_pending") {
      return res.status(401).json({ error: "Invalid 2FA session scope." });
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.twoFactorSecret || !user.twoFactorSecret.encryptedData) {
      return res.status(400).json({ error: "2FA is not properly configured for this user." });
    }

    const decryptedSecret = decrypt(
      user.twoFactorSecret.encryptedData,
      user.twoFactorSecret.iv
    );

    const verified = speakeasy.totp.verify({
      secret: decryptedSecret,
      encoding: "base32",
      token: token,
    });

    if (!verified) {
      return res.status(401).json({ error: "Invalid 2FA code." });
    }

    const { csrfToken } = await generateTokensAndSetCookies(res, user, req);

    res.json({
      message: "2FA verification successful",
      user: { username: user.username, email: user.email },
      csrfToken,
    });
  } catch (error) {
    console.error("2FA Login Validation Error:", error.message);
    res.status(500).json({ error: "Server error during 2FA validation." });
  }
};

export const refreshSession = async (req, res) => {
  try {
    const rawRefreshToken = req.cookies?.refreshToken;
    if (!rawRefreshToken) {
      return res.status(401).json({ error: "Refresh token missing." });
    }

    const tokenHash = crypto.createHash("sha256").update(rawRefreshToken).digest("hex");
    const session = await RefreshToken.findOneAndDelete({ tokenHash });

    if (!session || session.expiresAt < new Date()) {
      res.clearCookie("accessToken", cookieOptions);
      res.clearCookie("refreshToken", { ...cookieOptions, path: "/api/auth" });
      res.clearCookie("csrfToken");
      return res.status(401).json({ error: "Invalid or expired refresh token." });
    }

    const user = await User.findById(session.userId);
    if (!user) {
      return res.status(401).json({ error: "User associated with session not found." });
    }

    const { csrfToken } = await generateTokensAndSetCookies(res, user, req);

    res.json({
      message: "Session refreshed successfully",
      csrfToken,
    });
  } catch (error) {
    console.error("Refresh Error:", error.message);
    res.status(500).json({ error: "Server error during token refresh." });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const rawRefreshToken = req.cookies?.refreshToken;
    if (rawRefreshToken) {
      const tokenHash = crypto.createHash("sha256").update(rawRefreshToken).digest("hex");
      await RefreshToken.deleteOne({ tokenHash });
    }

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", { ...cookieOptions, path: "/api/auth" });
    res.clearCookie("csrfToken");

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error.message);
    res.status(500).json({ error: "Server error during logout." });
  }
};