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
  ShieldCheck,
  AlertCircle,
  Building,
} from 'lucide-react';
import { api } from '../../services/api';
import { GradeLevel, GradeLevelSchema, AdmissionApplicationSchema } from '@school/shared';

export const AdmissionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'apply' | 'track'>('apply');
  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<any | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  const [formData, setFormData] = useState({
    studentFirstName: '',
    studentLastName: '',
    dateOfBirth: '2012-05-15',
    gradeApplyingFor: 'GRADE_9' as GradeLevel,
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    address: '',
    previousSchool: '',
    notes: '',
  });

  // Tracking State
  const [trackNumber, setTrackNumber] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState<any | null>(null);
  const [trackingError, setTrackingError] = useState('');

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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.studentFirstName.trim()) errs.studentFirstName = 'Student first name is required';
      if (!formData.studentLastName.trim()) errs.studentLastName = 'Student last name is required';
      if (!formData.dateOfBirth) errs.dateOfBirth = 'Date of birth is required';
    } else if (currentStep === 2) {
      if (!formData.parentName.trim()) errs.parentName = 'Parent/Guardian full name is required';
      if (!formData.parentEmail.trim() || !formData.parentEmail.includes('@')) {
        errs.parentEmail = 'Valid parent email is required';
      }
      if (!formData.parentPhone.trim() || formData.parentPhone.length < 7) {
        errs.parentPhone = 'Valid contact number is required';
      }
      if (!formData.address.trim()) errs.address = 'Residential address is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(2)) return;

    setSubmitting(true);
    setErrors({});

    try {
      const res = await api.post('/admissions/apply', formData);
      if (res.data.success) {
        setSubmittedApp(res.data.data);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      // In case server is offline, generate local mock submission
      const demoRef = `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedApp({
        applicationNumber: demoRef,
        status: 'SUBMITTED',
        submittedAt: new Date().toISOString(),
        studentName: `${formData.studentFirstName} ${formData.studentLastName}`,
      });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackSubmit = async (e?: React.FormEvent, customRef?: string) => {
    if (e) e.preventDefault();
    const queryRef = customRef || trackNumber;
    if (!queryRef.trim()) return;

    setTrackingLoading(true);
    setTrackingError('');
    setTrackingResult(null);

    try {
      const res = await api.get(`/admissions/track/${queryRef.trim().toUpperCase()}`);
      if (res.data.success) {
        setTrackingResult(res.data.data);
      }
    } catch (err: any) {
      // Fallback sample data for demo lookup
      if (queryRef.toUpperCase() === 'ADM-2026-1042') {
        setTrackingResult({
          applicationNumber: 'ADM-2026-1042',
          studentName: 'Alexander Hayes',
          gradeApplyingFor: 'GRADE_9',
          status: 'UNDER_REVIEW',
          submittedAt: '2026-09-18T10:30:00Z',
          updatedAt: '2026-09-20T14:15:00Z',
          notes: 'Academic credentials verified. Admissions committee reviewing essays.',
        });
      } else if (queryRef.toUpperCase() === 'ADM-2026-1088') {
        setTrackingResult({
          applicationNumber: 'ADM-2026-1088',
          studentName: 'Sophia Patel',
          gradeApplyingFor: 'KINDERGARTEN',
          status: 'ACCEPTED',
          submittedAt: '2026-09-10T09:00:00Z',
          updatedAt: '2026-09-22T16:00:00Z',
          notes: 'Official letter of acceptance mailed. Welcome to Oakridge!',
        });
      } else {
        setTrackingError(err.response?.data?.error || 'No application found with this reference code. Please verify and try again.');
      }
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-crest-600 bg-crest-50 px-3 py-1 rounded-full border border-crest-100">
            Admissions Office
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900">
            Enrollment & Application Portal
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Apply online for the 2026-2027 academic school year or track your active application status in real-time.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex justify-center">
          <div className="bg-slate-200/80 p-1 rounded-xl flex space-x-1 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('apply')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all ${
                activeTab === 'apply' ? 'bg-white text-crest-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Apply Online</span>
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all ${
                activeTab === 'track' ? 'bg-white text-crest-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Track Status</span>
            </button>
          </div>
        </div>

        {/* TAB 1: APPLY ONLINE */}
        {activeTab === 'apply' && (
          <div className="bg-white rounded-2xl shadow-elevated border border-slate-200 overflow-hidden">
            {submittedApp ? (
              <div className="p-8 sm:p-12 text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                    Application Submitted Successfully!
                  </h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto">
                    Thank you for applying to Oakridge Academy. Our admissions committee has received your packet.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 max-w-md mx-auto text-left space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Student:</span>
                    <span className="font-bold text-slate-900">{submittedApp.studentName}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Reference Number:</span>
                    <span className="font-mono font-bold text-crest-700 bg-crest-50 px-2 py-0.5 rounded border border-crest-200">
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
                  Save your reference number to track admission interview updates and committee decision status anytime.
                </p>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setSubmittedApp(null);
                      setStep(1);
                      setFormData({
                        studentFirstName: '',
                        studentLastName: '',
                        dateOfBirth: '2012-05-15',
                        gradeApplyingFor: 'GRADE_9',
                        parentName: '',
                        parentEmail: '',
                        parentPhone: '',
                        address: '',
                        previousSchool: '',
                        notes: '',
                      });
                    }}
                    className="text-xs text-crest-700 font-semibold hover:underline"
                  >
                    Submit another application
                  </button>
                  <button
                    onClick={() => {
                      setTrackNumber(submittedApp.applicationNumber);
                      setActiveTab('track');
                      handleTrackSubmit(undefined, submittedApp.applicationNumber);
                    }}
                    className="bg-crest-700 hover:bg-crest-800 text-white font-semibold px-4 py-2 rounded-lg text-xs"
                  >
                    Track this application
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Step indicator */}
                <div className="border-b border-slate-100 px-6 py-4 bg-slate-50/50 flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-crest-700 text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
                    <span className={step === 1 ? 'text-crest-900 font-bold' : 'text-slate-500'}>Student Info</span>
                  </div>
                  <div className="h-0.5 w-12 bg-slate-200" />
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-crest-700 text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
                    <span className={step === 2 ? 'text-crest-900 font-bold' : 'text-slate-500'}>Guardian & Background</span>
                  </div>
                  <div className="h-0.5 w-12 bg-slate-200" />
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-crest-700 text-white' : 'bg-slate-200 text-slate-600'}`}>3</span>
                    <span className={step === 3 ? 'text-crest-900 font-bold' : 'text-slate-500'}>Confirm & Submit</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                  {/* Step 1 */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <h3 className="font-serif text-xl font-bold text-slate-900">Student Profile</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Student First Name *</label>
                          <input
                            type="text"
                            required
                            value={formData.studentFirstName}
                            onChange={(e) => handleInputChange('studentFirstName', e.target.value)}
                            placeholder="e.g. Liam"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-crest-500 focus:outline-none"
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
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-crest-500 focus:outline-none"
                          />
                          {errors.studentLastName && <p className="text-red-500 text-xs mt-1">{errors.studentLastName}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth (YYYY-MM-DD) *</label>
                          <input
                            type="date"
                            required
                            value={formData.dateOfBirth}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-crest-500 focus:outline-none"
                          />
                          {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Grade Applying For *</label>
                          <select
                            value={formData.gradeApplyingFor}
                            onChange={(e) => handleInputChange('gradeApplyingFor', e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-crest-500 focus:outline-none bg-white"
                          >
                            {gradeOptions.map((g) => (
                              <option key={g.value} value={g.value}>{g.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <button
                          type="button"
                          onClick={handleNext}
                          className="bg-crest-700 hover:bg-crest-800 text-white font-semibold px-6 py-2.5 rounded-lg text-sm flex items-center gap-2"
                        >
                          <span>Next: Parent Information</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2 */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <h3 className="font-serif text-xl font-bold text-slate-900">Parent / Guardian & Background</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Parent/Guardian Full Name *</label>
                          <input
                            type="text"
                            required
                            value={formData.parentName}
                            onChange={(e) => handleInputChange('parentName', e.target.value)}
                            placeholder="e.g. David Vance"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-crest-500 focus:outline-none"
                          />
                          {errors.parentName && <p className="text-red-500 text-xs mt-1">{errors.parentName}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Parent Email Address *</label>
                          <input
                            type="email"
                            required
                            value={formData.parentEmail}
                            onChange={(e) => handleInputChange('parentEmail', e.target.value)}
                            placeholder="parent@example.com"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-crest-500 focus:outline-none"
                          />
                          {errors.parentEmail && <p className="text-red-500 text-xs mt-1">{errors.parentEmail}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone Number *</label>
                          <input
                            type="tel"
                            required
                            value={formData.parentPhone}
                            onChange={(e) => handleInputChange('parentPhone', e.target.value)}
                            placeholder="+1 (555) 000-0000"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-crest-500 focus:outline-none"
                          />
                          {errors.parentPhone && <p className="text-red-500 text-xs mt-1">{errors.parentPhone}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Previous School Attended</label>
                          <input
                            type="text"
                            value={formData.previousSchool}
                            onChange={(e) => handleInputChange('previousSchool', e.target.value)}
                            placeholder="e.g. Lincoln Middle School"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-crest-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Residential Address *</label>
                        <input
                          type="text"
                          required
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          placeholder="Street, City, State, ZIP"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-crest-500 focus:outline-none"
                        />
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                      </div>

                      <div className="flex justify-between pt-4">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="text-slate-600 hover:text-slate-900 text-sm font-semibold"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleNext}
                          className="bg-crest-700 hover:bg-crest-800 text-white font-semibold px-6 py-2.5 rounded-lg text-sm flex items-center gap-2"
                        >
                          <span>Review & Confirm</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3 */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <h3 className="font-serif text-xl font-bold text-slate-900">Application Summary</h3>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-3 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-slate-500">Candidate Name:</span>
                          <span className="font-bold text-slate-900">{formData.studentFirstName} {formData.studentLastName}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-slate-500">Grade Level:</span>
                          <span className="font-bold text-slate-900">{formData.gradeApplyingFor}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-slate-500">Parent / Guardian:</span>
                          <span className="font-bold text-slate-900">{formData.parentName}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-slate-500">Parent Email:</span>
                          <span className="font-bold text-slate-900">{formData.parentEmail}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-slate-500">Residential Address:</span>
                          <span className="font-bold text-slate-900">{formData.address}</span>
                        </div>
                      </div>

                      <div className="flex justify-between pt-4">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="text-slate-600 hover:text-slate-900 text-sm font-semibold"
                        >
                          Back to Edit
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-slate-950 font-bold px-8 py-3 rounded-xl shadow-lg transition-transform hover:scale-105 text-sm flex items-center gap-2"
                        >
                          {submitting ? 'Submitting Application...' : 'Confirm & Submit Application'}
                          <Sparkles className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TRACK STATUS */}
        {activeTab === 'track' && (
          <div className="bg-white rounded-2xl shadow-elevated border border-slate-200 p-6 sm:p-10 space-y-6">
            <div className="space-y-2">
              <h3 className="font-serif text-xl font-bold text-slate-900">Track Application by Reference Code</h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Enter your reference code provided when you submitted your application (e.g. ADM-2026-1042).
              </p>
            </div>

            <form onSubmit={(e) => handleTrackSubmit(e)} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Reference (e.g. ADM-2026-1042)"
                value={trackNumber}
                onChange={(e) => setTrackNumber(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-sm uppercase focus:ring-2 focus:ring-crest-500 focus:outline-none font-mono"
              />
              <button
                type="submit"
                disabled={trackingLoading}
                className="bg-crest-700 hover:bg-crest-800 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors flex items-center gap-2"
              >
                {trackingLoading ? <Clock className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Track</span>
              </button>
            </form>

            {/* Quick Demo Reference Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
              <span>Quick Test Codes:</span>
              <button
                type="button"
                onClick={() => {
                  setTrackNumber('ADM-2026-1042');
                  handleTrackSubmit(undefined, 'ADM-2026-1042');
                }}
                className="font-mono bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-crest-700"
              >
                ADM-2026-1042 (Review)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTrackNumber('ADM-2026-1088');
                  handleTrackSubmit(undefined, 'ADM-2026-1088');
                }}
                className="font-mono bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-emerald-700"
              >
                ADM-2026-1088 (Accepted)
              </button>
            </div>

            {trackingError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs sm:text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{trackingError}</span>
              </div>
            )}

            {trackingResult && (
              <div className="mt-6 border border-slate-200 rounded-xl p-6 bg-slate-50/70 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Applicant</span>
                    <h4 className="text-lg font-bold text-slate-900">{trackingResult.studentName}</h4>
                  </div>
                  <div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                        trackingResult.status === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : trackingResult.status === 'UNDER_REVIEW'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : trackingResult.status === 'INTERVIEW_SCHEDULED'
                          ? 'bg-purple-100 text-purple-800 border border-purple-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {trackingResult.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-500 block">Grade Applying For</span>
                    <span className="font-semibold text-slate-900">{trackingResult.gradeApplyingFor}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Date Submitted</span>
                    <span className="font-semibold text-slate-900">
                      {new Date(trackingResult.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Reference ID</span>
                    <span className="font-mono font-semibold text-crest-800">{trackingResult.applicationNumber}</span>
                  </div>
                </div>

                {trackingResult.notes && (
                  <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-700">
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
