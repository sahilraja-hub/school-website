import rateLimit from 'express-rate-limit';
import { RateLimitError } from '../errors';

// Rate limiter for login & registration endpoints to mitigate brute force & credential stuffing
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'test' ? 1000 : 15, // 15 requests per 15 minutes in non-test
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  handler: (req, res, next) => {
    next(new RateLimitError('Too many authentication attempts. Please try again after 15 minutes.'));
  },
});

// Rate limiter for token refresh
export const refreshRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'test' ? 1000 : 60,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  handler: (req, res, next) => {
    next(new RateLimitError('Too many token refresh requests. Please slow down.'));
  },
});
