import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import apiRoutes from './routes';
import { requestId } from './middleware/requestId';
import { requestLogger } from './logger';
import { errorHandler } from './middleware/errorHandler';
import { NotFoundError, RateLimitError } from './errors';
import { getHealth, getReadiness } from './controllers/healthController';

export const createApp = (): express.Application => {
  const app = express();

  // 1. Request ID Attribution (Correlation ID)
  app.use(requestId);

  // 2. Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );

  // 3. CORS Configuration
  app.use(
    cors({
      origin: [config.clientUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id', 'X-Correlation-Id'],
      exposedHeaders: ['X-Request-Id'],
    })
  );

  // 4. Request Body & Cookie Parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // 5. Structured HTTP Request Logging
  app.use(requestLogger);

  // 6. Top-Level Health & Readiness Checks
  app.get('/health', getHealth);
  app.get('/ready', getReadiness);

  // 7. Global API Rate Limiting (bypassed in test environment)
  if (config.nodeEnv !== 'test') {
    const globalLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 500,
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res, next) => {
        next(new RateLimitError('Too many requests from this IP, please try again after 15 minutes.'));
      },
    });
    app.use('/api', globalLimiter);
  }

  // 8. API Version Prefix: /api/v1 (and backwards compatible /api alias)
  app.use(config.apiPrefix, apiRoutes);
  if (config.apiPrefix !== '/api') {
    app.use('/api', apiRoutes);
  }

  // 9. 404 Resource Handler
  app.use((req, res, next) => {
    next(new NotFoundError(`Endpoint not found: ${req.method} ${req.originalUrl}`));
  });

  // 10. Centralized Global Error Handler
  app.use(errorHandler);

  return app;
};

export default createApp;
