export interface AdmissionAuditLog {
  id: string;
  applicationId: string;
  applicationNumber: string;
  action:
    | 'STATUS_CHANGE'
    | 'NOTE_ADDED'
    | 'CORRECTION_REQUESTED'
    | 'APPROVED'
    | 'REJECTED'
    | 'CONVERT_TO_STUDENT'
    | 'DRAFT_CREATED'
    | 'APPLICATION_SUBMITTED'
    | 'APPLICATION_RESUBMITTED'
    | 'DOCUMENT_UPLOADED';
  performedBy: {
    id: string;
    name: string;
    role: string;
    email: string;
  };
  details: Record<string, any>;
  timestamp: string;
}

class AdmissionAuditRepository {
  private logs: AdmissionAuditLog[] = [];

  public logAction(
    entry: Omit<AdmissionAuditLog, 'id' | 'timestamp'> & { timestamp?: string }
  ): AdmissionAuditLog {
    const log: AdmissionAuditLog = {
      id: `audit-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: entry.timestamp || new Date().toISOString(),
      ...entry,
    };
    this.logs.unshift(log);
    return log;
  }

  public getLogsByApplicationId(applicationId: string): AdmissionAuditLog[] {
    return this.logs.filter(
      (l) => l.applicationId === applicationId || l.applicationNumber === applicationId
    );
  }

  public getAllLogs(limit = 100): AdmissionAuditLog[] {
    return this.logs.slice(0, limit);
  }

  public clear(): void {
    this.logs = [];
  }
}

export const admissionAuditRepository = new AdmissionAuditRepository();
