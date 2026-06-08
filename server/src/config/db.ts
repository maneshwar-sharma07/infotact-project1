import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI not found");
    }

    await mongoose.connect(mongoUri);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Database Connection Failed", error);
    process.exit(1);
  }
};