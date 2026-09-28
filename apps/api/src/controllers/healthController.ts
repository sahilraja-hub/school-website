import { Request, Response } from 'express';
import { healthService } from '../services/healthService';

export const getHealth = (req: Request, res: Response): void => {
  const result = healthService.getHealth();
  res.json({
    ...result,
    meta: {
      requestId: req.id,
    },
  });
};

export const getReadiness = (req: Request, res: Response): void => {
  const result = healthService.getReadiness();
  if (result.ready) {
    res.status(200).json({
      status: 'ready',
      ...result,
      meta: {
        requestId: req.id,
      },
    });
  } else {
    res.status(503).json({
      status: 'not_ready',
      ...result,
      meta: {
        requestId: req.id,
      },
    });
  }
};
