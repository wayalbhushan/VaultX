// 📂 models/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true },
  email:    { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },

  // --- 2FA Fields ---
  isTwoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  twoFactorSecret: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },

}, { timestamps: true });

export default mongoose.model("User", userSchema);
