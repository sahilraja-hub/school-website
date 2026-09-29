import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/User';
import { UserRole, AccountStatus, UserSummary } from '@school/shared';

export interface IUserLike {
  _id: any;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: AccountStatus;
  avatarUrl?: string;
  studentId?: string;
  gradeLevel?: string;
  phone?: string;
  failedLoginAttempts: number;
  lockUntil?: Date;
  lastLoginAt?: Date;
  lastLoginIp?: string;
  passwordChangedAt?: Date;
  tokenVersion: number;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;

  comparePassword(password: string): Promise<boolean>;
  isLocked(): boolean;
  recordSuccessfulLogin(ip?: string): Promise<void>;
  recordFailedLogin(): Promise<{ locked: boolean; attemptsLeft: number; lockUntil?: Date }>;
  toSummary(): UserSummary;
  save(): Promise<IUserLike>;
}

class InMemoryUser implements IUserLike {
  public _id: string;
  public id: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public passwordHash: string;
  public role: UserRole;
  public status: AccountStatus;
  public avatarUrl?: string;
  public studentId?: string;
  public gradeLevel?: string;
  public phone?: string;
  public failedLoginAttempts: number = 0;
  public lockUntil?: Date;
  public lastLoginAt?: Date;
  public lastLoginIp?: string;
  public passwordChangedAt?: Date;
  public tokenVersion: number = 0;
  public refreshTokens: string[] = [];
  public createdAt: Date = new Date();
  public updatedAt: Date = new Date();

