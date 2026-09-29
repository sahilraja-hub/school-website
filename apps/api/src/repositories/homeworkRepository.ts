import { academicRepository } from './academicRepository';
import { schoolActorsRepository } from './schoolActorsRepository';

export interface IHomeworkRecord {
  id: string;
  sectionId: string;
  subjectId: string;
  teacherId?: string;
  title: string;
  description: string;
  dueDate: string;
  totalMarks: number;
  attachmentUrl?: string;
  isPublished?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IHomeworkSubmissionRecord {
  id: string;
  homeworkId: string;
  studentId: string;
  content: string;
  attachmentUrl?: string;
  submittedAt: Date;
  status: 'PENDING' | 'SUBMITTED' | 'GRADED' | 'LATE';
  marksObtained?: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

class HomeworkRepository {
  private homeworks: Map<string, IHomeworkRecord> = new Map();
  private submissions: Map<string, IHomeworkSubmissionRecord> = new Map();

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    const hwId = 'hw-001';
    this.homeworks.set(hwId, {
      id: hwId,
      sectionId: 'sec-10a',
      subjectId: 'sub-math',
      teacherId: 'teach-001',
      title: 'Problem Set 4: Differential Calculus',
      description: 'Solve questions 1-15 on Page 142 of Advanced Mathematics textbook.',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalMarks: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const subId = 'subm-001';
    this.submissions.set(subId, {
      id: subId,
      homeworkId: hwId,
      studentId: 'stud-001',
      content: 'All 15 problems solved step-by-step with graphical plots included.',
      submittedAt: new Date(),
      status: 'SUBMITTED',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const subId2 = 'subm-002';
    this.submissions.set(subId2, {
      id: subId2,
      homeworkId: hwId,
      studentId: 'stud-002',
      content: 'Emma Watson homework submission with derivations.',
      submittedAt: new Date(),
      status: 'SUBMITTED',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const subId3 = 'subm-003';
    this.submissions.set(subId3, {
      id: subId3,
      homeworkId: hwId,
      studentId: 'stud-003',
      content: 'Lucas Vance homework calculations and answers.',
      submittedAt: new Date(),
      status: 'SUBMITTED',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public async listHomework(query: { page?: number; limit?: number; sectionId?: string; subjectId?: string; search?: string }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 20));
    let items = Array.from(this.homeworks.values());

    if (query.sectionId) items = items.filter((h) => h.sectionId === query.sectionId);
    if (query.subjectId) items = items.filter((h) => h.subjectId === query.subjectId);
    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter((h) => h.title.toLowerCase().includes(s) || h.description.toLowerCase().includes(s));
    }

    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paged = items.slice((page - 1) * limit, page * limit);

    const enriched = await Promise.all(
      paged.map(async (hw) => {
        const sec = await academicRepository.getSectionById(hw.sectionId);
        const sub = await academicRepository.getSubjectById(hw.subjectId);
        const subsCount = Array.from(this.submissions.values()).filter((s) => s.homeworkId === hw.id).length;
        return {
          ...hw,
          sectionName: sec?.name,
          subjectName: sub?.name,
          submissionsCount: subsCount,
        };
      })
    );

    return { items: enriched, total, page, limit, totalPages };
  }

  public async getHomeworkById(id: string) {
    const hw = this.homeworks.get(id);
    if (!hw) return null;
    const sec = await academicRepository.getSectionById(hw.sectionId);
    const sub = await academicRepository.getSubjectById(hw.subjectId);
    const subs = Array.from(this.submissions.values()).filter((s) => s.homeworkId === hw.id);
    return {
      ...hw,
      sectionName: sec?.name,
      subjectName: sub?.name,
      submissionsCount: subs.length,
      submissions: subs,
    };
  }

  public async createHomework(data: Omit<IHomeworkRecord, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = `hw-${Date.now().toString(36)}`;
    const record: IHomeworkRecord = {
      ...data,
      id,
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.homeworks.set(id, record);
    return this.getHomeworkById(id);
  }

  public async updateHomework(id: string, data: Partial<IHomeworkRecord>) {
    const hw = this.homeworks.get(id);
    if (!hw) return null;
    Object.assign(hw, data, { updatedAt: new Date() });
    this.homeworks.set(id, hw);
    return this.getHomeworkById(id);
  }

  public async deleteHomework(id: string) {
    return this.homeworks.delete(id);
  }

  public async submitHomework(data: { homeworkId: string; studentId: string; content: string; attachmentUrl?: string }) {
    for (const [id, s] of this.submissions.entries()) {
      if (s.homeworkId === data.homeworkId && s.studentId === data.studentId) {
        Object.assign(s, {
          content: data.content,
          attachmentUrl: data.attachmentUrl,
          submittedAt: new Date(),
          status: 'SUBMITTED',
          updatedAt: new Date(),
        });
        this.submissions.set(id, s);
        return s;
      }
    }

    const id = `subm-${Date.now().toString(36)}`;
    const record: IHomeworkSubmissionRecord = {
      id,
      homeworkId: data.homeworkId,
      studentId: data.studentId,
      content: data.content,
      attachmentUrl: data.attachmentUrl,
      submittedAt: new Date(),
      status: 'SUBMITTED',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.submissions.set(id, record);
    return record;
  }

  public async gradeSubmission(id: string, data: { marksObtained: number; feedback?: string }) {
    const sub = this.submissions.get(id);
    if (!sub) return null;
    sub.marksObtained = data.marksObtained;
    sub.feedback = data.feedback;
    sub.status = 'GRADED';
    sub.updatedAt = new Date();
    this.submissions.set(id, sub);
    return sub;
  }
}

export const homeworkRepository = new HomeworkRepository();
