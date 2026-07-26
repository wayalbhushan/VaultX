import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
    },
    previousHash: {
      type: String,
      default: "0000000000000000000000000000000000000000000000000000000000000000",
    },
    hash: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

activitySchema.index({ userId: 1, createdAt: -1 });

// Enforce strict immutability at Mongoose ORM layer
activitySchema.pre("save", function (next) {
  if (!this.isNew) {
    return next(new Error("CRITICAL SECURITY VIOLATION: Existing audit log entries are immutable."));
  }
  next();
});

const blockMutation = function (next) {
  return next(new Error("CRITICAL SECURITY VIOLATION: Audit log entries cannot be updated or deleted."));
};

activitySchema.pre("updateOne", blockMutation);
activitySchema.pre("findOneAndUpdate", blockMutation);
activitySchema.pre("updateMany", blockMutation);
activitySchema.pre("deleteOne", blockMutation);
activitySchema.pre("findOneAndDelete", blockMutation);
activitySchema.pre("deleteMany", blockMutation);

export default mongoose.model("Activity", activitySchema);
