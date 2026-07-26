import express from "express";
import { listActivity, verifyAuditLedger } from "../controllers/activityController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", listActivity);
router.get("/verify", verifyAuditLedger);

export default router;
