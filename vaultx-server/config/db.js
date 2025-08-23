import mongoose from "mongoose";

const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 30000 });
    console.log("✅ MongoDB Atlas Connected...");
  } catch (err) {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  }
};

export default connectDB;
