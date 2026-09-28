import { Request, Response, NextFunction } from 'express';

const generateRequestId = (): string => {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
};

export const requestId = (req: Request, res: Response, next: NextFunction): void => {
  const existingId = (req.headers['x-request-id'] || req.headers['x-correlation-id']) as string;
  const currentId = existingId && existingId.trim().length > 0 ? existingId.trim() : generateRequestId();

  req.id = currentId;
  res.setHeader('X-Request-Id', currentId);

  next();
};
