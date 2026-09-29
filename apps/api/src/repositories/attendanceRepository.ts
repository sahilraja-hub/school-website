import { schoolActorsRepository } from './schoolActorsRepository';

export interface IAttendanceRecord {
  id: string;
  studentId: string;
  sectionId: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  remarks?: string;
  recordedById?: string;
  createdAt: Date;
  updatedAt: Date;
}

class AttendanceRepository {
  private records: Map<string, IAttendanceRecord> = new Map();

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    const today = new Date().toISOString().split('T')[0];
    const id = `att-${Date.now().toString(36)}`;
    this.records.set(id, {
      id,
      studentId: 'stud-001',
      sectionId: 'sec-10a',
      date: today,
      status: 'PRESENT',
      remarks: 'On time',
      recordedById: 'usr_teacher_001',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const id2 = `att-stud-002-seeded`;
    this.records.set(id2, {
      id: id2,
      studentId: 'stud-002',
      sectionId: 'sec-10a',
      date: today,
      status: 'LATE',
      remarks: '15 mins tardy',
      recordedById: 'usr_teacher_001',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const id3 = `att-stud-003-seeded`;
    this.records.set(id3, {
      id: id3,
      studentId: 'stud-003',
      sectionId: 'sec-10b',
      date: today,
      status: 'PRESENT',
      remarks: 'Attentive and punctual',
      recordedById: 'usr_teacher_001',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public async listAttendance(query: { page?: number; limit?: number; sectionId?: string; studentId?: string; date?: string; status?: string }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 20));
    let items = Array.from(this.records.values());

    if (query.sectionId) items = items.filter((r) => r.sectionId === query.sectionId);
    if (query.studentId) items = items.filter((r) => r.studentId === query.studentId);
    if (query.date) items = items.filter((r) => r.date === query.date);
    if (query.status) items = items.filter((r) => r.status === query.status);

    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paged = items.slice((page - 1) * limit, page * limit);

    const enriched = await Promise.all(
      paged.map(async (r) => {
        const student = await schoolActorsRepository.getStudentById(r.studentId);
        return {
          ...r,
          student: student ? { admissionNumber: student.admissionNumber, rollNumber: student.rollNumber, user: student.user } : undefined,
        };
      })
    );

    return { items: enriched, total, page, limit, totalPages };
  }

  public async recordBatch(data: { sectionId: string; date: string; recordedById?: string; records: Array<{ studentId: string; status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'; remarks?: string }> }) {
    const savedRecords: IAttendanceRecord[] = [];

    for (const item of data.records) {
      // check if existing for student on this date
      let existingId: string | undefined;
      for (const [id, rec] of this.records.entries()) {
        if (rec.studentId === item.studentId && rec.date === data.date) {
          existingId = id;
          break;
        }
      }

      if (existingId) {
        const existing = this.records.get(existingId)!;
        existing.status = item.status;
        existing.remarks = item.remarks;
        existing.updatedAt = new Date();
        this.records.set(existingId, existing);
        savedRecords.push(existing);
      } else {
        const id = `att-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
        const rec: IAttendanceRecord = {
          id,
          studentId: item.studentId,
          sectionId: data.sectionId,
          date: data.date,
          status: item.status,
          remarks: item.remarks,
          recordedById: data.recordedById,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        this.records.set(id, rec);
        savedRecords.push(rec);
      }
    }

    return savedRecords;
  }

  public async getStats(query: { sectionId?: string; studentId?: string; startDate?: string; endDate?: string }) {
    let items = Array.from(this.records.values());
    if (query.sectionId) items = items.filter((r) => r.sectionId === query.sectionId);
    if (query.studentId) items = items.filter((r) => r.studentId === query.studentId);
    if (query.startDate) items = items.filter((r) => r.date >= query.startDate!);
    if (query.endDate) items = items.filter((r) => r.date <= query.endDate!);

    const total = items.length;
    const present = items.filter((r) => r.status === 'PRESENT').length;
    const absent = items.filter((r) => r.status === 'ABSENT').length;
    const late = items.filter((r) => r.status === 'LATE').length;
    const excused = items.filter((r) => r.status === 'EXCUSED').length;

    const rate = total > 0 ? Number(((present + late) / total * 100).toFixed(1)) : 100;

    return { total, present, absent, late, excused, attendanceRate: rate };
  }
}

export const attendanceRepository = new AttendanceRepository();
