import { userRepository } from './userRepository';

export interface IStudentRecord {
  id: string;
  userId: string;
  admissionNumber: string;
  rollNumber?: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup?: string;
  emergencyContact: string;
  address?: string;
  admissionDate: string;
  status: string;
  parentId?: string;
  classId?: string;
  sectionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IParentRecord {
  id: string;
  userId: string;
  occupation?: string;
  relationship: string;
  emergencyContact: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  studentIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ITeacherRecord {
  id: string;
  userId: string;
  employeeId: string;
  qualification: string;
  specialization?: string;
  department: string;
  joiningDate: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

class SchoolActorsRepository {
  private students: Map<string, IStudentRecord> = new Map();
  private parents: Map<string, IParentRecord> = new Map();
  private teachers: Map<string, ITeacherRecord> = new Map();

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    // Parent
    const parentId = 'par-001';
    this.parents.set(parentId, {
      id: parentId,
      userId: 'usr_parent_001',
      occupation: 'Senior Systems Architect',
      relationship: 'FATHER',
      emergencyContact: '+1-555-9999',
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62704',
      studentIds: ['stud-001'],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Students
    const studentId = 'stud-001';
    this.students.set(studentId, {
      id: studentId,
      userId: 'usr-student-01',
      admissionNumber: 'ADM-2026-0089',
      rollNumber: '10-A-01',
      dateOfBirth: '2010-04-12',
      gender: 'MALE',
      bloodGroup: 'O+',
      emergencyContact: '+1-555-9999',
      address: '742 Evergreen Terrace',
      admissionDate: '2024-06-01',
      status: 'ACTIVE',
      parentId,
      classId: 'cls-10',
      sectionId: 'sec-10a',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const studentId2 = 'stud-002';
    this.students.set(studentId2, {
      id: studentId2,
      userId: 'usr-student-02',
      admissionNumber: 'ADM-2026-0090',
      rollNumber: '10-A-02',
      dateOfBirth: '2010-06-18',
      gender: 'FEMALE',
      bloodGroup: 'A+',
      emergencyContact: '+1-555-8888',
      address: '123 Baker Street',
      admissionDate: '2024-06-01',
      status: 'ACTIVE',
      parentId,
      classId: 'cls-10',
      sectionId: 'sec-10a',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Teachers
    this.teachers.set('teach-001', {
      id: 'teach-001',
      userId: 'usr-teacher-01',
      employeeId: 'EMP-2024-001',
      qualification: 'M.Sc. Pure Mathematics, Oxford',
      specialization: 'Advanced Calculus',
      department: 'Mathematics',
      joiningDate: '2021-08-01',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.teachers.set('teach-002', {
      id: 'teach-002',
      userId: 'usr_teacher_002',
      employeeId: 'EMP-2024-002',
      qualification: 'Ph.D. Experimental Physics, Stanford',
      specialization: 'Quantum Mechanics',
      department: 'Sciences',
      joiningDate: '2022-07-15',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // --- Students ---
  public async listStudents(query: { page?: number; limit?: number; search?: string; status?: string; classId?: string; sectionId?: string }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 20));
    let items = Array.from(this.students.values());

    if (query.status) items = items.filter((s) => s.status === query.status);
    if (query.classId) items = items.filter((s) => s.classId === query.classId);
    if (query.sectionId) items = items.filter((s) => s.sectionId === query.sectionId);
    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter((it) => it.admissionNumber.toLowerCase().includes(s) || (it.rollNumber && it.rollNumber.toLowerCase().includes(s)));
    }

    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paged = items.slice((page - 1) * limit, page * limit);

    // populate user info
    const enriched = await Promise.all(
      paged.map(async (st) => {
        const u = await userRepository.findById(st.userId);
        const parent = st.parentId ? this.parents.get(st.parentId) : undefined;
        const parentUser = parent ? await userRepository.findById(parent.userId) : undefined;
        return {
          ...st,
          user: u ? u.toSummary() : undefined,
          parent: parent ? { ...parent, user: parentUser ? parentUser.toSummary() : undefined } : undefined,
        };
      })
    );

    return { items: enriched, total, page, limit, totalPages };
  }

  public async getStudentById(id: string) {
    const student = this.students.get(id);
    if (!student) return null;
    const user = await userRepository.findById(student.userId);
    const parent = student.parentId ? this.parents.get(student.parentId) : undefined;
    const parentUser = parent ? await userRepository.findById(parent.userId) : undefined;
    return {
      ...student,
      user: user ? user.toSummary() : undefined,
      parent: parent ? { ...parent, user: parentUser ? parentUser.toSummary() : undefined } : undefined,
    };
  }

  public async getStudentByUserId(userId: string) {
    for (const student of this.students.values()) {
      if (
        student.userId === userId ||
        (userId === 'usr_student_001' && student.id === 'stud-001') ||
        (userId === 'usr-student-01' && student.id === 'stud-001') ||
        (userId === 'usr-student-02' && student.id === 'stud-002')
      ) {
        return this.getStudentById(student.id);
      }
    }
    return null;
  }

  public async createStudent(data: Omit<IStudentRecord, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = `stud-${Date.now().toString(36)}`;
    const record: IStudentRecord = {
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.students.set(id, record);
    return this.getStudentById(id);
  }

  public async updateStudent(id: string, data: Partial<IStudentRecord>) {
    const student = this.students.get(id);
    if (!student) return null;
    Object.assign(student, data, { updatedAt: new Date() });
    this.students.set(id, student);
    return this.getStudentById(id);
  }

  public async deleteStudent(id: string) {
    const student = this.students.get(id);
    if (!student) return false;
    student.status = 'SUSPENDED';
    student.updatedAt = new Date();
    return true;
  }

  // --- Parents ---
  public async listParents(query: { page?: number; limit?: number; search?: string }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 20));
    let items = Array.from(this.parents.values());

    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paged = items.slice((page - 1) * limit, page * limit);

    const enriched = await Promise.all(
      paged.map(async (par) => {
        const u = await userRepository.findById(par.userId);
        return { ...par, user: u ? u.toSummary() : undefined };
      })
    );

    return { items: enriched, total, page, limit, totalPages };
  }

  public async getParentById(id: string) {
    const parent = this.parents.get(id);
    if (!parent) return null;
    const user = await userRepository.findById(parent.userId);
    return { ...parent, user: user ? user.toSummary() : undefined };
  }

  public async getParentByUserId(userId: string) {
    for (const parent of this.parents.values()) {
      if (parent.userId === userId) {
        return this.getParentById(parent.id);
      }
    }
    return null;
  }

  public async createParent(data: Omit<IParentRecord, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = `par-${Date.now().toString(36)}`;
    const record: IParentRecord = {
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.parents.set(id, record);
    return this.getParentById(id);
  }

  public async updateParent(id: string, data: Partial<IParentRecord>) {
    const parent = this.parents.get(id);
    if (!parent) return null;
    Object.assign(parent, data, { updatedAt: new Date() });
    this.parents.set(id, parent);
    return this.getParentById(id);
  }

  // --- Teachers ---
  public async listTeachers(query: { page?: number; limit?: number; department?: string; search?: string; status?: string }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 20));
    let items = Array.from(this.teachers.values());

    if (query.department) items = items.filter((t) => t.department.toLowerCase() === query.department?.toLowerCase());
    if (query.status) items = items.filter((t) => t.status === query.status);
    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter((it) => it.employeeId.toLowerCase().includes(s) || it.qualification.toLowerCase().includes(s));
    }

    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paged = items.slice((page - 1) * limit, page * limit);

    const enriched = await Promise.all(
      paged.map(async (tc) => {
        const u = await userRepository.findById(tc.userId);
        return { ...tc, user: u ? u.toSummary() : undefined };
      })
    );

    return { items: enriched, total, page, limit, totalPages };
  }

  public async getTeacherById(id: string) {
    const teacher = this.teachers.get(id);
    if (!teacher) return null;
    const user = await userRepository.findById(teacher.userId);
    return { ...teacher, user: user ? user.toSummary() : undefined };
  }

  public async getTeacherByUserId(userId: string) {
    for (const teacher of this.teachers.values()) {
      if (
        teacher.userId === userId ||
        (userId === 'usr_teacher_001' && teacher.id === 'teach-001') ||
        (userId === 'usr-teacher-01' && teacher.id === 'teach-001')
      ) {
        return this.getTeacherById(teacher.id);
      }
    }
    return null;
  }

  public async createTeacher(data: Omit<ITeacherRecord, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = `teach-${Date.now().toString(36)}`;
    const record: ITeacherRecord = {
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.teachers.set(id, record);
    return this.getTeacherById(id);
  }

  public async updateTeacher(id: string, data: Partial<ITeacherRecord>) {
    const teacher = this.teachers.get(id);
    if (!teacher) return null;
    Object.assign(teacher, data, { updatedAt: new Date() });
    this.teachers.set(id, teacher);
    return this.getTeacherById(id);
  }
}

export const schoolActorsRepository = new SchoolActorsRepository();
