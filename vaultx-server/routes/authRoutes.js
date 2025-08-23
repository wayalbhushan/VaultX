
import express from "express";
// ✅ 1. Import all three functions
import { signupUser, loginUser, validateLoginToken } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);

// ✅ 2. Add the new route for validating the 2FA token
router.post("/validate-2fa", validateLoginToken);

export default router;
