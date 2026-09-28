export type SecurityEventType =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILURE'
  | 'ACCOUNT_LOCKED'
  | 'ACCOUNT_UNLOCKED'
  | 'LOGOUT'
  | 'LOGOUT_ALL'
  | 'TOKEN_REFRESH'
  | 'TOKEN_REUSE_DETECTED'
  | 'UNAUTHORIZED_ACCESS'
  | 'FORBIDDEN_ACCESS'
  | 'PASSWORD_CHANGED';

export type SecuritySeverity = 'INFO' | 'WARN' | 'ALERT';

export interface SecurityEvent {
  id: string;
  eventType: SecurityEventType;
  severity: SecuritySeverity;
  userId?: string;
  email?: string;
  role?: string;
  ip?: string;
  userAgent?: string;
  resource?: string;
  reason?: string;
  details?: Record<string, any>;
  timestamp: string;
}

class SecurityLoggerService {
  private events: SecurityEvent[] = [];
  private readonly maxEvents = 1000;

  public log(event: Omit<SecurityEvent, 'id' | 'timestamp'>): SecurityEvent {
    const recordedEvent: SecurityEvent = {
      ...event,
      id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    this.events.unshift(recordedEvent);
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }

    // In production or dev (non-test), print alert/warn events to stdout/stderr
    if (process.env.NODE_ENV !== 'test') {
      const prefix = `[SECURITY ${recordedEvent.severity}] [${recordedEvent.eventType}]`;
      const message = `${recordedEvent.email || recordedEvent.userId || 'Anonymous'} from ${recordedEvent.ip || 'unknown IP'}: ${recordedEvent.reason || ''}`;
      if (recordedEvent.severity === 'ALERT') {
        console.error(`🚨 ${prefix} ${message}`);
      } else if (recordedEvent.severity === 'WARN') {
        console.warn(`⚠️ ${prefix} ${message}`);
      } else {
        console.info(`🛡️ ${prefix} ${message}`);
      }
    }

    return recordedEvent;
  }

  public getEvents(filter?: {
    eventType?: SecurityEventType;
    email?: string;
    severity?: SecuritySeverity;
    limit?: number;
  }): SecurityEvent[] {
    let result = this.events;

    if (filter?.eventType) {
      result = result.filter((e) => e.eventType === filter.eventType);
    }
    if (filter?.email) {
      result = result.filter((e) => e.email?.toLowerCase() === filter.email?.toLowerCase());
    }
    if (filter?.severity) {
      result = result.filter((e) => e.severity === filter.severity);
    }

    return result.slice(0, filter?.limit || 100);
  }

  public clear(): void {
    this.events = [];
  }
}

export const securityLogger = new SecurityLoggerService();
