import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.warn("⚠️ MONGODB_URI is not defined in .env. Skipping database connection for boilerplate.");
      return;
    }
    await mongoose.connect(uri);
    console.log("✅ MongoDB Connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};
