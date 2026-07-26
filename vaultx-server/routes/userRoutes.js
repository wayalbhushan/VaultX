import express from "express";
import rateLimit from "express-rate-limit";
import { getUserProfile, changePassword } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validation.js";
import { changePasswordSchema } from "../utils/schemas.js";

const router = express.Router();

// Strict rate limiter for password changes (5 attempts per 15 min)
const passwordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many password change attempts. Please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(authMiddleware);

router.get("/me", getUserProfile);
router.put("/change-password", passwordLimiter, validateBody(changePasswordSchema), changePassword);

export default router;
