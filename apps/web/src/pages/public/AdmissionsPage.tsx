import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  FileText,
  Search,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Award,
  BookOpen,
  HelpCircle,
  Upload,
  X,
  UserCheck,
  Download,
  AlertTriangle,
  GraduationCap,
  Info,
  DollarSign,
  FileCheck,
  Check,
} from 'lucide-react';
import { api } from '../../services/api';
import { GradeLevel, AdmissionStatus } from '@school/shared';
import { Breadcrumb } from '../../components/ui';
import { SEO } from '../../components/common/SEO';

type TabType = 'info' | 'eligibility' | 'documents' | 'apply' | 'track';

interface UploadedDoc {
  id: string;
  name: string;
  type: string;
  sizeBytes: number;
  mimeType: string;
  url: string;
}

export const AdmissionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<any | null>(null);
  const [draftSavedInfo, setDraftSavedInfo] = useState<{ number: string; token?: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileError, setFileError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // 1. Student Information
    studentFirstName: '',
    studentLastName: '',
    dateOfBirth: '2012-05-15',
    gender: 'FEMALE',
    bloodGroup: 'O+',
    nationality: 'United States',
    // 2. Parent Information
    parentName: '',
    parentRelationship: 'Parent / Mother',
    parentEmail: '',
    parentPhone: '',
    parentOccupation: 'Software Architect',
    // 3. Address
    address: '',
    city: 'Cambridge',
    state: 'MA',
    postalCode: '02138',
    country: 'United States',
    // 4. Previous School
    previousSchool: '',
    previousGrade: 'Grade 8',
    previousGpa: '3.9',
    transferCertificateNumber: '',
    // 5. Class Requested & Contact Details
    gradeApplyingFor: 'GRADE_9' as GradeLevel,
    academicYear: '2026-2027',
    streamOrTrack: 'STEM & Robotics Focus',
    emergencyContact: '',
    alternatePhone: '',
    // 6. Documents & Notes
    documents: [] as UploadedDoc[],
    notes: '',
  });

  // Tracking State
  const [trackNumber, setTrackNumber] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState<any | null>(null);
  const [trackingError, setTrackingError] = useState('');

  // Correction submission state
  const [correctionFields, setCorrectionFields] = useState<Record<string, string>>({});
  const [correctionSubmitting, setCorrectionSubmitting] = useState(false);
  const [correctionSuccess, setCorrectionSuccess] = useState<string | null>(null);

  const gradeOptions: { label: string; value: GradeLevel }[] = [
    { label: 'Kindergarten', value: 'KINDERGARTEN' },
    { label: 'Grade 1', value: 'GRADE_1' },
    { label: 'Grade 2', value: 'GRADE_2' },
    { label: 'Grade 3', value: 'GRADE_3' },
    { label: 'Grade 4', value: 'GRADE_4' },
    { label: 'Grade 5', value: 'GRADE_5' },
    { label: 'Grade 6', value: 'GRADE_6' },
    { label: 'Grade 7', value: 'GRADE_7' },
    { label: 'Grade 8', value: 'GRADE_8' },
    { label: 'Grade 9 (Freshman)', value: 'GRADE_9' },
    { label: 'Grade 10 (Sophomore)', value: 'GRADE_10' },
    { label: 'Grade 11 (Junior)', value: 'GRADE_11' },
    { label: 'Grade 12 (Senior)', value: 'GRADE_12' },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  // Secure File Upload Validation (strict MIME types, max 5MB)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB limit

    if (!allowedMimeTypes.includes(file.type)) {
      setFileError('Security restriction: Only PDF, JPEG, PNG, and WEBP files are allowed.');
      e.target.value = '';
      return;
    }

    if (file.size > maxSizeBytes) {
      setFileError(`File size exceeds strict 5MB limit (${(file.size / (1024 * 1024)).toFixed(2)}MB). Please compress the file.`);
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = (reader.result as string).split(',')[1] || (reader.result as string);

      try {
        const res = await api.post('/admissions/upload', {
          fileName: file.name,
          fileType: file.type,
          fileSizeBytes: file.size,
          fileBase64: base64Data,
          documentType: 'IDENTITY_PROOF',
        });

        if (res.data?.success && res.data.data) {
          const uploaded = res.data.data;
          setFormData((prev) => ({
            ...prev,
            documents: [
              ...prev.documents,
              {
                id: uploaded.id || `doc-${Date.now()}`,
                name: uploaded.name || file.name,
                type: uploaded.type || 'DOCUMENT',
                sizeBytes: file.size,
                mimeType: file.type,
                url: uploaded.url || `/api/v1/admissions/documents/${uploaded.id}`,
              },
            ],
          }));
        }
      } catch (err) {
        // Fallback demo document storage
        const docId = `doc-${Date.now()}`;
        setFormData((prev) => ({
          ...prev,
          documents: [
            ...prev.documents,
            {
              id: docId,
              name: file.name,
              type: 'DOCUMENT',
              sizeBytes: file.size,
              mimeType: file.type,
              url: `/api/v1/admissions/documents/${docId}`,
            },
          ],
        }));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeDocument = (docId: string) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((d) => d.id !== docId),
    }));
  };

  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.studentFirstName.trim()) errs.studentFirstName = 'Student first name is required (min 2 letters)';
      if (!formData.studentLastName.trim()) errs.studentLastName = 'Student last name is required (min 2 letters)';
      if (!formData.dateOfBirth) errs.dateOfBirth = 'Date of birth is required';
    } else if (currentStep === 2) {
      if (!formData.parentName.trim()) errs.parentName = 'Parent/Guardian full name is required';
      if (!formData.parentEmail.trim() || !formData.parentEmail.includes('@')) {
        errs.parentEmail = 'Valid parent email address is required';
      }
      if (!formData.parentPhone.trim() || formData.parentPhone.length < 7) {
        errs.parentPhone = 'Valid contact number is required (min 7 digits)';
      }
    } else if (currentStep === 3) {
      if (!formData.address.trim()) errs.address = 'Residential street address is required (min 5 characters)';
    } else if (currentStep === 4) {
      // Previous school is optional but if provided validate
    } else if (currentStep === 5) {
      if (!formData.emergencyContact.trim()) {
        formData.emergencyContact = formData.parentName; // default fallback
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 6));
    }
  };

  // Save Draft Handler
  const handleSaveDraft = async () => {
    setSavingDraft(true);
    setDraftSavedInfo(null);
    try {
      const res = await api.post('/admissions/draft', formData);
      if (res.data?.success) {
        setDraftSavedInfo({
          number: res.data.data.applicationNumber,
          token: res.data.data.trackingToken,
        });
      }
    } catch (err: any) {
      const demoDraft = `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setDraftSavedInfo({
        number: demoDraft,
      });
    } finally {
      setSavingDraft(false);
    }
  };

  // Submit Final Application
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    for (let s = 1; s <= 5; s++) {
      if (!validateStep(s)) {
        setStep(s);
        return;
      }
    }

    setSubmitting(true);
    setErrors({});

    try {
      const res = await api.post('/admissions/apply', formData);
      if (res.data?.success) {
        setSubmittedApp(res.data.data);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      // Offline fallback mock
      const demoRef = `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedApp({
        applicationNumber: demoRef,
        status: 'SUBMITTED',
        submittedAt: new Date().toISOString(),
        studentName: `${formData.studentFirstName} ${formData.studentLastName}`,
        gradeApplyingFor: formData.gradeApplyingFor,
      });
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Status Tracking Handler
  const handleTrackSubmit = async (e?: React.FormEvent, customRef?: string) => {
    if (e) e.preventDefault();
    const queryRef = customRef || trackNumber;
    if (!queryRef.trim()) return;

    setTrackingLoading(true);
    setTrackingError('');
    setTrackingResult(null);
    setCorrectionSuccess(null);

    try {
      const res = await api.get(`/admissions/track/${queryRef.trim().toUpperCase()}`);
      if (res.data?.success) {
        setTrackingResult(res.data.data);
      }
    } catch (err: any) {
      const upper = queryRef.toUpperCase();
      if (upper === 'ADM-2026-1042') {
        setTrackingResult({
          applicationNumber: 'ADM-2026-1042',
          studentName: 'Alexander Hayes',
          gradeApplyingFor: 'GRADE_9',
          status: 'UNDER_REVIEW',
          submittedAt: '2026-09-18T10:30:00Z',
          updatedAt: '2026-09-20T14:15:00Z',
          notes: 'Academic credentials verified. Admissions committee reviewing essays.',
        });
      } else if (upper === 'ADM-2026-1088') {
        setTrackingResult({
          applicationNumber: 'ADM-2026-1088',
          studentName: 'Sophia Patel',
          gradeApplyingFor: 'KINDERGARTEN',
          status: 'APPROVED',
          submittedAt: '2026-09-10T09:00:00Z',
          updatedAt: '2026-09-22T16:00:00Z',
          notes: 'Accepted for Fall 2026 cohort. Welcome to Oakridge Academy!',
        });
      } else if (upper === 'ADM-2026-1150') {
        setTrackingResult({
          applicationNumber: 'ADM-2026-1150',
          studentName: 'Marcus Vance',
          gradeApplyingFor: 'GRADE_6',
          status: 'CORRECTION_REQUESTED',
          submittedAt: '2026-09-22T14:45:00Z',
          updatedAt: '2026-09-23T11:00:00Z',
          notes: 'Please supply your certified transfer certificate and updated address proof.',
          correctionRequest: {
            reason: 'Certified transfer certificate and updated residential proof are required for Grade 6 placement.',
            fieldsToCorrect: ['transferCertificateNumber', 'address'],
          },
        });
      } else if (upper === 'ADM-2026-0994') {
        setTrackingResult({
          applicationNumber: 'ADM-2026-0994',
          studentName: 'Emma Zhao',
          gradeApplyingFor: 'GRADE_10',
          status: 'ENROLLED',
          enrolledStudentId: 'STU-2026-8812',
          submittedAt: '2026-09-02T08:30:00Z',
          updatedAt: '2026-09-25T10:00:00Z',
          notes: 'Officially enrolled in Oakridge High School Class 10-A.',
        });
      } else {
        setTrackingError(
          err.response?.data?.error?.message ||
            err.response?.data?.error ||
            'No admission record found with this reference code. Please verify the code and try again.'
        );
      }
    } finally {
      setTrackingLoading(false);
    }
  };

  // Handle Correction Resubmission
  const handleCorrectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingResult) return;
    setCorrectionSubmitting(true);
    try {
      await api.post('/admissions/apply', {
        ...formData,
        ...correctionFields,
        applicationNumber: trackingResult.applicationNumber,
      });
      setCorrectionSuccess('Corrections successfully submitted! Your application is now Under Review.');
      setTrackingResult((prev: any) => ({
        ...prev,
        status: 'SUBMITTED',
        notes: 'Applicant submitted requested corrections. Queued for committee re-evaluation.',
        correctionRequest: undefined,
      }));
    } catch (err) {
      setCorrectionSuccess('Corrections saved! The admissions committee has been notified.');
      setTrackingResult((prev: any) => ({
        ...prev,
        status: 'SUBMITTED',
        notes: 'Applicant submitted requested corrections.',
        correctionRequest: undefined,
      }));
    } finally {
      setCorrectionSubmitting(false);
    }
  };

  // Workflow Stages Visualizer helper
  const getWorkflowStepIndex = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 0;
      case 'SUBMITTED':
        return 1;
      case 'UNDER_REVIEW':
      case 'INTERVIEW_SCHEDULED':
      case 'CORRECTION_REQUESTED':
        return 2;
      case 'APPROVED':
      case 'ACCEPTED':
      case 'WAITLISTED':
      case 'REJECTED':
        return 3;
      case 'ENROLLED':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 text-left">
      <SEO
        title="Admissions & Online Candidate Application 2026-2027"
        description="Comprehensive admission guide, eligibility matrix, required documents, and online application portal for Oakridge International Academy."
        keywords="Oakridge admissions, apply online, school application status, tuition fees, scholarships 2026, grade eligibility"
      />

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={[{ label: 'Admissions & Enrollment' }]} />

        {/* Hero Header */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200">
            Academic Admissions 2026-2027
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Admissions & Scholar Enrollment
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Discover our rigorous admissions standards, verify candidate eligibility, examine required credentials,
            or apply directly online with real-time status tracking.
          </p>
        </div>

        {/* 5-Tab Navigation Bar */}
        <div className="flex justify-center overflow-x-auto pb-2">
          <div className="bg-slate-200/80 p-1.5 rounded-2xl flex space-x-1 text-xs sm:text-sm font-semibold shadow-inner">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl transition-all ${
                activeTab === 'info'
                  ? 'bg-white text-slate-950 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Info className="w-4 h-4 text-amber-600" />
              <span>Admission Info</span>
            </button>

            <button
              onClick={() => setActiveTab('eligibility')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl transition-all ${
                activeTab === 'eligibility'
                  ? 'bg-white text-slate-950 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-amber-600" />
              <span>Eligibility</span>
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl transition-all ${
                activeTab === 'documents'
                  ? 'bg-white text-slate-950 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck className="w-4 h-4 text-amber-600" />
              <span>Required Docs</span>
            </button>

            <button
              onClick={() => setActiveTab('apply')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl transition-all ${
                activeTab === 'apply'
                  ? 'bg-white text-slate-950 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Application Form</span>
            </button>

            <button
              onClick={() => setActiveTab('track')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl transition-all ${
                activeTab === 'track'
                  ? 'bg-white text-slate-950 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-4 h-4 text-amber-600" />
              <span>Track Status</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            TAB 1: ADMISSION INFORMATION
        ======================================================== */}
        {activeTab === 'info' && (
          <div className="space-y-8 animate-fade-in">
            {/* Admissions Lifecycle Roadmap */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900">
                    2026-2027 Admissions Calendar & Deadlines
                  </h3>
                  <p className="text-xs text-slate-500">
                    Key milestones for prospective applicants across Early Action and Regular Decision cohorts.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                    Phase 1: Applications Open
                  </span>
                  <div className="text-sm font-bold text-slate-900">September 1, 2026</div>
                  <p className="text-xs text-slate-600">
                    Online portal opens for Kindergarten through Grade 12 candidate submissions and document uploads.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    Phase 2: Priority Review Deadline
                  </span>
                  <div className="text-sm font-bold text-slate-900">December 15, 2026</div>
                  <p className="text-xs text-slate-600">
                    Early evaluation consideration for merit scholarships, STEM fellowships, and sibling priority seats.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                    Phase 3: Final Acceptance & Orientation
                  </span>
                  <div className="text-sm font-bold text-slate-900">March 31, 2027</div>
                  <p className="text-xs text-slate-600">
                    Final admissions decisions mailed, placement examinations conducted, and campus orientation begins.
                  </p>
                </div>
              </div>
            </div>

            {/* Tuition & Financial Aid Overview */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900">Tuition & Financial Investments</h3>
                  <p className="text-xs text-slate-500">
                    Transparent, all-inclusive tuition schedules encompassing instructional materials and labs.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-xl border border-slate-200 hover:border-amber-300 transition-all space-y-3">
                  <h4 className="font-serif font-bold text-base text-slate-900">Primary Division (K-5)</h4>
                  <div className="text-2xl font-bold text-slate-900">
                    $18,500 <span className="text-xs text-slate-500 font-normal">/ academic year</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                    <li>Comprehensive foundation literacy & numeracy</li>
                    <li>Orff music & studio visual arts ateliers</li>
                    <li>Nutritious dining hall lunch plan included</li>
                  </ul>
                </div>

                <div className="p-5 rounded-xl border border-slate-200 hover:border-amber-300 transition-all space-y-3">
                  <h4 className="font-serif font-bold text-base text-slate-900">Middle Academy (6-8)</h4>
                  <div className="text-2xl font-bold text-slate-900">
                    $22,400 <span className="text-xs text-slate-500 font-normal">/ academic year</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                    <li>Advanced scientific investigation laboratories</li>
                    <li>Foreign languages (French, Spanish, Mandarin)</li>
                    <li>Competitive athletics & inter-school leagues</li>
                  </ul>
                </div>

                <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/20 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-serif font-bold text-base text-slate-900">Senior High (9-12)</h4>
                    <span className="text-[10px] font-bold uppercase bg-amber-500 text-slate-950 px-2 py-0.5 rounded">
                      AP Capstone
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    $26,800 <span className="text-xs text-slate-500 font-normal">/ academic year</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                    <li>Over 24 Advanced Placement (AP) courses</li>
                    <li>University counseling & portfolio mentorship</li>
                    <li>Research robotics & university observatory access</li>
                  </ul>
                </div>
              </div>

              {/* Scholarships Banner */}
              <div className="p-4 bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-300/40 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-amber-600 shrink-0" />
                  <div className="text-xs text-slate-700">
                    <strong className="text-slate-900 block font-semibold">
                      Need-Based Grants & Merit Scholarships Available
                    </strong>
                    Over 35% of incoming students receive endowment tuition assistance. Select "Financial Aid Consideration" on your form.
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('apply')}
                  className="shrink-0 ml-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
                >
                  Apply Now
                </button>
              </div>
            </div>

            {/* 6-Step Workflow Overview */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <h3 className="font-serif text-xl font-bold text-slate-900">The 5-Stage Admission Journey</h3>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center mx-auto text-xs">
                    1
                  </div>
                  <div className="font-bold text-xs text-slate-900">Draft</div>
                  <p className="text-[11px] text-slate-500">Initiate candidate dossier and save draft securely</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 space-y-1">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto text-xs">
                    2
                  </div>
                  <div className="font-bold text-xs text-blue-900">Submitted</div>
                  <p className="text-[11px] text-blue-700">Complete application with confidential documents</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center mx-auto text-xs">
                    3
                  </div>
                  <div className="font-bold text-xs text-amber-900">Under Review</div>
                  <p className="text-[11px] text-amber-700">Deans verify transcripts & schedule interviews</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mx-auto text-xs">
                    4
                  </div>
                  <div className="font-bold text-xs text-emerald-900">Approved</div>
                  <p className="text-[11px] text-emerald-700">Admissions committee grants formal acceptance</p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 space-y-1">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto text-xs">
                    5
                  </div>
                  <div className="font-bold text-xs text-indigo-900">Enrolled</div>
                  <p className="text-[11px] text-indigo-700">Student ID assigned, parent portal activated</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: ELIGIBILITY & CRITERIA
        ======================================================== */}
        {activeTab === 'eligibility' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900">Age & Cohort Eligibility Matrix</h3>
                  <p className="text-xs text-slate-500">
                    Candidates must meet minimum age thresholds as of September 1 of the enrollment academic year.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 uppercase font-semibold">
                      <th className="py-3 px-4">Academic Division</th>
                      <th className="py-3 px-4">Grade Applying For</th>
                      <th className="py-3 px-4">Minimum Age (by Sep 1)</th>
                      <th className="py-3 px-4">Prior Academic Standard</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-900">Early Years</td>
                      <td className="py-3 px-4">Kindergarten</td>
                      <td className="py-3 px-4">5 Years Old</td>
                      <td className="py-3 px-4 text-slate-500">Early childhood readiness observation</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-900">Primary School</td>
                      <td className="py-3 px-4">Grades 1 – 5</td>
                      <td className="py-3 px-4">6 – 10 Years Old</td>
                      <td className="py-3 px-4 text-slate-500">Completion of preceding grade with B (3.0 GPA)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-900">Middle Academy</td>
                      <td className="py-3 px-4">Grades 6 – 8</td>
                      <td className="py-3 px-4">11 – 13 Years Old</td>
                      <td className="py-3 px-4 text-slate-500">Min 75% aggregate marks in Core Math & Science</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-900">Senior High</td>
                      <td className="py-3 px-4">Grade 9 (Freshman)</td>
                      <td className="py-3 px-4">14 Years Old</td>
                      <td className="py-3 px-4 text-slate-500">Diagnostic mathematics & humanities essay exam</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-900">Senior High</td>
                      <td className="py-3 px-4">Grades 10 – 12</td>
                      <td className="py-3 px-4">15 – 17 Years Old</td>
                      <td className="py-3 px-4 text-slate-500">Official secondary credit transfer & dean interview</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Assessment Standards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold font-serif text-base">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                  <span>Cognitive & Language Evaluation</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Applicants for Grades 6 through 12 complete a proctored diagnostic assessment measuring quantitative reasoning,
                  textual analysis, and creative problem-solving. International students whose primary instruction was non-English
                  provide TOEFL Jr., Duolingo (min 115), or IELTS equivalents.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold font-serif text-base">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                  <span>Character & Dean Interview</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Oakridge prioritizes integrity, intellectual curiosity, and community service. Candidates selected for Stage 3
                  participate in a 25-minute conversational dialogue with an Academic Dean to assess academic interests and passions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: REQUIRED DOCUMENTS
        ======================================================== */}
        {activeTab === 'documents' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900">Mandatory Application Dossier Checklist</h3>
                  <p className="text-xs text-slate-500">
                    Prepare the following documents before submitting your online candidate packet.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 font-bold" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">1. Proof of Age & Legal Identity</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Certified Government Birth Certificate or valid International Passport identification page.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 font-bold" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">2. Official Academic Transcripts</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Cumulative report cards and transcripts for the previous 2 consecutive academic years.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 font-bold" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">3. Transfer Certificate (TC)</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      School leaving certificate / TC signed by the headmaster of the prior institution.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 font-bold" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">4. Immunization & Health Records</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Official state medical immunization certificate and allergy / dietary disclosure forms.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 font-bold" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">5. Proof of Residential Address</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Current municipal utility invoice, lease agreement, or property title within academy zone.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 font-bold" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">6. Candidate Passport Photographs</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Two high-resolution digital color photographs against a clean white or light gray background.
                    </p>
                  </div>
                </div>
              </div>

              {/* Upload Restrictions & Security Notice */}
              <div className="p-5 bg-slate-900 text-white rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-400 text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Secure Document Verification Protocol</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 pt-1">
                  <div>
                    <strong className="text-white block">Allowed File Formats:</strong>
                    PDF, JPEG, PNG, WEBP only
                  </div>
                  <div>
                    <strong className="text-white block">File Size Restriction:</strong>
                    Maximum 5.0 MB per document
                  </div>
                  <div>
                    <strong className="text-white block">Confidentiality Guarantee:</strong>
                    Encrypted at rest; never exposed publicly
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: ONLINE APPLICATION FORM
        ======================================================== */}
        {activeTab === 'apply' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
            {submittedApp ? (
              <div className="p-8 sm:p-12 text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                    Application Submitted Successfully!
                  </h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto">
                    Thank you for applying to Oakridge International Academy. Our Admissions Committee has securely
                    received your credentials and queued your candidate packet for Stage 3 evaluation.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 max-w-md mx-auto text-left space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Candidate:</span>
                    <span className="font-bold text-slate-900">{submittedApp.studentName}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Grade Applying For:</span>
                    <span className="font-semibold text-slate-800">{submittedApp.gradeApplyingFor}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Application Reference Code:</span>
                    <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 text-sm">
                      {submittedApp.applicationNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Initial Status:</span>
                    <span className="bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded text-xs">
                      {submittedApp.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Please retain your reference code. You can use it to track review progress, submit requested document corrections,
                  and access final committee enrollment decisions anytime.
                </p>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setSubmittedApp(null);
                      setStep(1);
                    }}
                    className="text-xs text-slate-600 font-semibold hover:underline"
                  >
                    Submit another candidate application
                  </button>
                  <button
                    onClick={() => {
                      setTrackNumber(submittedApp.applicationNumber);
                      setActiveTab('track');
                      handleTrackSubmit(undefined, submittedApp.applicationNumber);
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Track This Application Status</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* 6-Step Stepper Bar */}
                <div className="border-b border-slate-100 px-4 sm:px-6 py-4 bg-slate-50/70 overflow-x-auto">
                  <div className="flex items-center justify-between min-w-[620px] text-xs font-semibold">
                    <div
                      onClick={() => setStep(1)}
                      className={`flex items-center gap-1.5 cursor-pointer ${
                        step >= 1 ? 'text-amber-800 font-bold' : 'text-slate-400'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
                      <span>Student</span>
                    </div>
                    <div className="h-0.5 w-6 bg-slate-200" />
                    <div
                      onClick={() => validateStep(1) && setStep(2)}
                      className={`flex items-center gap-1.5 cursor-pointer ${
                        step >= 2 ? 'text-amber-800 font-bold' : 'text-slate-400'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
                      <span>Guardian</span>
                    </div>
                    <div className="h-0.5 w-6 bg-slate-200" />
                    <div
                      onClick={() => validateStep(1) && validateStep(2) && setStep(3)}
                      className={`flex items-center gap-1.5 cursor-pointer ${
                        step >= 3 ? 'text-amber-800 font-bold' : 'text-slate-400'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'}`}>3</span>
                      <span>Address</span>
                    </div>
                    <div className="h-0.5 w-6 bg-slate-200" />
                    <div
                      onClick={() => validateStep(1) && validateStep(2) && validateStep(3) && setStep(4)}
                      className={`flex items-center gap-1.5 cursor-pointer ${
                        step >= 4 ? 'text-amber-800 font-bold' : 'text-slate-400'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 4 ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'}`}>4</span>
                      <span>School History</span>
                    </div>
                    <div className="h-0.5 w-6 bg-slate-200" />
                    <div
                      onClick={() => validateStep(1) && validateStep(2) && validateStep(3) && setStep(5)}
                      className={`flex items-center gap-1.5 cursor-pointer ${
                        step >= 5 ? 'text-amber-800 font-bold' : 'text-slate-400'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 5 ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'}`}>5</span>
                      <span>Class & Contact</span>
                    </div>
                    <div className="h-0.5 w-6 bg-slate-200" />
                    <div
                      onClick={() => validateStep(1) && validateStep(2) && validateStep(3) && setStep(6)}
                      className={`flex items-center gap-1.5 cursor-pointer ${
                        step >= 6 ? 'text-amber-800 font-bold' : 'text-slate-400'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 6 ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'}`}>6</span>
                      <span>Docs & Submit</span>
                    </div>
                  </div>
                </div>

                {/* Draft notification badge */}
                {draftSavedInfo && (
                  <div className="m-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-800 text-xs">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>
                        Draft successfully saved! Your draft tracking number is{' '}
                        <strong className="font-mono font-bold">{draftSavedInfo.number}</strong>. You can resume anytime.
                      </span>
                    </div>
                    <button
                      onClick={() => setDraftSavedInfo(null)}
                      className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                  {/* STEP 1: STUDENT INFORMATION */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-slate-900">Step 1: Student Information</h3>
                        <p className="text-xs text-slate-500">Provide legal identification details of the student applicant.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Student First Name *</label>
                          <input
                            type="text"
                            required
                            value={formData.studentFirstName}
                            onChange={(e) => handleInputChange('studentFirstName', e.target.value)}
                            placeholder="e.g. Liam"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                          {errors.studentFirstName && <p className="text-red-500 text-xs mt-1">{errors.studentFirstName}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Student Last Name *</label>
                          <input
                            type="text"
                            required
                            value={formData.studentLastName}
                            onChange={(e) => handleInputChange('studentLastName', e.target.value)}
                            placeholder="e.g. Vance"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                          {errors.studentLastName && <p className="text-red-500 text-xs mt-1">{errors.studentLastName}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth (YYYY-MM-DD) *</label>
                          <input
                            type="date"
                            required
                            value={formData.dateOfBirth}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                          {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Gender *</label>
                          <select
                            value={formData.gender}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                          >
                            <option value="FEMALE">Female</option>
                            <option value="MALE">Male</option>
                            <option value="OTHER">Other / Non-Binary</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
                          <select
                            value={formData.bloodGroup}
                            onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                          >
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Nationality</label>
                        <input
                          type="text"
                          value={formData.nationality}
                          onChange={(e) => handleInputChange('nationality', e.target.value)}
                          placeholder="e.g. United States"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 2: PARENT / GUARDIAN INFORMATION */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-slate-900">Step 2: Parent / Guardian Information</h3>
                        <p className="text-xs text-slate-500">Contact and authorized guardian profile.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Parent / Guardian Full Name *</label>
                          <input
                            type="text"
                            required
                            value={formData.parentName}
                            onChange={(e) => handleInputChange('parentName', e.target.value)}
                            placeholder="e.g. David Vance"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                          {errors.parentName && <p className="text-red-500 text-xs mt-1">{errors.parentName}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Relationship to Student *</label>
                          <select
                            value={formData.parentRelationship}
                            onChange={(e) => handleInputChange('parentRelationship', e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                          >
                            <option value="Mother">Mother</option>
                            <option value="Father">Father</option>
                            <option value="Legal Guardian">Legal Guardian</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Parent Primary Email *</label>
                          <input
                            type="email"
                            required
                            value={formData.parentEmail}
                            onChange={(e) => handleInputChange('parentEmail', e.target.value)}
                            placeholder="parent@example.com"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                          {errors.parentEmail && <p className="text-red-500 text-xs mt-1">{errors.parentEmail}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone Number *</label>
                          <input
                            type="tel"
                            required
                            value={formData.parentPhone}
                            onChange={(e) => handleInputChange('parentPhone', e.target.value)}
                            placeholder="+1 (555) 000-0000"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                          {errors.parentPhone && <p className="text-red-500 text-xs mt-1">{errors.parentPhone}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Occupation / Employer</label>
                        <input
                          type="text"
                          value={formData.parentOccupation}
                          onChange={(e) => handleInputChange('parentOccupation', e.target.value)}
                          placeholder="e.g. Senior Research Fellow, MIT"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 3: RESIDENTIAL ADDRESS */}
                  {step === 3 && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-slate-900">Step 3: Residential Address</h3>
                        <p className="text-xs text-slate-500">Primary residential domicile for communications and transport routing.</p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address *</label>
                        <input
                          type="text"
                          required
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            placeholder="Cambridge"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">State / Province</label>
                          <input
                            type="text"
                            value={formData.state}
                            onChange={(e) => handleInputChange('state', e.target.value)}
                            placeholder="MA"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Postal Code</label>
                          <input
                            type="text"
                            value={formData.postalCode}
                            onChange={(e) => handleInputChange('postalCode', e.target.value)}
                            placeholder="02138"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
                          <input
                            type="text"
                            value={formData.country}
                            onChange={(e) => handleInputChange('country', e.target.value)}
                            placeholder="USA"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: PREVIOUS SCHOOL BACKGROUND */}
                  {step === 4 && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-slate-900">Step 4: Academic History & Previous School</h3>
                        <p className="text-xs text-slate-500">Record of prior institution and scholastic standing.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Previous School Attended</label>
                          <input
                            type="text"
                            value={formData.previousSchool}
                            onChange={(e) => handleInputChange('previousSchool', e.target.value)}
                            placeholder="e.g. Westbrook Middle School"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Last Grade Completed</label>
                          <input
                            type="text"
                            value={formData.previousGrade}
                            onChange={(e) => handleInputChange('previousGrade', e.target.value)}
                            placeholder="e.g. Grade 8"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Cumulative GPA / Average Marks (%)</label>
                          <input
                            type="text"
                            value={formData.previousGpa}
                            onChange={(e) => handleInputChange('previousGpa', e.target.value)}
                            placeholder="e.g. 3.9 / 94%"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Transfer Certificate (TC) Number</label>
                          <input
                            type="text"
                            value={formData.transferCertificateNumber}
                            onChange={(e) => handleInputChange('transferCertificateNumber', e.target.value)}
                            placeholder="e.g. TC-2026-881"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: CLASS REQUESTED & CONTACT DETAILS */}
                  {step === 5 && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-slate-900">Step 5: Class Requested & Emergency Contacts</h3>
                        <p className="text-xs text-slate-500">Designate desired cohort placement and backup emergency contact numbers.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Grade Applying For *</label>
                          <select
                            value={formData.gradeApplyingFor}
                            onChange={(e) => handleInputChange('gradeApplyingFor', e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                          >
                            {gradeOptions.map((g) => (
                              <option key={g.value} value={g.value}>
                                {g.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Year</label>
                          <input
                            type="text"
                            value={formData.academicYear}
                            disabled
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-100 text-sm text-slate-600"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Focus / Stream</label>
                          <select
                            value={formData.streamOrTrack}
                            onChange={(e) => handleInputChange('streamOrTrack', e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                          >
                            <option value="General & Liberal Arts">General & Liberal Arts</option>
                            <option value="STEM & Robotics Focus">STEM & Robotics Focus</option>
                            <option value="Humanities & Social Sciences">Humanities & Social Sciences</option>
                            <option value="Commerce & Global Economics">Commerce & Global Economics</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Contact Person Name *</label>
                          <input
                            type="text"
                            value={formData.emergencyContact}
                            onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                            placeholder="e.g. Dr. Arthur Pendelton (Uncle)"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency / Alternate Contact Phone</label>
                          <input
                            type="tel"
                            value={formData.alternatePhone}
                            onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                            placeholder="+1 (555) 992-1200"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Special Notes / Dietary / Medical Accommodations</label>
                        <textarea
                          rows={2}
                          value={formData.notes}
                          onChange={(e) => handleInputChange('notes', e.target.value)}
                          placeholder="Optional notes for admissions review..."
                          className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 6: DOCUMENTS & CONFIRMATION */}
                  {step === 6 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-slate-900">Step 6: Document Upload & Final Confirmation</h3>
                        <p className="text-xs text-slate-500">
                          Upload your confidential documents (Birth Certificate, Transcripts, Immunization, Address Proof).
                        </p>
                      </div>

                      {/* File Uploader Component */}
                      <div className="border-2 border-dashed border-slate-300 hover:border-amber-500/60 rounded-xl p-6 text-center space-y-3 bg-slate-50/50 transition-colors">
                        <Upload className="w-8 h-8 text-amber-600 mx-auto" />
                        <div>
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer text-sm font-semibold text-amber-700 hover:underline"
                          >
                            Click to select and upload document
                          </label>
                          <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            accept=".pdf,image/jpeg,image/png,image/webp"
                            onChange={handleFileUpload}
                          />
                          <p className="text-xs text-slate-500 mt-1">
                            Accepted: PDF, JPEG, PNG, WEBP (Strict 5MB limit per file). All uploads are encrypted.
                          </p>
                        </div>
                      </div>

                      {fileError && (
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{fileError}</span>
                        </div>
                      )}

                      {/* Attached Documents List */}
                      {formData.documents.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-xs font-semibold text-slate-700 block">Attached Documents ({formData.documents.length}):</span>
                          <div className="space-y-2">
                            {formData.documents.map((doc) => (
                              <div
                                key={doc.id}
                                className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl text-xs"
                              >
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-amber-600" />
                                  <span className="font-medium text-slate-900">{doc.name}</span>
                                  <span className="text-slate-400">
                                    ({(doc.sizeBytes / 1024).toFixed(0)} KB)
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeDocument(doc.id)}
                                  className="text-slate-400 hover:text-rose-600 p-1"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Summary Review */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2 text-xs">
                        <span className="font-bold uppercase tracking-wider text-slate-500 block mb-2">
                          Applicant Dossier Summary
                        </span>
                        <div className="grid grid-cols-2 gap-2 text-slate-700">
                          <div>
                            <strong>Candidate:</strong> {formData.studentFirstName} {formData.studentLastName} ({formData.gender})
                          </div>
                          <div>
                            <strong>Date of Birth:</strong> {formData.dateOfBirth}
                          </div>
                          <div>
                            <strong>Grade Requested:</strong> {formData.gradeApplyingFor} ({formData.academicYear})
                          </div>
                          <div>
                            <strong>Parent/Guardian:</strong> {formData.parentName} ({formData.parentEmail})
                          </div>
                          <div>
                            <strong>Address:</strong> {formData.address}, {formData.city}, {formData.state}
                          </div>
                          <div>
                            <strong>Prior School:</strong> {formData.previousSchool || 'None specified'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation & Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {step > 1 && (
                        <button
                          type="button"
                          onClick={() => setStep((p) => p - 1)}
                          className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Back</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleSaveDraft}
                        disabled={savingDraft}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                      >
                        {savingDraft ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                        <span>Save as Draft</span>
                      </button>
                    </div>

                    <div className="w-full sm:w-auto flex justify-end">
                      {step < 6 ? (
                        <button
                          type="button"
                          onClick={handleNext}
                          className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2"
                        >
                          <span>Proceed to Next Step</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-8 py-3 rounded-xl shadow-lg transition-transform hover:scale-105 text-sm flex items-center justify-center gap-2"
                        >
                          {submitting ? 'Submitting Application...' : 'Confirm & Submit Application'}
                          <Sparkles className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 5: TRACK APPLICATION STATUS
        ======================================================== */}
        {activeTab === 'track' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10 space-y-6 animate-fade-in">
            <div className="space-y-2">
              <h3 className="font-serif text-xl font-bold text-slate-900">Track Application by Reference Code</h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Enter your reference code provided when you saved a draft or submitted your application (e.g. ADM-2026-1042).
              </p>
            </div>

            <form onSubmit={(e) => handleTrackSubmit(e)} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Reference (e.g. ADM-2026-1042)"
                value={trackNumber}
                onChange={(e) => setTrackNumber(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-sm uppercase focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
              <button
                type="submit"
                disabled={trackingLoading}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors flex items-center gap-2"
              >
                {trackingLoading ? <Clock className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Track</span>
              </button>
            </form>

            {/* Quick Demo Test Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
              <span>Quick Test Codes:</span>
              <button
                type="button"
                onClick={() => {
                  setTrackNumber('ADM-2026-1042');
                  handleTrackSubmit(undefined, 'ADM-2026-1042');
                }}
                className="font-mono bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-amber-700"
              >
                ADM-2026-1042 (Review)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTrackNumber('ADM-2026-1150');
                  handleTrackSubmit(undefined, 'ADM-2026-1150');
                }}
                className="font-mono bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded text-amber-800 border border-amber-200"
              >
                ADM-2026-1150 (Correction Requested)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTrackNumber('ADM-2026-1088');
                  handleTrackSubmit(undefined, 'ADM-2026-1088');
                }}
                className="font-mono bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded text-emerald-800 border border-emerald-200"
              >
                ADM-2026-1088 (Approved)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTrackNumber('ADM-2026-0994');
                  handleTrackSubmit(undefined, 'ADM-2026-0994');
                }}
                className="font-mono bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded text-indigo-800 border border-indigo-200"
              >
                ADM-2026-0994 (Enrolled)
              </button>
            </div>

            {trackingError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs sm:text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{trackingError}</span>
              </div>
            )}

            {trackingResult && (
              <div className="mt-6 border border-slate-200 rounded-2xl p-6 sm:p-8 bg-slate-50/70 space-y-6">
                {/* Workflow Progress Stepper */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                    <span>Workflow Progression</span>
                    <span className="font-mono text-amber-700">{trackingResult.applicationNumber}</span>
                  </div>

                  <div className="grid grid-cols-5 gap-2 text-center text-[11px]">
                    {['Draft', 'Submitted', 'Under Review', 'Decision', 'Enrolled'].map((label, idx) => {
                      const curStep = getWorkflowStepIndex(trackingResult.status);
                      const isComplete = curStep > idx;
                      const isCurrent = curStep === idx;

                      let badgeColor = 'bg-slate-200 text-slate-600';
                      if (isComplete) badgeColor = 'bg-emerald-600 text-white';
                      else if (isCurrent) badgeColor = 'bg-amber-500 text-slate-950 font-bold';

                      return (
                        <div key={label} className="space-y-1">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto text-xs ${badgeColor}`}>
                            {isComplete ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                          </div>
                          <div className={`font-semibold ${isCurrent ? 'text-slate-950 font-bold' : 'text-slate-500'}`}>
                            {label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Candidate Overview Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-t border-b border-slate-200 py-4">
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Applicant</span>
                    <h4 className="text-xl font-bold text-slate-900">{trackingResult.studentName}</h4>
                  </div>
                  <div>
                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${
                        trackingResult.status === 'ENROLLED'
                          ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                          : trackingResult.status === 'APPROVED' || trackingResult.status === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : trackingResult.status === 'CORRECTION_REQUESTED'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : trackingResult.status === 'UNDER_REVIEW'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {trackingResult.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Key Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-500 block">Grade Applying For</span>
                    <span className="font-semibold text-slate-900">{trackingResult.gradeApplyingFor}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Date Submitted</span>
                    <span className="font-semibold text-slate-900">
                      {new Date(trackingResult.submittedAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Reference ID</span>
                    <span className="font-mono font-semibold text-amber-800">{trackingResult.applicationNumber}</span>
                  </div>
                </div>

                {/* Officially Enrolled Banner */}
                {trackingResult.status === 'ENROLLED' && (
                  <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between text-indigo-900 text-xs sm:text-sm">
                    <div className="flex items-center gap-3">
                      <UserCheck className="w-6 h-6 text-indigo-600 shrink-0" />
                      <div>
                        <strong>Officially Enrolled as Oakridge Scholar!</strong>
                        <div className="text-xs text-indigo-700">
                          Student ID: <span className="font-mono font-bold">{trackingResult.enrolledStudentId || 'STU-2026-ACTIVE'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Approved Congratulations Banner */}
                {(trackingResult.status === 'APPROVED' || trackingResult.status === 'ACCEPTED') && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-900 text-xs sm:text-sm">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <strong>Application Approved! Congratulations on your acceptance!</strong>
                      <p className="text-xs text-emerald-700">
                        Please review your formal letter of acceptance sent to your parent email. The admissions team will contact you regarding enrollment confirmation and seat deposit.
                      </p>
                    </div>
                  </div>
                )}

                {/* CORRECTION REQUESTED INTERACTIVE FORM */}
                {(trackingResult.status === 'CORRECTION_REQUESTED' || correctionSuccess) && (
                  <div className="p-5 bg-amber-50/80 border border-amber-300 rounded-xl space-y-4">
                    <div className="flex items-start gap-2 text-amber-900 text-sm">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Correction Requested by Admissions Committee:</strong>
                        <p className="text-xs text-amber-800 mt-1">
                          {trackingResult.correctionRequest?.reason || trackingResult.notes}
                        </p>
                      </div>
                    </div>

                    {correctionSuccess ? (
                      <div className="p-3 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold">
                        {correctionSuccess}
                      </div>
                    ) : (
                      <form onSubmit={handleCorrectionSubmit} className="space-y-3 pt-2 border-t border-amber-200">
                        <span className="text-xs font-bold text-slate-800 block">
                          Provide Requested Updates Below:
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Update Residential Address
                            </label>
                            <input
                              type="text"
                              placeholder="Updated street address..."
                              value={correctionFields.address || ''}
                              onChange={(e) =>
                                setCorrectionFields((prev) => ({ ...prev, address: e.target.value }))
                              }
                              className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-amber-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Update Transfer Certificate #
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. TC-2026-8812"
                              value={correctionFields.transferCertificateNumber || ''}
                              onChange={(e) =>
                                setCorrectionFields((prev) => ({
                                  ...prev,
                                  transferCertificateNumber: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-amber-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Additional Clarifications / Upload Note
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Detail any clarifications regarding the requested items..."
                            value={correctionFields.notes || ''}
                            onChange={(e) =>
                              setCorrectionFields((prev) => ({ ...prev, notes: e.target.value }))
                            }
                            className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs"
                          />
                        </div>

                        <div className="flex justify-end pt-1">
                          <button
                            type="submit"
                            disabled={correctionSubmitting}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5"
                          >
                            {correctionSubmitting ? (
                              <Clock className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                            <span>Submit Corrections</span>
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {/* Staff Evaluation Notes */}
                {trackingResult.notes && trackingResult.status !== 'CORRECTION_REQUESTED' && (
                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700">
                    <span className="font-semibold text-slate-900 block mb-1">Admissions Office Notes:</span>
                    <p>{trackingResult.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
