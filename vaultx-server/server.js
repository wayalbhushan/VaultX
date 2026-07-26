import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

// Route Imports
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import secretRoutes from "./routes/secretRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import twoFactorRoutes from "./routes/twoFactorRoutes.js";

dotenv.config();

// Assert MASTER_KEY exists
const MASTER_KEY = process.env.MASTER_KEY;
if (!MASTER_KEY || MASTER_KEY.length !== 64) {
  throw new Error("CRITICAL: MASTER_KEY is missing or invalid in .env! Must be a 64-char hex string.");
}

const app = express();

// Restrictive CORS configuration
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// Advanced Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: { policy: "same-origin" },
    frameguard: { action: "deny" },
    noSniff: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Global Rate Limiter for API endpoints
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: "Too many requests from this IP, please try again later." },
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/secrets", secretRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/2fa", twoFactorRoutes);

// DB + Server Initialization
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
