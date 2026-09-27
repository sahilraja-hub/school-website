import { Request, Response } from 'express';
import { Admission } from '../models/Admission';
import { AdmissionApplicationInput, AdmissionStatusUpdateInput } from '@school/shared';

export const submitApplication = async (
  req: Request<{}, {}, AdmissionApplicationInput>,
  res: Response
): Promise<void> => {
  try {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const applicationNumber = `ADM-2026-${randomDigits}`;

    const application = new Admission({
      ...req.body,
      applicationNumber,
      status: 'SUBMITTED',
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: 'Admission application submitted successfully',
      data: {
        applicationNumber: application.applicationNumber,
        status: application.status,
        submittedAt: application.createdAt,
        studentName: `${application.studentFirstName} ${application.studentLastName}`,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to submit application.' });
  }
};

export const trackApplication = async (req: Request<{ applicationNumber: string }>, res: Response): Promise<void> => {
  try {
    const { applicationNumber } = req.params;
    const application = await Admission.findOne({
      applicationNumber: applicationNumber.toUpperCase().trim(),
    });

    if (!application) {
      res.status(404).json({ success: false, error: 'Application not found with this reference number.' });
      return;
    }

    res.json({
      success: true,
      data: {
        applicationNumber: application.applicationNumber,
        studentName: `${application.studentFirstName} ${application.studentLastName}`,
        gradeApplyingFor: application.gradeApplyingFor,
        status: application.status,
        submittedAt: application.createdAt,
        updatedAt: application.updatedAt,
        notes: application.notes,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error tracking application.' });
  }
};

export const getAllApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, grade } = req.query;
    const filter: Record<string, any> = {};

    if (status) filter.status = status;
    if (grade) filter.gradeApplyingFor = grade;

    const applications = await Admission.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: applications,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Error fetching applications.' });
  }
};

export const updateApplicationStatus = async (
  req: Request<{ id: string }, {}, AdmissionStatusUpdateInput>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const application = await Admission.findByIdAndUpdate(
      id,
      { status, ...(notes !== undefined && { notes }) },
      { new: true }
    );

    if (!application) {
      res.status(404).json({ success: false, error: 'Application not found.' });
      return;
    }

    res.json({
      success: true,
      message: `Application status updated to ${status}`,
      data: application,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update status.' });
  }
};
