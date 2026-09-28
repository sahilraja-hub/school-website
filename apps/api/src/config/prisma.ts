import { PrismaClient } from '@prisma/client';
import { logger } from '../logger';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  global.__prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

export const checkPrismaConnection = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    logger.info('[PostgreSQL] Prisma connected successfully');
    return true;
  } catch (error) {
    logger.warn('[PostgreSQL] Prisma offline or database unavailable. Falling back to persistent repository layer.');
    return false;
  }
};
