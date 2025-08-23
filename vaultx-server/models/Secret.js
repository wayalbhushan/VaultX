import mongoose from "mongoose";

const secretSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    type: {
      type: String,
      enum: ["secret", "key", "password"],
      default: "secret",
      required: true,
    },
    description: {
      type: String,
      default: "", // optional, can hold additional notes about the secret
    },
  },
  { timestamps: true }
);

export default mongoose.model("Secret", secretSchema);
