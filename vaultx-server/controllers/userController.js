// 📂 controllers/userController.js
// PURPOSE: Add the logic to handle the password change.

import User from "../models/user.js";
import bcrypt from "bcryptjs"; // Import bcrypt

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
    // The original route had a nested user object, let's keep it consistent
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

        // 1. Find the user by the ID from the token
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2. Verify the current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect current password" });
        }

        // 3. Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 4. Save the new password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });

    } catch (err) {
        console.error("Error changing password:", err.message);
        res.status(500).json({ message: "Server error while changing password" });
    }
};
