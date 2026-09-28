import mongoose from 'mongoose';

export interface HealthCheckResult {
  status: 'ok' | 'degraded';
  timestamp: string;
  uptime: number;
  environment: string;
  service: string;
  version: string;
  database: {
    status: 'connected' | 'connecting' | 'disconnected' | 'offline_in_memory';
    host?: string;
  };
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    rssMB: number;
  };
}

class HealthRepository {
  public getHealth(): HealthCheckResult {
    const mem = process.memoryUsage();
    const readyState = mongoose.connection.readyState;

    let dbStatus: 'connected' | 'connecting' | 'disconnected' | 'offline_in_memory';
    switch (readyState) {
      case 1:
        dbStatus = 'connected';
        break;
      case 2:
        dbStatus = 'connecting';
        break;
      default:
        dbStatus = 'offline_in_memory';
        break;
    }

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      service: 'Oakridge School API',
      version: '1.0.0',
      database: {
        status: dbStatus,
        host: dbStatus === 'connected' ? mongoose.connection.host : 'in-memory repository fallback',
      },
      memory: {
        heapUsedMB: Math.round((mem.heapUsed / 1024 / 1024) * 100) / 100,
        heapTotalMB: Math.round((mem.heapTotal / 1024 / 1024) * 100) / 100,
        rssMB: Math.round((mem.rss / 1024 / 1024) * 100) / 100,
      },
    };
  }

  public isReady(): boolean {
    // Process is ready to receive requests (memory within acceptable bounds)
    const mem = process.memoryUsage();
    const maxHeapMB = 1024; // 1GB
    const currentHeapMB = mem.heapUsed / 1024 / 1024;
    return currentHeapMB < maxHeapMB;
  }
}

export const healthRepository = new HealthRepository();
