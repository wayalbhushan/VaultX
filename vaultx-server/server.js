// 📂 server.js

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

// Route Imports
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import secretRoutes from "./routes/secretRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import twoFactorRoutes from "./routes/twoFactorRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100, // limit each IP
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/secrets", secretRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/2fa", twoFactorRoutes); 
// DB + Server
const PORT = process.env.PORT || 5000;
const URI = process.env.MONGO_URI;

mongoose
  .connect(URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB error:", err.message));

// Master Key Check (moved from original server.js for better placement)
const MASTER_KEY = process.env.MASTER_KEY;
if (!MASTER_KEY) {
  throw new Error("MASTER_KEY is missing from .env!");
}