  constructor(data: Partial<InMemoryUser>) {
    this._id = data._id ? data._id.toString() : `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.id = this._id;
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.email = (data.email || '').toLowerCase().trim();
    this.passwordHash = data.passwordHash || '';
    this.role = data.role || 'STUDENT';
    this.status = data.status || 'ACTIVE';
    this.avatarUrl = data.avatarUrl;
    this.studentId = data.studentId;
    this.gradeLevel = data.gradeLevel;
    this.phone = data.phone;
    this.failedLoginAttempts = data.failedLoginAttempts || 0;
    this.lockUntil = data.lockUntil;
    this.lastLoginAt = data.lastLoginAt;
    this.lastLoginIp = data.lastLoginIp;
    this.passwordChangedAt = data.passwordChangedAt;
    this.tokenVersion = data.tokenVersion || 0;
    this.refreshTokens = data.refreshTokens || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }

  isLocked(): boolean {
    return !!(this.lockUntil && this.lockUntil.getTime() > Date.now());
  }

  async recordSuccessfulLogin(ip?: string): Promise<void> {
    this.failedLoginAttempts = 0;
    this.lockUntil = undefined;
    this.lastLoginAt = new Date();
    if (ip) this.lastLoginIp = ip;
    this.updatedAt = new Date();
  }

  async recordFailedLogin(): Promise<{ locked: boolean; attemptsLeft: number; lockUntil?: Date }> {
    if (this.lockUntil && this.lockUntil.getTime() <= Date.now()) {
      this.failedLoginAttempts = 0;
      this.lockUntil = undefined;
    }

    this.failedLoginAttempts = (this.failedLoginAttempts || 0) + 1;
    const maxAttempts = 5;

    if (this.failedLoginAttempts >= maxAttempts) {
      const lockDuration = 15 * 60 * 1000;
      this.lockUntil = new Date(Date.now() + lockDuration);
      this.updatedAt = new Date();
      return { locked: true, attemptsLeft: 0, lockUntil: this.lockUntil };
    }

    this.updatedAt = new Date();
    return { locked: false, attemptsLeft: maxAttempts - this.failedLoginAttempts };
  }

  toSummary(): UserSummary {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      role: this.role,
      status: this.status,
      avatarUrl: this.avatarUrl,
      studentId: this.studentId,
      gradeLevel: this.gradeLevel as any,
      phone: this.phone,
      lastLoginAt: this.lastLoginAt ? this.lastLoginAt.toISOString() : undefined,
    };
  }

  async save(): Promise<IUserLike> {
    this.updatedAt = new Date();
    userRepository.upsertInMemory(this);
    return this;
  }
}

class UserRepository {
  private inMemoryUsers: Map<string, InMemoryUser> = new Map();
  private initialized: boolean = false;

  constructor() {
    this.initDefaultUsers();
  }

  private async initDefaultUsers() {
    if (this.initialized) return;
    this.initialized = true;

    const superAdminHash = await bcrypt.hash('SuperAdmin@123456', 8);
    const adminHash = await bcrypt.hash('Admin@123456', 8);
    const teacherHash = await bcrypt.hash('Teacher@123456', 8);
    const studentHash = await bcrypt.hash('Student@123456', 8);
    const parentHash = await bcrypt.hash('Parent@123456', 8);

    const defaults = [
      new InMemoryUser({
        _id: 'usr-superadmin-01',
        firstName: 'Eleanor',
        lastName: 'Vance',
        email: 'superadmin@oakridge.edu',
        passwordHash: superAdminHash,
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        phone: '+1 (555) 019-2830',
      }),
      new InMemoryUser({
        _id: 'usr-admin-01',
        firstName: 'Principal',
        lastName: 'Harrison',
        email: 'admin@oakridge.edu',
        passwordHash: adminHash,
        role: 'ADMIN',
        status: 'ACTIVE',
        phone: '+1 (555) 019-2831',
      }),
      new InMemoryUser({
        _id: 'usr-teacher-01',
        firstName: 'Dr. Evelyn',
        lastName: 'Reed',
        email: 'teacher@oakridge.edu',
        passwordHash: teacherHash,
        role: 'TEACHER',
        status: 'ACTIVE',
        phone: '+1 (555) 019-2832',
      }),
      new InMemoryUser({
        _id: 'usr-student-01',
        firstName: 'Liam',
        lastName: 'Vance',
        email: 'student@oakridge.edu',
        passwordHash: studentHash,
        role: 'STUDENT',
        status: 'ACTIVE',
        studentId: 'OAK-882190',
        gradeLevel: 'GRADE_11',
        phone: '+1 (555) 019-2834',
      }),
      new InMemoryUser({
        _id: 'usr-student-02',
        firstName: 'Emma',
        lastName: 'Watson',
        email: 'student2@oakridge.edu',
        passwordHash: studentHash,
        role: 'STUDENT',
        status: 'ACTIVE',
        studentId: 'OAK-882191',
        gradeLevel: 'GRADE_10',
        phone: '+1 (555) 019-2839',
      }),
      new InMemoryUser({
        _id: 'usr-parent-01',
        firstName: 'David',
        lastName: 'Vance',
        email: 'parent@oakridge.edu',
        passwordHash: parentHash,
        role: 'PARENT',
        status: 'ACTIVE',
        phone: '+1 (555) 019-2837',
      }),
      new InMemoryUser({
        _id: 'usr-suspended-01',
        firstName: 'Suspended',
        lastName: 'Student',
        email: 'suspended@oakridge.edu',
        passwordHash: studentHash,
        role: 'STUDENT',
        status: 'SUSPENDED',
      }),
      new InMemoryUser({
        _id: 'usr-locked-01',
        firstName: 'Locked',
        lastName: 'Teacher',
        email: 'locked@oakridge.edu',
        passwordHash: teacherHash,
        role: 'TEACHER',
        status: 'LOCKED',
        lockUntil: new Date(Date.now() + 15 * 60 * 1000),
      }),
    ];

    defaults.forEach((u) => {
      this.inMemoryUsers.set(u.email.toLowerCase(), u);
    });
  }

  private isMongoConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  public upsertInMemory(user: InMemoryUser): void {
    this.inMemoryUsers.set(user.email.toLowerCase(), user);
  }

  public async findByEmail(email: string): Promise<IUserLike | null> {
    const normalized = email.toLowerCase().trim();
    if (this.isMongoConnected()) {
      try {
        const found = await User.findOne({ email: normalized });
        if (found) return found as unknown as IUserLike;
      } catch (err) {
        // Fall back to memory on error
      }
    }
    return this.inMemoryUsers.get(normalized) || null;
  }

  public async findById(id: string): Promise<IUserLike | null> {
    if (this.isMongoConnected()) {
      try {
        const found = await User.findById(id);
        if (found) return found as unknown as IUserLike;
      } catch (err) {
        // Fall back
      }
    }
    for (const user of this.inMemoryUsers.values()) {
      if (user.id === id || user._id.toString() === id) {
        return user;
      }
    }
    return null;
  }

  public async findByRefreshToken(token: string): Promise<IUserLike | null> {
    if (this.isMongoConnected()) {
      try {
        const found = await User.findOne({ refreshTokens: token });
        if (found) return found as unknown as IUserLike;
      } catch (err) {
        // Fall back
      }
    }
    for (const user of this.inMemoryUsers.values()) {
      if (user.refreshTokens.includes(token)) {
        return user;
      }
    }
    return null;
  }

  public async create(data: Partial<IUserLike>): Promise<IUserLike> {
    if (this.isMongoConnected()) {
      try {
        const created = await User.create(data);
        return created as unknown as IUserLike;
      } catch (err) {
        // Fall back to memory
      }
    }
    const inMem = new InMemoryUser(data);
    this.inMemoryUsers.set(inMem.email.toLowerCase(), inMem);
    return inMem;
  }

  public async count(): Promise<number> {
    if (this.isMongoConnected()) {
      try {
        return await User.countDocuments();
      } catch (err) {
        // Fall back
      }
    }
    return this.inMemoryUsers.size;
  }

  public async list(query: { page?: number; limit?: number; search?: string; role?: string; status?: string }): Promise<{ items: IUserLike[]; total: number; page: number; limit: number; totalPages: number }> {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 20));
    let allUsers = Array.from(this.inMemoryUsers.values());

    if (query.role) {
      allUsers = allUsers.filter((u) => u.role === query.role);
    }
    if (query.status) {
      allUsers = allUsers.filter((u) => u.status === query.status);
    }
    if (query.search) {
      const s = query.search.toLowerCase();
      allUsers = allUsers.filter(
        (u) =>
          u.firstName.toLowerCase().includes(s) ||
          u.lastName.toLowerCase().includes(s) ||
          u.email.toLowerCase().includes(s)
      );
    }

    const total = allUsers.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const items = allUsers.slice((page - 1) * limit, page * limit);

    return { items, total, page, limit, totalPages };
  }

  public async update(id: string, data: Partial<IUserLike>): Promise<IUserLike | null> {
    const user = await this.findById(id);
    if (!user) return null;

    Object.assign(user, data);
    user.updatedAt = new Date();
    await user.save();
    return user;
  }

  public async delete(id: string): Promise<boolean> {
    const user = await this.findById(id);
    if (!user) return false;
    user.status = 'SUSPENDED';
    user.updatedAt = new Date();
    await user.save();
    return true;
  }

  public async resetForTesting(): Promise<void> {
    this.inMemoryUsers.clear();
    this.initialized = false;
    await this.initDefaultUsers();
  }
}

export const userRepository = new UserRepository();
