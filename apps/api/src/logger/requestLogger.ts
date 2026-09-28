import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  req.startTime = start;

  // Intercept finish to compute elapsed time
  res.on('finish', () => {
    const durationMs = Date.now() - start;
    const statusCode = res.statusCode;

    const logContext = {
      requestId: req.id,
      method: req.method,
      path: req.originalUrl || req.url,
      statusCode,
      durationMs,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      userId: req.user?.id,
    };

    const message = `${req.method} ${req.originalUrl || req.url} ${statusCode} - ${durationMs}ms`;

    if (statusCode >= 500) {
      logger.error(message, undefined, logContext);
    } else if (statusCode >= 400) {
      logger.warn(message, logContext);
    } else {
      logger.info(message, logContext);
    }
  });

  next();
};
