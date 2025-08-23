// 📂 controllers/activityController.js
// PURPOSE: Handles logic for retrieving activity logs.

import Activity from "../models/Activity.js";

/**
 * @desc Get all activities for the current user
 * @route GET /api/activity
 * @access Private
 */
export const listActivity = async (req, res) => {
  try {
    // BUG FIX: The query must use "userId" to match the Activity schema.
    const activities = await Activity.find({ userId: req.user.id })
      .sort({ createdAt: -1 }) // Sort by most recent
      .limit(50); // Limit to the last 50 activities for performance

    res.status(200).json(activities);
  } catch (err) {
    console.error("Error fetching activities:", err);
    res.status(500).json({ message: "Server error" });
  }
};
