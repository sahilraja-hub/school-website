import { config } from '../config';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  requestId?: string;
  userId?: string;
  ip?: string;
  path?: string;
  method?: string;
  durationMs?: number;
  statusCode?: number;
  [key: string]: any;
}

const SENSITIVE_KEYS = new Set([
  'password',
  'passwordhash',
  'token',
  'accesstoken',
  'refreshtoken',
  'authorization',
  'cookie',
  'secret',
]);

const sanitize = (data: any): any => {
  if (!data || typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(sanitize);

  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      clean[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      clean[key] = sanitize(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
};

class StructuredLogger {
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const cleanContext = context ? sanitize(context) : undefined;

    if (config.nodeEnv === 'production') {
      return JSON.stringify({
        timestamp,
        level,
        message,
        ...cleanContext,
      });
    }

    // Development colorized format
    const reqIdStr = cleanContext?.requestId ? ` [${cleanContext.requestId.slice(0, 8)}]` : '';
    const metaStr = cleanContext ? ` ${JSON.stringify(cleanContext)}` : '';
    return `[${level.toUpperCase()}] ${timestamp}${reqIdStr} - ${message}${metaStr}`;
  }

  public debug(message: string, context?: LogContext): void {
    if (config.nodeEnv === 'production') return;
    if (config.nodeEnv !== 'test') {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  public info(message: string, context?: LogContext): void {
    if (config.nodeEnv !== 'test') {
      console.log(this.formatMessage('info', message, context));
    }
  }

  public warn(message: string, context?: LogContext): void {
    if (config.nodeEnv !== 'test') {
      console.warn(this.formatMessage('warn', message, context));
    }
  }

  public error(message: string, error?: any, context?: LogContext): void {
    const errObj =
      error instanceof Error
        ? { message: error.message, name: error.name, stack: error.stack }
        : error;

    const fullContext = {
      ...context,
      error: errObj,
    };

    if (config.nodeEnv !== 'test') {
      console.error(this.formatMessage('error', message, fullContext));
    }
  }
}

export const logger = new StructuredLogger();
