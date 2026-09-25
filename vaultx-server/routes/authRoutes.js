import express from "express";
import rateLimit from "express-rate-limit";
import {
  signupUser,
  loginUser,
  validate2FALogin,
  refreshSession,
  logoutUser,
} from "../controllers/authController.js";
import { validateBody } from "../middleware/validation.js";
import { signupSchema, loginSchema, validate2faSchema } from "../utils/schemas.js";

const router = express.Router();

// Strict rate limiter for sensitive authentication endpoints (5 attempts per 15 min)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many authentication attempts. Please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/signup", authLimiter, validateBody(signupSchema), signupUser);
router.post("/login", authLimiter, validateBody(loginSchema), loginUser);
router.post("/validate-2fa", authLimiter, validateBody(validate2faSchema), validate2FALogin);
router.post("/refresh", refreshSession);
router.post("/logout", logoutUser);

export default router;
