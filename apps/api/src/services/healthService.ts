import { healthRepository, HealthCheckResult } from '../repositories/healthRepository';

class HealthService {
  public getHealth(): HealthCheckResult {
    return healthRepository.getHealth();
  }

  public getReadiness(): { ready: boolean; timestamp: string; uptime: number } {
    const isReady = healthRepository.isReady();
    return {
      ready: isReady,
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
    };
  }
}

export const healthService = new HealthService();
