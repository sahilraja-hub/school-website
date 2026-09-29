import { Request, Response } from 'express';
import { admissionService } from '../services/admissionService';
import {
  AdmissionApplicationInput,
  AdmissionDraftInput,
  AdmissionStatusUpdateInput,
  AdmissionAddNoteInput,
  AdmissionConvertToStudentInput,
  FileUploadInput,
} from '@school/shared';

export const createDraft = async (
  req: Request<{}, {}, AdmissionDraftInput>,
  res: Response
): Promise<void> => {
  const result = await admissionService.createDraft(req.body);

  res.status(201).json({
    success: true,
    message: 'Admission application draft saved successfully',
    data: result,
    meta: {
      requestId: req.id,
      timestamp: new Date().toISOString(),
    },
  });
};

export const updateDraft = async (
  req: Request<{ applicationNumber: string }, {}, AdmissionDraftInput>,
  res: Response
): Promise<void> => {
  const trackingToken =
    (req.headers['x-tracking-token'] as string) || (req.query.token as string);

  const result = await admissionService.updateDraft(
    req.params.applicationNumber,
    req.body,
    trackingToken
  );

  res.json({
    success: true,
    message: 'Admission application draft updated successfully',
    data: result,
    meta: {
      requestId: req.id,
      timestamp: new Date().toISOString(),
    },
  });
};

export const submitApplication = async (
  req: Request<{}, {}, AdmissionApplicationInput & { applicationNumber?: string }>,
  res: Response
): Promise<void> => {
  const trackingToken =
    (req.headers['x-tracking-token'] as string) || (req.query.token as string);

  const result = await admissionService.submitApplication(req.body, trackingToken);

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
  const trackingToken =
    (req.headers['x-tracking-token'] as string) || (req.query.token as string);

  const result = await admissionService.trackApplication(
    req.params.applicationNumber,
    trackingToken,
    req.user
  );

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
  const { status, grade, search, academicYear } = req.query;
  const list = await admissionService.getApplications({
    status: status as string,
    grade: grade as string,
    search: search as string,
    academicYear: academicYear as string,
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

export const getApplicationById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  const app = await admissionService.getApplicationById(req.params.id);

  res.json({
    success: true,
    data: app,
    meta: {
      requestId: req.id,
      timestamp: new Date().toISOString(),
    },
  });
};

const resolveAdminUser = (req: Request) => ({
  id: req.user?.id || 'usr-admin-01',
  firstName: req.user?.firstName || 'Admin',
  lastName: req.user?.lastName || 'User',
  role: req.user?.role || 'ADMIN',
  email: req.user?.email || 'admin@oakridge.edu',
});

export const updateApplicationStatus = async (
  req: Request<{ id: string }, {}, AdmissionStatusUpdateInput>,
  res: Response
): Promise<void> => {
  const updated = await admissionService.updateStatus(
    req.params.id,
    req.body,
    resolveAdminUser(req)
  );

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

export const addApplicationNote = async (
  req: Request<{ id: string }, {}, AdmissionAddNoteInput>,
  res: Response
): Promise<void> => {
  const updated = await admissionService.addNote(
    req.params.id,
    req.body.note,
    resolveAdminUser(req)
  );

  res.json({
    success: true,
    message: 'Administrative review note recorded',
    data: updated,
    meta: {
      requestId: req.id,
      timestamp: new Date().toISOString(),
    },
  });
};

export const convertToStudentRecord = async (
  req: Request<{ id: string }, {}, AdmissionConvertToStudentInput>,
  res: Response
): Promise<void> => {
  const result = await admissionService.convertToStudent(
    req.params.id,
    req.body,
    resolveAdminUser(req)
  );

  res.json({
    success: true,
    message: 'Application successfully converted into enrolled student record',
    data: result,
    meta: {
      requestId: req.id,
      timestamp: new Date().toISOString(),
    },
  });
};

export const uploadDocument = async (
  req: Request<{}, {}, FileUploadInput & { uploaderName?: string; applicationNumber?: string }>,
  res: Response
): Promise<void> => {
  const doc = await admissionService.uploadDocument(
    req.body,
    req.body.uploaderName,
    req.body.applicationNumber
  );

  res.status(201).json({
    success: true,
    message: 'Confidential document uploaded and verified',
    data: doc,
    meta: {
      requestId: req.id,
      timestamp: new Date().toISOString(),
    },
  });
};

export const getDocument = async (
  req: Request<{ docId: string }>,
  res: Response
): Promise<void> => {
  const trackingToken =
    (req.headers['x-tracking-token'] as string) || (req.query.token as string);

  const authUser = req.user && req.user.id && req.user.role
    ? { id: req.user.id, role: req.user.role }
    : undefined;

  const doc = await admissionService.getDocument(req.params.docId, authUser, trackingToken);

  res.json({
    success: true,
    data: {
      id: doc.id,
      documentType: doc.documentType,
      fileName: doc.fileName,
      fileType: doc.fileType,
      fileSizeBytes: doc.fileSizeBytes,
      fileData: doc.fileData,
      uploadedAt: doc.uploadedAt,
    },
    meta: {
      requestId: req.id,
      timestamp: new Date().toISOString(),
    },
  });
};

export const getApplicationAuditLogs = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  const logs = await admissionService.getAuditLogs(req.params.id);

  res.json({
    success: true,
    data: logs,
    meta: {
      requestId: req.id,
      timestamp: new Date().toISOString(),
    },
  });
};
