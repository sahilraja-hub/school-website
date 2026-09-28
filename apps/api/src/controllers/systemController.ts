import { Request, Response } from 'express';
import { systemRepository } from '../repositories/systemRepository';

// ==========================================
// SETTINGS
// ==========================================
export const getSettings = async (req: Request, res: Response): Promise<void> => {
  const settings = await systemRepository.getSettings();
  res.json({
    success: true,
    data: settings,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  const updated = await systemRepository.updateSettings(req.body);
  await systemRepository.log({
    userId: req.user?.id,
    action: 'UPDATE_SETTINGS',
    entityType: 'SETTINGS',
    entityId: 'GLOBAL',
    details: req.body,
    ipAddress: req.ip,
  });

  res.json({
    success: true,
    message: 'System settings updated',
    data: updated,
    meta: { requestId: req.id, timestamp: new Date().toISOString() },
  });
};

// ==========================================
// AUDIT LOGS
// ==========================================
export const listAuditLogs = async (req: Request, res: Response): Promise<void> => {
  const { page, limit, userId, entityType, action, search } = req.query as any;
  const result = await systemRepository.listAuditLogs({
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 20,
    userId,
    entityType,
    action,
    search,
  });

  res.json({
    success: true,
    data: result.items,
    meta: {
      requestId: req.id,
      timestamp: new Date().toISOString(),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    },
  });
};
