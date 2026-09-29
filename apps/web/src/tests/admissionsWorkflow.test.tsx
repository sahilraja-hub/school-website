import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AdmissionsPage } from '../pages/public/AdmissionsPage';
import { AdmissionsSection } from '../pages/portal/admin/sections/AdmissionsSection';
import { ToastProvider } from '../components/ui/Toast';

// Mock canvas-confetti to prevent JSDOM canvas clearRect errors
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

// Mock api service
vi.mock('../services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  setAccessToken: vi.fn(),
  getAccessToken: vi.fn().mockReturnValue('mock-token'),
}));

import { api } from '../services/api';

const renderPublicAdmissions = () => {
  return render(
    <ToastProvider>
      <BrowserRouter>
        <AdmissionsPage />
      </BrowserRouter>
    </ToastProvider>
  );
};

const renderAdminAdmissions = () => {
  return render(
    <ToastProvider>
      <BrowserRouter>
        <AdmissionsSection />
      </BrowserRouter>
    </ToastProvider>
  );
};

describe('Phase 14 — Complete Admissions Workflow Test Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Public Admissions Portal — Informational & Policy Views', () => {
    it('renders hero title and defaults to Admission Info tab with calendar and tuition schedules', () => {
      renderPublicAdmissions();

      expect(screen.getByRole('heading', { name: /Admissions & Scholar Enrollment/i })).toBeInTheDocument();
      expect(screen.getByText(/2026-2027 Admissions Calendar & Deadlines/i)).toBeInTheDocument();
      expect(screen.getByText(/Tuition & Financial Investments/i)).toBeInTheDocument();
      expect(screen.getByText(/Primary Division \(K-5\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Senior High \(9-12\)/i)).toBeInTheDocument();
      expect(screen.getByText(/The 5-Stage Admission Journey/i)).toBeInTheDocument();
    });

    it('switches to Eligibility tab and displays grade age criteria matrix', () => {
      renderPublicAdmissions();

      const eligibilityTab = screen.getByRole('button', { name: /eligibility/i });
      fireEvent.click(eligibilityTab);

      expect(screen.getByText(/Age & Cohort Eligibility Matrix/i)).toBeInTheDocument();
      expect(screen.getByText(/Kindergarten/i)).toBeInTheDocument();
      expect(screen.getByText(/5 Years Old/i)).toBeInTheDocument();
      expect(screen.getByText(/Grade 9 \(Freshman\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Cognitive & Language Evaluation/i)).toBeInTheDocument();
      expect(screen.getByText(/Character & Dean Interview/i)).toBeInTheDocument();
    });

    it('switches to Required Docs tab and displays mandatory credentials checklist and security rules', () => {
      renderPublicAdmissions();

      const docsTab = screen.getByRole('button', { name: /required docs/i });
      fireEvent.click(docsTab);

      expect(screen.getByText(/Mandatory Application Dossier Checklist/i)).toBeInTheDocument();
      expect(screen.getByText(/1\. Proof of Age & Legal Identity/i)).toBeInTheDocument();
      expect(screen.getByText(/2\. Official Academic Transcripts/i)).toBeInTheDocument();
      expect(screen.getByText(/3\. Transfer Certificate \(TC\)/i)).toBeInTheDocument();
      expect(screen.getByText(/4\. Immunization & Health Records/i)).toBeInTheDocument();
      expect(screen.getByText(/Maximum 5\.0 MB per document/i)).toBeInTheDocument();
      expect(screen.getByText(/PDF, JPEG, PNG, WEBP only/i)).toBeInTheDocument();
    });
  });

  describe('2. Public Admissions Portal — Multi-Step Application Form & Draft Saving', () => {
    it('switches to Application Form tab and navigates through steps with field validation', async () => {
      renderPublicAdmissions();

      const applyTab = screen.getByRole('button', { name: /application form/i });
      fireEvent.click(applyTab);

      expect(screen.getByText(/Step 1: Student Information/i)).toBeInTheDocument();

      // Attempt to proceed without filling required fields
      const nextBtn = screen.getByRole('button', { name: /proceed to next step/i });
      fireEvent.click(nextBtn);

      expect(screen.getByText(/Student first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Student last name is required/i)).toBeInTheDocument();

      // Fill in Step 1
      fireEvent.change(screen.getByPlaceholderText(/e\.g\. Liam/i), { target: { value: 'Ethan' } });
      fireEvent.change(screen.getByPlaceholderText(/e\.g\. Vance/i), { target: { value: 'Sterling' } });

      // Proceed to Step 2: Guardian
      fireEvent.click(nextBtn);
      expect(screen.getByText(/Step 2: Parent \/ Guardian Information/i)).toBeInTheDocument();

      // Step 2 validation
      fireEvent.click(screen.getByRole('button', { name: /proceed to next step/i }));
      expect(screen.getByText(/Parent\/Guardian full name is required/i)).toBeInTheDocument();

      fireEvent.change(screen.getByPlaceholderText(/e\.g\. David Vance/i), { target: { value: 'Charles Sterling' } });
      fireEvent.change(screen.getByPlaceholderText(/parent@example\.com/i), { target: { value: 'charles.s@example.com' } });
      fireEvent.change(screen.getByPlaceholderText(/\+1 \(555\) 000-0000/i), { target: { value: '+1 (555) 782-9910' } });

      // Proceed to Step 3: Address
      fireEvent.click(screen.getByRole('button', { name: /proceed to next step/i }));
      expect(screen.getByText(/Step 3: Residential Address/i)).toBeInTheDocument();

      // Step 3 validation
      fireEvent.click(screen.getByRole('button', { name: /proceed to next step/i }));
      expect(screen.getByText(/Residential street address is required/i)).toBeInTheDocument();

      fireEvent.change(screen.getByPlaceholderText(/e\.g\. 742 Evergreen Terrace/i), {
        target: { value: '100 Memorial Drive, Apt 5A' },
      });

      // Proceed to Step 4: School History
      fireEvent.click(screen.getByRole('button', { name: /proceed to next step/i }));
      expect(screen.getByText(/Step 4: Academic History & Previous School/i)).toBeInTheDocument();

      // Proceed to Step 5: Class & Contact
      fireEvent.click(screen.getByRole('button', { name: /proceed to next step/i }));
      expect(screen.getByText(/Step 5: Class Requested & Emergency Contacts/i)).toBeInTheDocument();

      // Proceed to Step 6: Documents & Submission
      fireEvent.click(screen.getByRole('button', { name: /proceed to next step/i }));
      expect(screen.getByText(/Step 6: Document Upload & Final Confirmation/i)).toBeInTheDocument();
      expect(screen.getByText(/Applicant Dossier Summary/i)).toBeInTheDocument();
      expect(screen.getByText(/Ethan Sterling/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /confirm & submit application/i })).toBeInTheDocument();
    });

    it('allows saving application as draft and returns draft reference code', async () => {
      (api.post as any).mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            applicationNumber: 'ADM-2026-9921',
            trackingToken: 'tok-draft-12345',
            status: 'DRAFT',
          },
        },
      });

      renderPublicAdmissions();

      const applyTab = screen.getByRole('button', { name: /application form/i });
      fireEvent.click(applyTab);

      // Fill basic student info
      fireEvent.change(screen.getByPlaceholderText(/e\.g\. Liam/i), { target: { value: 'Grace' } });
      fireEvent.change(screen.getByPlaceholderText(/e\.g\. Vance/i), { target: { value: 'Hopper' } });

      const saveDraftBtn = screen.getByRole('button', { name: /save as draft/i });
      fireEvent.click(saveDraftBtn);

      await waitFor(() => {
        expect(screen.getByText(/Draft successfully saved!/i)).toBeInTheDocument();
        expect(screen.getByText(/ADM-2026-9921/i)).toBeInTheDocument();
      });
    });

    it('submits final application and renders celebration screen with tracking shortcut', async () => {
      (api.post as any).mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            applicationNumber: 'ADM-2026-5544',
            studentName: 'Clara Oswald',
            gradeApplyingFor: 'GRADE_9',
            status: 'SUBMITTED',
            submittedAt: '2026-09-29T10:00:00Z',
          },
        },
      });

      renderPublicAdmissions();

      const applyTab = screen.getByRole('button', { name: /application form/i });
      fireEvent.click(applyTab);

      // Step 1
      fireEvent.change(screen.getByPlaceholderText(/e\.g\. Liam/i), { target: { value: 'Clara' } });
      fireEvent.change(screen.getByPlaceholderText(/e\.g\. Vance/i), { target: { value: 'Oswald' } });
      fireEvent.click(screen.getByRole('button', { name: /proceed to next step/i }));

      // Step 2
      fireEvent.change(screen.getByPlaceholderText(/e\.g\. David Vance/i), { target: { value: 'Dave Oswald' } });
      fireEvent.change(screen.getByPlaceholderText(/parent@example\.com/i), { target: { value: 'dave@example.com' } });
      fireEvent.change(screen.getByPlaceholderText(/\+1 \(555\) 000-0000/i), { target: { value: '+1 (555) 333-4444' } });
      fireEvent.click(screen.getByRole('button', { name: /proceed to next step/i }));

      // Step 3
      fireEvent.change(screen.getByPlaceholderText(/e\.g\. 742 Evergreen Terrace/i), { target: { value: '42 Tardis Lane' } });
      fireEvent.click(screen.getByRole('button', { name: /proceed to next step/i }));

      // Step 4
      fireEvent.click(screen.getByRole('button', { name: /proceed to next step/i }));

      // Step 5
      fireEvent.click(screen.getByRole('button', { name: /proceed to next step/i }));

      // Step 6: Submit
      const submitBtn = screen.getByRole('button', { name: /confirm & submit application/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText(/Application Submitted Successfully!/i)).toBeInTheDocument();
        expect(screen.getByText(/ADM-2026-5544/i)).toBeInTheDocument();
        expect(screen.getByText(/Clara Oswald/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /track this application status/i })).toBeInTheDocument();
      });
    });
  });

  describe('3. Public Admissions Portal — Workflow Tracking & Correction Handling', () => {
    it('tracks application under review and displays visual workflow progress', async () => {
      (api.get as any).mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            applicationNumber: 'ADM-2026-1042',
            studentName: 'Alexander Hayes',
            gradeApplyingFor: 'GRADE_9',
            status: 'UNDER_REVIEW',
            submittedAt: '2026-09-18T10:30:00Z',
            notes: 'Academic credentials verified. Committee review underway.',
          },
        },
      });

      renderPublicAdmissions();

      const trackTab = screen.getByRole('button', { name: /track status/i });
      fireEvent.click(trackTab);

      const input = screen.getByPlaceholderText(/enter reference/i);
      fireEvent.change(input, { target: { value: 'ADM-2026-1042' } });

      const trackBtn = screen.getByRole('button', { name: /^track$/i });
      fireEvent.click(trackBtn);

      await waitFor(() => {
        expect(screen.getByText(/Alexander Hayes/i)).toBeInTheDocument();
        expect(screen.getAllByText(/UNDER REVIEW/i).length).toBeGreaterThan(0);
        expect(screen.getByText(/Workflow Progression/i)).toBeInTheDocument();
        expect(screen.getByText(/Academic credentials verified/i)).toBeInTheDocument();
      });
    });

    it('tracks application with CORRECTION_REQUESTED and allows submitting corrections', async () => {
      (api.get as any).mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            applicationNumber: 'ADM-2026-1150',
            studentName: 'Marcus Vance',
            gradeApplyingFor: 'GRADE_6',
            status: 'CORRECTION_REQUESTED',
            submittedAt: '2026-09-22T14:45:00Z',
            notes: 'Please submit certified transfer certificate and updated address proof.',
            correctionRequest: {
              reason: 'Certified transfer certificate and updated residential proof are required for Grade 6 placement.',
              fieldsToCorrect: ['transferCertificateNumber', 'address'],
            },
          },
        },
      });

      (api.post as any).mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            applicationNumber: 'ADM-2026-1150',
            status: 'SUBMITTED',
          },
        },
      });

      renderPublicAdmissions();

      const trackTab = screen.getByRole('button', { name: /track status/i });
      fireEvent.click(trackTab);

      const input = screen.getByPlaceholderText(/enter reference/i);
      fireEvent.change(input, { target: { value: 'ADM-2026-1150' } });
      fireEvent.click(screen.getByRole('button', { name: /^track$/i }));

      await waitFor(() => {
        expect(screen.getByText(/Correction Requested by Admissions Committee/i)).toBeInTheDocument();
        expect(screen.getByText(/Certified transfer certificate and updated residential proof are required/i)).toBeInTheDocument();
      });

      // Fill in correction fields
      const addrInput = screen.getByPlaceholderText(/updated street address/i);
      fireEvent.change(addrInput, { target: { value: '55 University Road, Cambridge, MA' } });

      const tcInput = screen.getByPlaceholderText(/e\.g\. TC-2026-8812/i);
      fireEvent.change(tcInput, { target: { value: 'TC-2026-9901' } });

      const resubmitBtn = screen.getByRole('button', { name: /submit corrections/i });
      fireEvent.click(resubmitBtn);

      await waitFor(() => {
        expect(screen.getByText(/Corrections successfully submitted/i)).toBeInTheDocument();
      });
    });

    it('tracks officially ENROLLED application and displays student ID badge', async () => {
      (api.get as any).mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            applicationNumber: 'ADM-2026-0994',
            studentName: 'Emma Zhao',
            gradeApplyingFor: 'GRADE_10',
            status: 'ENROLLED',
            enrolledStudentId: 'STU-2026-8812',
            submittedAt: '2026-09-02T08:30:00Z',
          },
        },
      });

      renderPublicAdmissions();

      const trackTab = screen.getByRole('button', { name: /track status/i });
      fireEvent.click(trackTab);

      fireEvent.change(screen.getByPlaceholderText(/enter reference/i), { target: { value: 'ADM-2026-0994' } });
      fireEvent.click(screen.getByRole('button', { name: /^track$/i }));

      await waitFor(() => {
        expect(screen.getByText(/Officially Enrolled as (Oakridge|RBSRPS) Scholar!/i)).toBeInTheDocument();
        expect(screen.getByText(/STU-2026-8812/i)).toBeInTheDocument();
      });
    });
  });

  describe('4. Admin Admissions Pipeline — Review, Notes, Correction & Conversion', () => {
    const mockAdminApps = [
      {
        id: 'adm-001',
        applicationNumber: 'ADM-2026-1042',
        applicantFirstName: 'Alexander',
        applicantLastName: 'Hayes',
        applicantFullName: 'Alexander Hayes',
        dateOfBirth: '2011-04-18',
        gender: 'MALE',
        gradeApplyingFor: 'GRADE_9',
        academicYear: '2026-2027',
        parentName: 'Robert Hayes',
        parentEmail: 'robert.hayes@example.com',
        parentPhone: '+1 (555) 782-9901',
        address: '420 Concord Avenue, Cambridge, MA',
        previousSchool: 'Westbrook Junior High',
        status: 'UNDER_REVIEW',
        notes: 'Robotics club captain. High math scores.',
        reviewNotes: [
          {
            id: 'n-1',
            authorName: 'Admissions Dean',
            authorRole: 'ADMIN',
            note: 'Preliminary transcript audit approved.',
            createdAt: '2026-09-20T10:00:00Z',
          },
        ],
        documents: [
          {
            id: 'doc-001',
            name: 'Transcript_2025.pdf',
            type: 'TRANSCRIPT',
            sizeBytes: 2048576,
            mimeType: 'application/pdf',
            uploadedAt: '2026-09-18T10:35:00Z',
          },
        ],
        submittedAt: '2026-09-18T10:30:00Z',
      },
      {
        id: 'adm-002',
        applicationNumber: 'ADM-2026-1088',
        applicantFirstName: 'Sophia',
        applicantLastName: 'Patel',
        applicantFullName: 'Sophia Patel',
        dateOfBirth: '2021-08-22',
        gender: 'FEMALE',
        gradeApplyingFor: 'KINDERGARTEN',
        academicYear: '2026-2027',
        parentName: 'Priya Patel',
        parentEmail: 'priya.patel@example.com',
        parentPhone: '+1 (555) 349-1120',
        address: '88 Mass Ave, Cambridge, MA',
        status: 'APPROVED',
        submittedAt: '2026-09-10T09:00:00Z',
      },
    ];

    it('renders admin applications list and filters by search query and status', async () => {
      (api.get as any).mockResolvedValueOnce({
        data: { success: true, data: mockAdminApps },
      });

      renderAdminAdmissions();

      await waitFor(() => {
        expect(screen.getByText(/Alexander Hayes/i)).toBeInTheDocument();
        expect(screen.getByText(/Sophia Patel/i)).toBeInTheDocument();
      });

      // Filter by search query
      const searchInput = screen.getByPlaceholderText(/search by student/i);
      fireEvent.change(searchInput, { target: { value: 'Sophia' } });

      expect(screen.getByText(/Sophia Patel/i)).toBeInTheDocument();
      expect(screen.queryByText(/Alexander Hayes/i)).not.toBeInTheDocument();
    });

    it('opens review dossier and displays demographics, attached documents, and review notes', async () => {
      (api.get as any).mockImplementation((url: string) => {
        if (url.includes('/audit-logs')) {
          return Promise.resolve({
            data: {
              success: true,
              data: [
                {
                  id: 'log-1',
                  action: 'STATUS_CHANGE',
                  userName: 'Dean Margaret',
                  userRole: 'ADMIN',
                  details: { oldStatus: 'SUBMITTED', newStatus: 'UNDER_REVIEW' },
                  timestamp: '2026-09-19T10:00:00Z',
                },
              ],
            },
          });
        }
        return Promise.resolve({ data: { success: true, data: mockAdminApps } });
      });

      renderAdminAdmissions();

      await waitFor(() => {
        expect(screen.getByText(/Alexander Hayes/i)).toBeInTheDocument();
      });

      // Click eye icon to open dossier
      const viewButtons = screen.getAllByTitle(/view candidate dossier/i);
      fireEvent.click(viewButtons[0]);

      // Dossier modal should be open
      expect(screen.getByText(/Candidate Demographics/i)).toBeInTheDocument();
      expect(screen.getByText(/420 Concord Avenue, Cambridge, MA/i)).toBeInTheDocument();

      // Check Review Notes tab
      const notesTab = screen.getByRole('button', { name: /review notes/i });
      fireEvent.click(notesTab);
      expect(screen.getByText(/Preliminary transcript audit approved/i)).toBeInTheDocument();

      // Check Attached Documents tab
      const docsTab = screen.getByRole('button', { name: /attached documents/i });
      fireEvent.click(docsTab);
      expect(screen.getByText(/Transcript_2025\.pdf/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /download/i })).toBeInTheDocument();

      // Check Audit Trail tab
      const auditTab = screen.getByRole('button', { name: /audit trail/i });
      fireEvent.click(auditTab);
      await waitFor(() => {
        expect(screen.getByText(/Dean Margaret/i)).toBeInTheDocument();
      });
    });

    it('adds administrative review note to application dossier', async () => {
      (api.get as any).mockResolvedValue({
        data: { success: true, data: mockAdminApps },
      });

      (api.post as any).mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            id: 'note-new',
            authorName: 'Admissions Officer',
            authorRole: 'ADMIN',
            note: 'Interview completed. Recommended for full admission.',
            createdAt: '2026-09-29T14:00:00Z',
          },
        },
      });

      renderAdminAdmissions();

      await waitFor(() => {
        expect(screen.getByText(/Alexander Hayes/i)).toBeInTheDocument();
      });

      fireEvent.click(screen.getAllByTitle(/view candidate dossier/i)[0]);

      // Click Notes tab
      fireEvent.click(screen.getByRole('button', { name: /review notes/i }));

      const noteTextarea = screen.getByPlaceholderText(/add assessment findings/i);
      fireEvent.change(noteTextarea, {
        target: { value: 'Interview completed. Recommended for full admission.' },
      });

      const saveNoteBtn = screen.getByRole('button', { name: /record review note/i });
      fireEvent.click(saveNoteBtn);

      await waitFor(() => {
        expect(screen.getByText(/Interview completed\. Recommended for full admission\./i)).toBeInTheDocument();
        expect(screen.getByText(/Review note logged in candidate audit trail/i)).toBeInTheDocument();
      });
    });

    it('dispatches request correction from dossier', async () => {
      (api.get as any).mockResolvedValue({
        data: { success: true, data: mockAdminApps },
      });

      (api.patch as any).mockResolvedValueOnce({
        data: { success: true },
      });

      renderAdminAdmissions();

      await waitFor(() => {
        expect(screen.getByText(/Alexander Hayes/i)).toBeInTheDocument();
      });

      fireEvent.click(screen.getAllByTitle(/view candidate dossier/i)[0]);

      // Click "Request Correction" in dossier footer
      const reqCorrBtn = screen.getByRole('button', { name: /request correction/i });
      fireEvent.click(reqCorrBtn);

      expect(screen.getByText(/Request Correction from Applicant/i)).toBeInTheDocument();

      const reasonInput = screen.getByPlaceholderText(/specify why corrections are needed/i);
      fireEvent.change(reasonInput, {
        target: { value: 'Please provide certified birth certificate copy.' },
      });

      const dispatchBtn = screen.getByRole('button', { name: /dispatch request/i });
      fireEvent.click(dispatchBtn);

      await waitFor(() => {
        expect(screen.getByText(/Correction requested for ADM-2026-1042/i)).toBeInTheDocument();
      });
    });

    it('approves application and converts approved application into official student record', async () => {
      (api.get as any).mockResolvedValue({
        data: { success: true, data: mockAdminApps },
      });

      (api.patch as any).mockResolvedValueOnce({
        data: { success: true },
      });

      (api.post as any).mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            student: {
              id: 'STU-2026-7788',
              admissionNumber: 'ADM-7788',
            },
          },
        },
      });

      renderAdminAdmissions();

      await waitFor(() => {
        expect(screen.getByText(/Alexander Hayes/i)).toBeInTheDocument();
      });

      fireEvent.click(screen.getAllByTitle(/view candidate dossier/i)[0]);

      // 1. Approve Application
      const approveBtn = screen.getByRole('button', { name: /approve application/i });
      fireEvent.click(approveBtn);

      await waitFor(() => {
        expect(screen.getByText(/Application updated to APPROVED/i)).toBeInTheDocument();
      });

      // 2. Convert to Student Record
      const convertBtn = screen.getByRole('button', { name: /convert to student record/i });
      fireEvent.click(convertBtn);

      expect(screen.getByText(/Convert to Official Student Record/i)).toBeInTheDocument();

      const confirmEnrollBtn = screen.getByRole('button', { name: /confirm enrollment/i });
      fireEvent.click(confirmEnrollBtn);

      await waitFor(() => {
        expect(screen.getByText(/officially converted into Student record/i)).toBeInTheDocument();
      });
    });
  });
});
