import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Upload,
  ExternalLink,
  X,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { api } from '../../../../services/api';

interface StudentHomeworkSectionProps {
  homework: any[];
  onRefresh?: () => void;
  loading?: boolean;
}

export const StudentHomeworkSection: React.FC<StudentHomeworkSectionProps> = ({
  homework,
  onRefresh,
  loading,
}) => {
  const [selectedHw, setSelectedHw] = useState<any | null>(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'SUBMITTED'>('ALL');

  // Fallback demo data if empty
  const displayHomework =
    homework.length > 0
      ? homework
      : [
          {
            id: 'hw-001',
            title: 'Problem Set 4: Differential Calculus',
            subjectName: 'Advanced Mathematics',
            dueDate: '2026-10-18',
            totalMarks: 20,
            description:
              'Solve questions 1-15 on Page 142 of Advanced Mathematics textbook. Graph solutions for questions 8, 12, and 15.',
            attachmentUrl: 'https://docs.oakridge.edu/assignments/calc-pset4.pdf',
            mySubmission: {
              content: 'All 15 problems solved step-by-step with graphical plots included.',
              submittedAt: '2026-10-12T10:00:00Z',
              status: 'SUBMITTED',
            },
          },
          {
            id: 'hw-002',
            title: 'Laboratory Report: Simple Harmonic Motion & Pendulums',
            subjectName: 'AP Physics C: Mechanics',
            dueDate: '2026-10-22',
            totalMarks: 30,
            description:
              'Complete the experimental uncertainty table and submit error propagation calculations based on Friday’s lab session.',
            attachmentUrl: 'https://docs.oakridge.edu/assignments/physics-lab-template.docx',
            mySubmission: null,
          },
        ];

  const filteredHomework = displayHomework.filter((hw) => {
    const isSubmitted = !!hw.mySubmission || (hw.submissionsCount && hw.submissionsCount > 0);
    if (filter === 'PENDING') return !isSubmitted;
    if (filter === 'SUBMITTED') return isSubmitted;
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHw) return;
    if (!submissionContent.trim()) {
      setSubmitError('Please provide your solution content or summary notes');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await api.post(`/homework/${selectedHw.id}/submit`, {
        content: submissionContent,
        attachmentUrl: attachmentUrl || undefined,
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setSelectedHw(null);
        setSubmissionContent('');
        setAttachmentUrl('');
        if (onRefresh) onRefresh();
      }, 1500);
    } catch (err: any) {
      setSubmitError(
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to submit assignment. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn" data-testid="student-homework-section">
      {/* Header and Filter */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-crest-700" />
            Assigned Coursework & Projects
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Submit coursework and review faculty evaluations
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {(['ALL', 'PENDING', 'SUBMITTED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                filter === tab
                  ? 'bg-crest-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Homework Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredHomework.length > 0 ? (
          filteredHomework.map((hw, idx) => {
            const isSubmitted = !!hw.mySubmission || (hw.submissionsCount && hw.submissionsCount > 0);

            return (
              <div
                key={hw.id || idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-crest-800 bg-crest-50 px-2.5 py-0.5 rounded">
                      {hw.subjectName || 'Coursework'}
                    </span>
                    {isSubmitted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> SUBMITTED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                        <Clock className="w-3.5 h-3.5" /> PENDING
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-lg font-bold text-slate-900 leading-snug">
                    {hw.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {hw.description}
                  </p>

                  {hw.attachmentUrl && (
                    <a
                      href={hw.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-crest-700 hover:text-crest-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl transition"
                    >
                      <FileText className="w-3.5 h-3.5" /> Reference Material
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500 space-y-0.5">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Due: <strong className="text-slate-800">{hw.dueDate}</strong></span>
                    </div>
                    <div>Marks: <strong className="text-slate-800">{hw.totalMarks} pts</strong></div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedHw(hw);
                      setSubmissionContent(hw.mySubmission?.content || '');
                      setAttachmentUrl(hw.mySubmission?.attachmentUrl || '');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                      isSubmitted
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-crest-900 text-white hover:bg-crest-950 shadow-sm'
                    }`}
                  >
                    {isSubmitted ? 'View Submission' : 'Submit Assignment'}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs sm:text-sm">
            No coursework found matching the "{filter}" filter.
          </div>
        )}
      </div>

      {/* Submission Modal */}
      {selectedHw && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-crest-700 bg-crest-50 px-2 py-0.5 rounded">
                  {selectedHw.subjectName}
                </span>
                <h3 className="font-serif text-xl font-bold text-slate-900 mt-1">
                  {selectedHw.title}
                </h3>
                <p className="text-xs text-slate-400">Due: {selectedHw.dueDate} • Total: {selectedHw.totalMarks} Marks</p>
              </div>
              <button
                onClick={() => setSelectedHw(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-serif text-lg font-bold text-slate-900">Submission Recorded</h4>
                <p className="text-xs text-slate-500">Your assignment has been securely uploaded for evaluation.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {submitError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Solution Content & Notes <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={submissionContent}
                    onChange={(e) => setSubmissionContent(e.target.value)}
                    placeholder="Enter your detailed derivation, answers, or solution summary..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-crest-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Document Attachment URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={attachmentUrl}
                    onChange={(e) => setAttachmentUrl(e.target.value)}
                    placeholder="https://docs.google.com/... or cloud PDF URL"
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-crest-600 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Upload your document to cloud storage (Google Drive, OneDrive) and paste the link here.
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setSelectedHw(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 rounded-xl bg-crest-900 text-white font-semibold text-xs hover:bg-crest-950 transition flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Confirm Submission'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
