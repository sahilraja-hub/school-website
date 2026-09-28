import { userRepository } from './userRepository';

export interface ISettingsRecord {
  schoolName: string;
  schoolEmail: string;
  schoolPhone: string;
  address: string;
  academicYear: string;
  currentTerm: string;
  maintenanceMode: boolean;
  updatedAt: Date;
}

export interface IAuditLogRecord {
  id: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

class SystemRepository {
  private settings: ISettingsRecord = {
    schoolName: 'Oakridge International Academy',
    schoolEmail: 'admissions@oakridge.edu',
    schoolPhone: '+1 (555) 234-5678',
    address: '1000 Academy Way, Cambridge, MA 02138',
    academicYear: '2026-2027',
    currentTerm: 'Term 1',
    maintenanceMode: false,
    updatedAt: new Date(),
  };

  private auditLogs: IAuditLogRecord[] = [];

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    this.auditLogs.push({
      id: 'aud-001',
      userId: 'usr_superadmin_001',
      action: 'SYSTEM_INITIALIZATION',
      entityType: 'PLATFORM',
      entityId: 'ROOT',
      details: { version: '1.0.0', status: 'SUCCESS' },
      ipAddress: '127.0.0.1',
      userAgent: 'Bootstrap',
      timestamp: new Date(),
    });
  }

  // --- Settings ---
  public async getSettings(): Promise<ISettingsRecord> {
    return { ...this.settings };
  }

  public async updateSettings(data: Partial<ISettingsRecord>): Promise<ISettingsRecord> {
    Object.assign(this.settings, data, { updatedAt: new Date() });
    return { ...this.settings };
  }

  // --- Audit Logs ---
  public async log(data: Omit<IAuditLogRecord, 'id' | 'timestamp'>): Promise<IAuditLogRecord> {
    const record: IAuditLogRecord = {
      ...data,
      id: `aud-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date(),
    };
    this.auditLogs.unshift(record);
    return record;
  }

  public async listAuditLogs(query: { page?: number; limit?: number; userId?: string; entityType?: string; action?: string; search?: string }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 20));
    let items = [...this.auditLogs];

    if (query.userId) items = items.filter((l) => l.userId === query.userId);
    if (query.entityType) items = items.filter((l) => l.entityType === query.entityType);
    if (query.action) items = items.filter((l) => l.action.toLowerCase().includes(query.action!.toLowerCase()));
    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter((l) => l.action.toLowerCase().includes(s) || l.entityType.toLowerCase().includes(s) || l.entityId.toLowerCase().includes(s));
    }

    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paged = items.slice((page - 1) * limit, page * limit);

    const enriched = await Promise.all(
      paged.map(async (l) => {
        const user = l.userId ? await userRepository.findById(l.userId) : null;
        return {
          ...l,
          userName: user ? `${user.firstName} ${user.lastName}`.trim() : undefined,
          userEmail: user?.email,
        };
      })
    );

    return { items: enriched, total, page, limit, totalPages };
  }
}

export const systemRepository = new SystemRepository();
