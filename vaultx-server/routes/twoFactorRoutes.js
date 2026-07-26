import express from "express";
import {
  generateTwoFactorSecret,
  verifyTwoFactorToken,
  disableTwoFactor,
} from "../controllers/twoFactorController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validation.js";
import { verify2faSchema, disable2faSchema } from "../utils/schemas.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/generate", generateTwoFactorSecret);
router.post("/verify", validateBody(verify2faSchema), verifyTwoFactorToken);
router.post("/disable", validateBody(disable2faSchema), disableTwoFactor);

export default router;