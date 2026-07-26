import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import RefreshToken from "../models/RefreshToken.js";
import { recordActivity } from "./activityController.js";

/**
 * @desc Get current user's profile
 * @route GET /api/user/me
 * @access Private
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "✅ User profile fetched", user });
  } catch (err) {
    console.error("Error fetching user profile:", err.message);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
};

/**
 * @desc Change user's password
 * @route PUT /api/user/change-password
 * @access Private
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await recordActivity(req.user.id, "Changed account password");

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error changing password:", err.message);
    res.status(500).json({ message: "Server error while changing password" });
  }
};

/**
 * @desc Get all active sessions for current user
 * @route GET /api/user/sessions
 * @access Private
 */
export const getActiveSessions = async (req, res) => {
  try {
    const rawRefreshToken = req.cookies?.refreshToken;
    const currentHash = rawRefreshToken
      ? crypto.createHash("sha256").update(rawRefreshToken).digest("hex")
      : null;

    const sessions = await RefreshToken.find({ userId: req.user.id }).sort({ createdAt: -1 });

    const sessionList = sessions.map((s) => ({
      _id: s._id,
      ipAddress: s.ipAddress || "Unknown IP",
      userAgent: s.userAgent || "Unknown Device",
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      isCurrentSession: s.tokenHash === currentHash,
    }));

    res.status(200).json(sessionList);
  } catch (err) {
    console.error("Error fetching active sessions:", err.message);
    res.status(500).json({ message: "Failed to fetch active sessions" });
  }
};

/**
 * @desc Revoke a specific active session by ID
 * @route DELETE /api/user/sessions/:sessionId
 * @access Private
 */
export const revokeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const deleted = await RefreshToken.findOneAndDelete({
      _id: sessionId,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Session not found" });
    }

    await recordActivity(req.user.id, `Revoked active session (${deleted.ipAddress})`);

    res.status(200).json({ message: "Session revoked successfully" });
  } catch (err) {
    console.error("Error revoking session:", err.message);
    res.status(500).json({ message: "Failed to revoke session" });
  }
};

/**
 * @desc Revoke all active sessions EXCEPT current device
 * @route POST /api/user/sessions/revoke-others
 * @access Private
 */
export const revokeOtherSessions = async (req, res) => {
  try {
    const rawRefreshToken = req.cookies?.refreshToken;
    if (!rawRefreshToken) {
      return res.status(400).json({ message: "Current session token not identified" });
    }

    const currentHash = crypto.createHash("sha256").update(rawRefreshToken).digest("hex");

    const result = await RefreshToken.deleteMany({
      userId: req.user.id,
      tokenHash: { $ne: currentHash },
    });

    await recordActivity(req.user.id, `Revoked all other active sessions (${result.deletedCount} sessions)`);

    res.status(200).json({
      message: `Revoked ${result.deletedCount} other active session(s)`,
      revokedCount: result.deletedCount,
    });
  } catch (err) {
    console.error("Error revoking other sessions:", err.message);
    res.status(500).json({ message: "Failed to revoke other sessions" });
  }
};
