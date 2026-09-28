export interface IClassRecord {
  id: string;
  name: string;
  gradeLevel: string;
  academicYear: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISectionRecord {
  id: string;
  name: string;
  classId: string;
  roomNumber?: string;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubjectRecord {
  id: string;
  name: string;
  code: string;
  description?: string;
  credits: number;
  isElective: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITimetableRecord {
  id: string;
  sectionId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  roomNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

class AcademicRepository {
  private classes: Map<string, IClassRecord> = new Map();
  private sections: Map<string, ISectionRecord> = new Map();
  private subjects: Map<string, ISubjectRecord> = new Map();
  private timetables: Map<string, ITimetableRecord> = new Map();

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    // Classes
    const c10: IClassRecord = {
      id: 'cls-10',
      name: 'Grade 10',
      gradeLevel: 'GRADE_10',
      academicYear: '2026-2027',
      description: 'Sophomore cohort',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const c11: IClassRecord = {
      id: 'cls-11',
      name: 'Grade 11',
      gradeLevel: 'GRADE_11',
      academicYear: '2026-2027',
      description: 'Junior cohort',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.classes.set(c10.id, c10);
    this.classes.set(c11.id, c11);

    // Sections
    const s10a: ISectionRecord = {
      id: 'sec-10a',
      name: 'Section A',
      classId: c10.id,
      roomNumber: 'Room 301',
      capacity: 35,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const s10b: ISectionRecord = {
      id: 'sec-10b',
      name: 'Section B',
      classId: c10.id,
      roomNumber: 'Room 302',
      capacity: 35,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.sections.set(s10a.id, s10a);
    this.sections.set(s10b.id, s10b);

    // Subjects
    const sub1: ISubjectRecord = {
      id: 'sub-math',
      name: 'Advanced Mathematics',
      code: 'MATH-101',
      description: 'Calculus and geometry',
      credits: 4,
      isElective: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const sub2: ISubjectRecord = {
      id: 'sub-phys',
      name: 'Physics & Mechanics',
      code: 'PHYS-101',
      description: 'Newtonian mechanics & optics',
      credits: 4,
      isElective: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.subjects.set(sub1.id, sub1);
    this.subjects.set(sub2.id, sub2);

    // Timetables
    const tt1: ITimetableRecord = {
      id: 'tt-1',
      sectionId: s10a.id,
      subjectId: sub1.id,
      teacherId: 'teach-001',
      dayOfWeek: 'MONDAY',
      startTime: '08:30',
      endTime: '09:25',
      roomNumber: 'Room 301',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.timetables.set(tt1.id, tt1);
  }

  // --- Classes ---
  public async listClasses(query: { page?: number; limit?: number; academicYear?: string; search?: string }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 20));
    let items = Array.from(this.classes.values());

    if (query.academicYear) items = items.filter((c) => c.academicYear === query.academicYear);
    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter((c) => c.name.toLowerCase().includes(s) || c.gradeLevel.toLowerCase().includes(s));
    }

    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paged = items.slice((page - 1) * limit, page * limit);

    const enriched = paged.map((c) => {
      const classSections = Array.from(this.sections.values()).filter((sec) => sec.classId === c.id);
      return { ...c, sectionsCount: classSections.length, sections: classSections };
    });

    return { items: enriched, total, page, limit, totalPages };
  }

  public async getClassById(id: string) {
    const cls = this.classes.get(id);
    if (!cls) return null;
    const classSections = Array.from(this.sections.values()).filter((sec) => sec.classId === cls.id);
    return { ...cls, sectionsCount: classSections.length, sections: classSections };
  }

  public async createClass(data: Omit<IClassRecord, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = `cls-${Date.now().toString(36)}`;
    const record: IClassRecord = { ...data, id, createdAt: new Date(), updatedAt: new Date() };
    this.classes.set(id, record);
    return this.getClassById(id);
  }

  public async updateClass(id: string, data: Partial<IClassRecord>) {
    const cls = this.classes.get(id);
    if (!cls) return null;
    Object.assign(cls, data, { updatedAt: new Date() });
    this.classes.set(id, cls);
    return this.getClassById(id);
  }

  public async deleteClass(id: string) {
    return this.classes.delete(id);
  }

  // --- Sections ---
  public async listSections(query: { classId?: string; search?: string }) {
    let items = Array.from(this.sections.values());
    if (query.classId) items = items.filter((s) => s.classId === query.classId);
    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter((sec) => sec.name.toLowerCase().includes(s));
    }
    return items.map((sec) => ({
      ...sec,
      className: this.classes.get(sec.classId)?.name,
    }));
  }

  public async getSectionById(id: string) {
    const sec = this.sections.get(id);
    if (!sec) return null;
    return { ...sec, className: this.classes.get(sec.classId)?.name };
  }

  public async createSection(data: Omit<ISectionRecord, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = `sec-${Date.now().toString(36)}`;
    const record: ISectionRecord = { ...data, id, createdAt: new Date(), updatedAt: new Date() };
    this.sections.set(id, record);
    return this.getSectionById(id);
  }

  public async updateSection(id: string, data: Partial<ISectionRecord>) {
    const sec = this.sections.get(id);
    if (!sec) return null;
    Object.assign(sec, data, { updatedAt: new Date() });
    this.sections.set(id, sec);
    return this.getSectionById(id);
  }

  public async deleteSection(id: string) {
    return this.sections.delete(id);
  }

  // --- Subjects ---
  public async listSubjects(query: { search?: string; isElective?: boolean }) {
    let items = Array.from(this.subjects.values());
    if (typeof query.isElective === 'boolean') items = items.filter((s) => s.isElective === query.isElective);
    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter((sub) => sub.name.toLowerCase().includes(s) || sub.code.toLowerCase().includes(s));
    }
    return items;
  }

  public async getSubjectById(id: string) {
    return this.subjects.get(id) || null;
  }

  public async createSubject(data: Omit<ISubjectRecord, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = `sub-${Date.now().toString(36)}`;
    const record: ISubjectRecord = { ...data, id, createdAt: new Date(), updatedAt: new Date() };
    this.subjects.set(id, record);
    return record;
  }

  public async updateSubject(id: string, data: Partial<ISubjectRecord>) {
    const sub = this.subjects.get(id);
    if (!sub) return null;
    Object.assign(sub, data, { updatedAt: new Date() });
    this.subjects.set(id, sub);
    return sub;
  }

  public async deleteSubject(id: string) {
    return this.subjects.delete(id);
  }

  // --- Timetable ---
  public async listTimetable(query: { sectionId?: string; teacherId?: string; dayOfWeek?: string }) {
    let items = Array.from(this.timetables.values());
    if (query.sectionId) items = items.filter((t) => t.sectionId === query.sectionId);
    if (query.teacherId) items = items.filter((t) => t.teacherId === query.teacherId);
    if (query.dayOfWeek) items = items.filter((t) => t.dayOfWeek === query.dayOfWeek);

    return items.map((t) => {
      const sec = this.sections.get(t.sectionId);
      const sub = this.subjects.get(t.subjectId);
      return {
        ...t,
        sectionName: sec?.name,
        subjectName: sub?.name || 'Subject',
        subjectCode: sub?.code || '',
      };
    });
  }

  public async getTimetableById(id: string) {
    const t = this.timetables.get(id);
    if (!t) return null;
    const sec = this.sections.get(t.sectionId);
    const sub = this.subjects.get(t.subjectId);
    return {
      ...t,
      sectionName: sec?.name,
      subjectName: sub?.name || 'Subject',
      subjectCode: sub?.code || '',
    };
  }

  public async createTimetable(data: Omit<ITimetableRecord, 'id' | 'createdAt' | 'updatedAt'>) {
    // Conflict detection
    for (const item of this.timetables.values()) {
      if (item.dayOfWeek === data.dayOfWeek && item.startTime === data.startTime) {
        if (item.sectionId === data.sectionId) {
          throw new Error(`Section already has a class scheduled at ${data.startTime} on ${data.dayOfWeek}`);
        }
        if (item.teacherId === data.teacherId) {
          throw new Error(`Teacher already has an assignment scheduled at ${data.startTime} on ${data.dayOfWeek}`);
        }
      }
    }

    const id = `tt-${Date.now().toString(36)}`;
    const record: ITimetableRecord = { ...data, id, createdAt: new Date(), updatedAt: new Date() };
    this.timetables.set(id, record);
    return this.getTimetableById(id);
  }

  public async updateTimetable(id: string, data: Partial<ITimetableRecord>) {
    const t = this.timetables.get(id);
    if (!t) return null;
    Object.assign(t, data, { updatedAt: new Date() });
    this.timetables.set(id, t);
    return this.getTimetableById(id);
  }

  public async deleteTimetable(id: string) {
    return this.timetables.delete(id);
  }
}

export const academicRepository = new AcademicRepository();
