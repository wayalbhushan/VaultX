
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import speakeasy from "speakeasy"; // ✅ 1. Import speakeasy

// ... existing signupUser function ...
export const signupUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: "User registered successfully", user: { username: newUser.username, email: newUser.email } });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    console.error("Signup error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};


// ✅ 2. MODIFIED loginUser function
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // --- 2FA Check ---
    if (user.isTwoFactorEnabled) {
      // If 2FA is enabled, don't send the token yet.
      // Send a signal that 2FA is required.
      return res.status(206).json({
        message: "2FA token required",
        twoFactorRequired: true,
        userId: user._id, // Send userId to use in the next step
      });
    }

    // If 2FA is not enabled, log in directly
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user: { username: user.username, email: user.email } });

  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ 3. NEW function to validate the 2FA token during login
export const validateLoginToken = async (req, res) => {
    try {
        const { userId, token } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: "base32",
            token: token,
        });

        if (verified) {
            // If 2FA token is correct, now we issue the JWT
            const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.json({ token: authToken, user: { username: user.username, email: user.email } });
        } else {
            res.status(401).json({ error: "Invalid 2FA token" });
        }

    } catch (error) {
        console.error("2FA Login Validation Error:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};