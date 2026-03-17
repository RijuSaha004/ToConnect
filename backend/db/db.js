import mongoose from "mongoose"

export const connectDB = async (url) => {
  try {
    const connectionInstance = await mongoose.connect(url);
    // console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
    // return connectionInstance;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};


