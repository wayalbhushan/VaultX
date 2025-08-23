// 📂 routes/activityRoutes.js
// PURPOSE: Defines API endpoint for listing user activity.

import express from "express";
import { listActivity } from "../controllers/activityController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect the route
router.use(authMiddleware);

// Only a GET route is needed. Creation is handled internally.
router.get("/", listActivity);

// The POST route that used createActivity has been removed.

export default router;
