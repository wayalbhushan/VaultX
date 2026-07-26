import mongoose from "mongoose";

const secretSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    encryptedData: {
      type: String,
      required: true,
    },
    iv: {
      type: String,
      required: true,
    },
    authTag: {
      type: String,
      default: null, // GCM authentication tag
    },
    type: {
      type: String,
      enum: ["secret", "key", "password"],
      default: "secret",
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Compound index for optimized querying and sorting
secretSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Secret", secretSchema);
