import { admissionRepository } from '../repositories/admissionRepository';
import { NotFoundError } from '../errors';
import { AdmissionApplicationInput, AdmissionStatusUpdateInput } from '@school/shared';

class AdmissionService {
  public async submitApplication(data: AdmissionApplicationInput) {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const applicationNumber = `ADM-2026-${randomDigits}`;

    const application = await admissionRepository.create({
      ...data,
      applicationNumber,
      status: 'SUBMITTED',
    });

    return {
      applicationNumber: application.applicationNumber,
      status: application.status,
      submittedAt: application.createdAt,
      studentName: `${application.studentFirstName} ${application.studentLastName}`,
    };
  }

  public async trackApplication(applicationNumber: string) {
    const application = await admissionRepository.findByApplicationNumber(applicationNumber);
    if (!application) {
      throw new NotFoundError(`No admission application found with reference number '${applicationNumber}'.`);
    }

    return {
      applicationNumber: application.applicationNumber,
      studentName: `${application.studentFirstName} ${application.studentLastName}`,
      gradeApplyingFor: application.gradeApplyingFor,
      status: application.status,
      submittedAt: application.createdAt,
      updatedAt: application.updatedAt,
      notes: application.notes,
    };
  }

  public async getApplications(filter: { status?: string; grade?: string }) {
    const queryFilter: Record<string, any> = {};
    if (filter.status) queryFilter.status = filter.status;
    if (filter.grade) queryFilter.gradeApplyingFor = filter.grade;

    return admissionRepository.findAll(queryFilter);
  }

  public async updateStatus(id: string, input: AdmissionStatusUpdateInput) {
    const { status, notes } = input;
    const application = await admissionRepository.updateById(id, {
      status,
      ...(notes !== undefined && { notes }),
    });

    if (!application) {
      throw new NotFoundError(`Admission application with ID '${id}' not found.`);
    }

    return application;
  }
}

export const admissionService = new AdmissionService();
