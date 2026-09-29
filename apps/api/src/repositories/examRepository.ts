import { schoolActorsRepository } from './schoolActorsRepository';
import { academicRepository } from './academicRepository';

export interface IExamRecord {
  id: string;
  name: string;
  academicYear: string;
  term: string;
  startDate: string;
  endDate: string;
  status: 'DRAFT' | 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IExamSubjectRecord {
  id: string;
  examId: string;
  subjectId: string;
  sectionId: string;
  examDate: string;
  maxMarks: number;
  passMarks: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IResultRecord {
  id: string;
  examSubjectId: string;
  studentId: string;
  marksObtained: number;
  grade?: string;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

class ExamRepository {
  private exams: Map<string, IExamRecord> = new Map();
  private examSubjects: Map<string, IExamSubjectRecord> = new Map();
  private results: Map<string, IResultRecord> = new Map();

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    const examId = 'exam-midterm-2026';
    this.exams.set(examId, {
      id: examId,
      name: 'Mid-Term Examinations 2026',
      academicYear: '2026-2027',
      term: 'Term 1',
      startDate: '2026-10-15',
      endDate: '2026-10-25',
      status: 'SCHEDULED',
      description: 'First semester comprehensive examination',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const esId = 'es-math-101';
    this.examSubjects.set(esId, {
      id: esId,
      examId,
      subjectId: 'sub-math',
      sectionId: 'sec-10a',
      examDate: '2026-10-16',
      maxMarks: 100,
      passMarks: 40,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const resId = 'res-001';
    this.results.set(resId, {
      id: resId,
      examSubjectId: esId,
      studentId: 'stud-001',
      marksObtained: 94.5,
      grade: 'A+',
      remarks: 'Exemplary problem-solving in calculus section.',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const resId2 = 'res-002';
    this.results.set(resId2, {
      id: resId2,
      examSubjectId: esId,
      studentId: 'stud-002',
      marksObtained: 88.0,
      grade: 'A',
      remarks: 'Strong understanding of derivatives and integration principles.',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // --- Exams ---
  public async listExams(query: { page?: number; limit?: number; academicYear?: string; status?: string; search?: string }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 20));
    let items = Array.from(this.exams.values());

    if (query.academicYear) items = items.filter((e) => e.academicYear === query.academicYear);
    if (query.status) items = items.filter((e) => e.status === query.status);
    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter((e) => e.name.toLowerCase().includes(s));
    }

    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paged = items.slice((page - 1) * limit, page * limit);

    return { items: paged, total, page, limit, totalPages };
  }

  public async getExamById(id: string) {
    const exam = this.exams.get(id);
    if (!exam) return null;
    const subjects = Array.from(this.examSubjects.values()).filter((es) => es.examId === exam.id);
    return { ...exam, subjectsCount: subjects.length, subjects };
  }

  public async createExam(data: Omit<IExamRecord, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = `exam-${Date.now().toString(36)}`;
    const record: IExamRecord = { ...data, id, createdAt: new Date(), updatedAt: new Date() };
    this.exams.set(id, record);
    return record;
  }

  public async updateExam(id: string, data: Partial<IExamRecord>) {
    const exam = this.exams.get(id);
    if (!exam) return null;
    Object.assign(exam, data, { updatedAt: new Date() });
    this.exams.set(id, exam);
    return exam;
  }

  public async deleteExam(id: string) {
    return this.exams.delete(id);
  }

  // --- Exam Subjects ---
  public async getExamSubjectById(id: string) {
    return this.examSubjects.get(id) || null;
  }

  public async listExamSubjects(query: { examId?: string; sectionId?: string; subjectId?: string }) {
    let items = Array.from(this.examSubjects.values());
    if (query.examId) items = items.filter((es) => es.examId === query.examId);
    if (query.sectionId) items = items.filter((es) => es.sectionId === query.sectionId);
    if (query.subjectId) items = items.filter((es) => es.subjectId === query.subjectId);
    return items;
  }

  // --- Results ---
  public async listResults(query: { page?: number; limit?: number; examSubjectId?: string; studentId?: string }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 20));
    let items = Array.from(this.results.values());

    if (query.examSubjectId) items = items.filter((r) => r.examSubjectId === query.examSubjectId);
    if (query.studentId) items = items.filter((r) => r.studentId === query.studentId);

    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paged = items.slice((page - 1) * limit, page * limit);

    const enriched = await Promise.all(
      paged.map(async (r) => {
        const student = await schoolActorsRepository.getStudentById(r.studentId);
        const examSubject = this.examSubjects.get(r.examSubjectId);
        const subject = examSubject ? await academicRepository.getSubjectById(examSubject.subjectId) : null;
        const exam = examSubject ? this.exams.get(examSubject.examId) : null;

        return {
          ...r,
          studentName: student?.user?.firstName ? `${student.user.firstName} ${student.user.lastName}` : undefined,
          subjectName: subject?.name,
          examName: exam?.name,
          maxMarks: examSubject?.maxMarks || 100,
          passMarks: examSubject?.passMarks || 40,
          isPassed: r.marksObtained >= (examSubject?.passMarks || 40),
          percentage: Number(((r.marksObtained / (examSubject?.maxMarks || 100)) * 100).toFixed(1)),
        };
      })
    );

    return { items: enriched, total, page, limit, totalPages };
  }

  public async getResultById(id: string) {
    const r = this.results.get(id);
    if (!r) return null;
    const student = await schoolActorsRepository.getStudentById(r.studentId);
    const examSubject = this.examSubjects.get(r.examSubjectId);
    const subject = examSubject ? await academicRepository.getSubjectById(examSubject.subjectId) : null;
    const exam = examSubject ? this.exams.get(examSubject.examId) : null;

    return {
      ...r,
      studentName: student?.user?.firstName ? `${student.user.firstName} ${student.user.lastName}` : undefined,
      subjectName: subject?.name,
      examName: exam?.name,
      maxMarks: examSubject?.maxMarks || 100,
      passMarks: examSubject?.passMarks || 40,
      isPassed: r.marksObtained >= (examSubject?.passMarks || 40),
      percentage: Number(((r.marksObtained / (examSubject?.maxMarks || 100)) * 100).toFixed(1)),
    };
  }

  public async recordResult(data: Omit<IResultRecord, 'id' | 'createdAt' | 'updatedAt'>) {
    // Check if result already exists for student and examSubject
    for (const [id, res] of this.results.entries()) {
      if (res.examSubjectId === data.examSubjectId && res.studentId === data.studentId) {
        Object.assign(res, data, { updatedAt: new Date() });
        this.results.set(id, res);
        return res;
      }
    }

    const id = `res-${Date.now().toString(36)}`;
    const record: IResultRecord = { ...data, id, createdAt: new Date(), updatedAt: new Date() };
    this.results.set(id, record);
    return record;
  }
}

export const examRepository = new ExamRepository();
