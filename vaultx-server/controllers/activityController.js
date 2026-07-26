import crypto from "crypto";
import Activity from "../models/Activity.js";

/**
 * Internal helper to record an immutable, hash-chained activity log entry.
 */
export const recordActivity = async (userId, action) => {
  try {
    const lastActivity = await Activity.findOne({ userId }).sort({ createdAt: -1 });
    const previousHash = lastActivity
      ? lastActivity.hash
      : "0000000000000000000000000000000000000000000000000000000000000000";

    const timestamp = new Date();
    const hashData = `${userId}:${action}:${timestamp.toISOString()}:${previousHash}`;
    const hash = crypto.createHash("sha256").update(hashData).digest("hex");

    await Activity.create({
      userId,
      action,
      previousHash,
      hash,
      timestamp,
    });
  } catch (err) {
    console.error("Failed to record immutable audit log:", err.message);
  }
};

/**
 * @desc Get all activities for the current user
 * @route GET /api/activity
 * @access Private
 */
export const listActivity = async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json(activities);
  } catch (err) {
    console.error("Error fetching activities:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Verify cryptographic hash-chain integrity of user audit logs
 * @route GET /api/activity/verify
 * @access Private
 */
export const verifyAuditLedger = async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user.id }).sort({ createdAt: 1 });

    let isIntact = true;
    let compromisedIndex = -1;

    for (let i = 0; i < activities.length; i++) {
      const current = activities[i];
      const expectedPrevHash =
        i === 0
          ? "0000000000000000000000000000000000000000000000000000000000000000"
          : activities[i - 1].hash;

      if (current.previousHash !== expectedPrevHash) {
        isIntact = false;
        compromisedIndex = i;
        break;
      }

      const hashData = `${current.userId}:${current.action}:${new Date(current.timestamp).toISOString()}:${current.previousHash}`;
      const recomputedHash = crypto.createHash("sha256").update(hashData).digest("hex");

      if (current.hash !== recomputedHash) {
        isIntact = false;
        compromisedIndex = i;
        break;
      }
    }

    res.status(200).json({
      verified: isIntact,
      totalEntries: activities.length,
      status: isIntact ? "Audit ledger cryptographic integrity verified 100%" : "Integrity violation detected",
      compromisedIndex: compromisedIndex !== -1 ? compromisedIndex : null,
    });
  } catch (err) {
    console.error("Error verifying audit ledger:", err);
    res.status(500).json({ message: "Server error during audit verification" });
  }
};
