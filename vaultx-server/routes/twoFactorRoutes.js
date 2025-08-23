
import express from "express";
import {
  generateTwoFactorSecret,
  verifyTwoFactorToken,
  disableTwoFactor, // ✅ 1. Import the new disable function
} from "../controllers/twoFactorController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/generate", generateTwoFactorSecret);
router.post("/verify", verifyTwoFactorToken);

// ✅ 2. Add the new route for disabling 2FA
router.post("/disable", disableTwoFactor);

export default router;