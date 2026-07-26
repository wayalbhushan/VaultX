import express from "express";
import rateLimit from "express-rate-limit";
import {
  signupUser,
  loginUser,
  validateLoginToken,
  refreshSession,
  logoutUser,
} from "../controllers/authController.js";

const router = express.Router();

// Strict rate limiter for sensitive authentication endpoints (5 attempts per 15 min)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many authentication attempts. Please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/signup", authLimiter, signupUser);
router.post("/login", authLimiter, loginUser);
router.post("/validate-2fa", authLimiter, validateLoginToken);
router.post("/refresh", refreshSession);
router.post("/logout", logoutUser);

export default router;
