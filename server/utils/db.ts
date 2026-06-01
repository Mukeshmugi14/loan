import mongoose from 'mongoose';
import { env } from '../config/env';

const MONGODB_URI = env.MONGODB_URI;

export const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI is required to connect to database");
    }
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${(error as Error).message}`);
    process.exit(1);
  }
};
