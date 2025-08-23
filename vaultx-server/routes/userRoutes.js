import express from "express";
// Import both controller functions
import { getUserProfile, changePassword } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes in this file are protected by the auth middleware
router.use(authMiddleware);

router.get("/me", getUserProfile);

// Add the new route for changing the password
router.put("/change-password", changePassword);

export default router;
