// 📂 models/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // --- 2FA Fields ---
  isTwoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  twoFactorSecret: {
    type: String, // This will store the secret provided by speakeasy
    default: null,
  },

}, { timestamps: true });

export default mongoose.model("User", userSchema);
