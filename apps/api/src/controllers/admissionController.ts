import { Request, Response } from 'express';
import { admissionService } from '../services/admissionService';
import { AdmissionApplicationInput, AdmissionStatusUpdateInput } from '@school/shared';

export const submitApplication = async (
  req: Request<{}, {}, AdmissionApplicationInput>,
  res: Response
): Promise<void> => {
  const result = await admissionService.submitApplication(req.body);

  res.status(201).json({
    success: true,
    message: 'Admission application submitted successfully',
    data: result,
    meta: {
      requestId: req.id,
      timestamp: new Date().toISOString(),
    },
  });
};

export const trackApplication = async (
  req: Request<{ applicationNumber: string }>,
  res: Response
): Promise<void> => {
  const result = await admissionService.trackApplication(req.params.applicationNumber);

  res.json({
    success: true,
    data: result,
    meta: {
      requestId: req.id,
      timestamp: new Date().toISOString(),
    },
  });
};

export const getAllApplications = async (req: Request, res: Response): Promise<void> => {
  const { status, grade } = req.query;
  const list = await admissionService.getApplications({
    status: status as string,
    grade: grade as string,
  });

  res.json({
    success: true,
    data: list,
    meta: {
      requestId: req.id,
      timestamp: new Date().toISOString(),
    },
  });
};

export const updateApplicationStatus = async (
  req: Request<{ id: string }, {}, AdmissionStatusUpdateInput>,
  res: Response
): Promise<void> => {
  const updated = await admissionService.updateStatus(req.params.id, req.body);

  res.json({
    success: true,
    message: `Application status updated to ${req.body.status}`,
    data: updated,
    meta: {
      requestId: req.id,
      timestamp: new Date().toISOString(),
    },
  });
};
