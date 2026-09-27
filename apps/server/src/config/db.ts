import mongoose from 'mongoose';
import { config } from './index';

export const connectDB = async (): Promise<typeof mongoose | null> => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection failed: ${(error as Error).message}`);
    console.warn(`[MongoDB] Running in offline/disconnected database mode. Ensure MongoDB is running or configure MONGODB_URI in apps/server/.env.`);
    return null;
  }
};
