import { config } from '../config';

export const logger = {
  info: (message: string, meta?: any) => {
    const timestamp = new Date().toISOString();
    if (config.nodeEnv === 'production') {
      console.log(JSON.stringify({ timestamp, level: 'info', message, ...meta }));
    } else {
      console.log(`[INFO] ${timestamp} - ${message}`, meta || '');
    }
  },
  warn: (message: string, meta?: any) => {
    const timestamp = new Date().toISOString();
    if (config.nodeEnv === 'production') {
      console.warn(JSON.stringify({ timestamp, level: 'warn', message, ...meta }));
    } else {
      console.warn(`[WARN] ${timestamp} - ${message}`, meta || '');
    }
  },
  error: (message: string, error?: any) => {
    const timestamp = new Date().toISOString();
    const errObj = error instanceof Error ? { message: error.message, stack: error.stack } : error;
    if (config.nodeEnv === 'production') {
      console.error(JSON.stringify({ timestamp, level: 'error', message, error: errObj }));
    } else {
      console.error(`[ERROR] ${timestamp} - ${message}`, errObj || '');
    }
  },
  http: (message: string) => {
    if (config.nodeEnv !== 'test') {
      console.log(`[HTTP] ${message}`);
    }
  },
};
