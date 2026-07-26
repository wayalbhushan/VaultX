import mongoose from "mongoose";

const secretVersionSchema = new mongoose.Schema({
  version: { type: Number, required: true },
  title: { type: String, required: true },
  encryptedData: { type: String, required: true },
  iv: { type: String, required: true },
  authTag: { type: String, default: null },
  type: { type: String, required: true },
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

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
      default: null,
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
    version: {
      type: Number,
      default: 1,
    },
    versions: [secretVersionSchema],
    expiresAt: {
      type: Date,
      default: null,
    },
    rotationReminderDays: {
      type: Number,
      default: null,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    folder: {
      type: String,
      default: "",
      trim: true,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Compound indexes for fast querying and filtering
secretSchema.index({ userId: 1, createdAt: -1 });
secretSchema.index({ userId: 1, isFavorite: -1 });
secretSchema.index({ userId: 1, tags: 1 });
secretSchema.index({ userId: 1, folder: 1 });

export default mongoose.model("Secret", secretSchema);
