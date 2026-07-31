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
  console.warn("WARNING: MASTER_KEY is missing or invalid in .env! Must be a 64-char hex string.");
}

const app = express();

// Enable trust proxy for Vercel / reverse proxies
app.set("trust proxy", 1);

// Dynamic CORS configuration for Vercel & local dev
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*") || process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

// Advanced Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP header on API server to prevent breaking cross-domain client requests
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    frameguard: { action: "deny" },
    noSniff: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Serverless MongoDB Connection Middleware
let isConnected = false;
const connectDB = async (req, res, next) => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return next();
  }
  try {
    const URI = process.env.MONGO_URI;
    if (!URI) {
      return res.status(500).json({ error: "MONGO_URI environment variable is missing on server." });
    }
    await mongoose.connect(URI);
    isConnected = true;
    console.log("MongoDB connected successfully");
    next();
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    return res.status(500).json({ error: "Database connection failed. Please check MongoDB Atlas status." });
  }
};

app.use(connectDB);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "VaultX API Server active", timestamp: new Date() });
});

// Global Rate Limiter for API endpoints
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { error: "Too many requests from this IP, please try again later." },
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/secrets", secretRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/2fa", twoFactorRoutes);

// Server Initialization for Local Dev
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
