import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/school_portal',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'oakridge_super_secure_access_secret_key_2026',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'oakridge_super_secure_refresh_secret_key_2026',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    cookieMaxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  },
};
