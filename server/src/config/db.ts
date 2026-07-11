/*import mongoose from 'mongoose';

/**
 * Establishes a connection to MongoDB using the MONGO_URI environment variable.
 * Logs success on connection or exits the process if connection fails.
 
export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not defined.');
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`Database connected successfully: MongoDB host at ${conn.connection.host}`);
  } catch (error) {
    console.error('CRITICAL: Failed to connect to MongoDB database.', error);
    process.exit(1);
  }
};

export default connectDB;*/

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // Use MONGODB_URI or MONGO_URI
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;



