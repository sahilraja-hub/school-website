import mongoose from 'mongoose';
import { Admission, IAdmission } from '../models/Admission';

class AdmissionRepository {
  private inMemoryAdmissions: Map<string, any> = new Map();

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    const defaults = [
      {
        _id: 'adm-001',
        applicationNumber: 'ADM-2026-1042',
        studentFirstName: 'Alexander',
        studentLastName: 'Hayes',
        dateOfBirth: '2011-04-18',
        gradeApplyingFor: 'GRADE_9',
        parentName: 'Robert Hayes',
        parentEmail: 'robert.hayes@example.com',
        parentPhone: '+1 (555) 782-9901',
        address: '742 Evergreen Terrace, Springfield',
        previousSchool: 'Springfield Middle Academy',
        status: 'UNDER_REVIEW',
        notes: 'Strong mathematics recommendation. Robotics club captain.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'adm-002',
        applicationNumber: 'ADM-2026-1088',
        studentFirstName: 'Sophia',
        studentLastName: 'Patel',
        dateOfBirth: '2021-08-22',
        gradeApplyingFor: 'KINDERGARTEN',
        parentName: 'Priya & Vikram Patel',
        parentEmail: 'priya.patel@example.com',
        parentPhone: '+1 (555) 349-1120',
        address: '12 Harbor View Road, Seattle',
        status: 'ACCEPTED',
        notes: 'Accepted for Fall 2026 cohort. Welcome packet sent.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    defaults.forEach((item) => {
      this.inMemoryAdmissions.set(item.applicationNumber, item);
    });
  }

  private isMongoConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  public async create(data: any): Promise<any> {
    if (this.isMongoConnected()) {
      try {
        return await Admission.create(data);
      } catch (err) {
        // Fall back
      }
    }
    const item = {
      _id: `adm_${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.inMemoryAdmissions.set(item.applicationNumber, item);
    return item;
  }

  public async findByApplicationNumber(appNum: string): Promise<any | null> {
    const normalized = appNum.toUpperCase().trim();
    if (this.isMongoConnected()) {
      try {
        const found = await Admission.findOne({ applicationNumber: normalized });
        if (found) return found;
      } catch (err) {
        // Fall back
      }
    }
    return this.inMemoryAdmissions.get(normalized) || null;
  }

  public async findById(id: string): Promise<any | null> {
    if (this.isMongoConnected()) {
      try {
        const found = await Admission.findById(id);
        if (found) return found;
      } catch (err) {
        // Fall back
      }
    }
    for (const item of this.inMemoryAdmissions.values()) {
      if (item._id === id || item._id?.toString() === id) {
        return item;
      }
    }
    return null;
  }

  public async findAll(filter: Record<string, any> = {}): Promise<any[]> {
    if (this.isMongoConnected()) {
      try {
        return await Admission.find(filter).sort({ createdAt: -1 });
      } catch (err) {
        // Fall back
      }
    }
    let list = Array.from(this.inMemoryAdmissions.values());
    if (filter.status) list = list.filter((a) => a.status === filter.status);
    if (filter.gradeApplyingFor) list = list.filter((a) => a.gradeApplyingFor === filter.gradeApplyingFor);
    return list;
  }

  public async updateById(id: string, updateData: any): Promise<any | null> {
    if (this.isMongoConnected()) {
      try {
        const updated = await Admission.findByIdAndUpdate(id, updateData, { new: true });
        if (updated) return updated;
      } catch (err) {
        // Fall back
      }
    }
    for (const [key, item] of this.inMemoryAdmissions.entries()) {
      if (item._id === id || item._id?.toString() === id) {
        const updated = { ...item, ...updateData, updatedAt: new Date() };
        this.inMemoryAdmissions.set(key, updated);
        return updated;
      }
    }
    return null;
  }
}

export const admissionRepository = new AdmissionRepository();
