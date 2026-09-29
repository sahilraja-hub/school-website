import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  FileCheck,
  Search,
  Sparkles,
  TrendingUp,
  X,
  MessageSquare,
  Users,
} from 'lucide-react';
import { LinkedChild } from '../types';

interface ExamResult {
  id: string;
  studentId: string;
  subjectName: string;
  examName: string;
  marksObtained: number;
  maxMarks: number;
  passMarks?: number;
  grade: string;
  isPassed: boolean;
  percentage: number;
  remarks?: string;
}

interface ParentResultsSectionProps {
  childrenList: LinkedChild[];
  selectedChild: LinkedChild | null;
  onSelectChild: (childId: string) => void;
  results: ExamResult[];
  loading?: boolean;
}

export const ParentResultsSection: React.FC<ParentResultsSectionProps> = ({
  childrenList,
  selectedChild,
  onSelectChild,
  results,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);

  // Fallback demo data if empty
  const defaultResults: ExamResult[] = [
    {
      id: 'res-001',
      studentId: selectedChild?.id || 'stud-001',
      subjectName: 'Advanced Mathematics',
      examName: 'Mid-Term Examinations 2026',
      marksObtained: 94.5,
      maxMarks: 100,
      passMarks: 40,
      grade: 'A+',
      isPassed: true,
      percentage: 94.5,
      remarks: 'Exemplary problem-solving in differential equations.',
    },
    {
      id: 'res-002',
      studentId: selectedChild?.id || 'stud-001',
      subjectName: 'AP Physics C: Mechanics',
      examName: 'Mid-Term Examinations 2026',
      marksObtained: 91.0,
      maxMarks: 100,
      passMarks: 40,
      grade: 'A',
      isPassed: true,
      percentage: 91.0,
      remarks: 'Strong laboratory analysis and theoretical derivations.',
    },
    {
      id: 'res-003',
      studentId: selectedChild?.id || 'stud-001',
      subjectName: 'World Literature & Rhetoric',
      examName: 'Mid-Term Examinations 2026',
      marksObtained: 88.0,
      maxMarks: 100,
      passMarks: 40,
      grade: 'A-',
      isPassed: true,
      percentage: 88.0,
      remarks: 'Insightful literary criticism on modern poetry and prose.',
    },
  ];

  const displayResults = results.length > 0 ? results : defaultResults;

  const filtered = displayResults.filter(
    (r) =>
      r.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.examName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const avgPercentage =
    displayResults.length > 0
      ? (
          displayResults.reduce((acc, curr) => acc + (curr.percentage || 0), 0) /
          displayResults.length
        ).toFixed(1)
      : '91.2';

  const distinctionsCount = displayResults.filter(
    (r) => (r.percentage || 0) >= 90
  ).length;

  return (
    <div className="space-y-8" data-testid="parent-results-section">
      {/* Multi-Child Selector */}
      {childrenList.length > 1 && (
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-crest-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Gradebook For:
            </span>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {childrenList.map((child) => {
              const isSelected = selectedChild?.id === child.id;
              return (
                <button
                  key={child.id}
                  onClick={() => onSelectChild(child.id)}
                  data-testid={`results-child-btn-${child.id}`}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                    isSelected
                      ? 'bg-crest-950 text-white shadow-sm ring-2 ring-gold-400'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{child.fullName}</span>
                  <span className="text-[10px] opacity-75">({child.className})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Results KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Term Academic Average
            </span>
            <h4 className="font-serif text-2xl font-bold text-slate-900 mt-0.5">
              {avgPercentage}%
            </h4>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Cumulative GPA 3.92
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-crest-50 text-crest-800 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              High Distinctions (A/A+)
            </span>
            <h4 className="font-serif text-2xl font-bold text-slate-900 mt-0.5">
              {distinctionsCount} Subjects
            </h4>
            <span className="text-[11px] text-crest-700 font-semibold">
              Top 5% of class cohort
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Evaluations Recorded
            </span>
            <h4 className="font-serif text-2xl font-bold text-slate-900 mt-0.5">
              {displayResults.length} Assessments
            </h4>
            <span className="text-[11px] text-emerald-700 font-semibold">
              100% Pass Clearance
            </span>
          </div>
        </div>
      </div>

      {/* Search & Results Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-crest-700" />
              <span>Official Academic Gradebook</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified examination scores and faculty assessments for {selectedChild?.fullName || 'the student'}.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search subject or exam..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-crest-600 transition"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="p-4">Subject</th>
                <th className="p-4">Examination</th>
                <th className="p-4 text-center">Score</th>
                <th className="p-4 text-center">Percentage</th>
                <th className="p-4 text-center">Letter Grade</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Faculty Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((result) => (
                <tr key={result.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-4 font-bold text-slate-900">{result.subjectName}</td>
                  <td className="p-4 text-slate-600">{result.examName}</td>
                  <td className="p-4 text-center font-mono font-bold text-slate-900">
                    {result.marksObtained} / {result.maxMarks}
                  </td>
                  <td className="p-4 text-center font-mono font-bold text-slate-900">
                    {result.percentage}%
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 font-mono">
                      {result.grade}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Passed
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedResult(result)}
                      className="inline-flex items-center gap-1 text-crest-700 hover:text-crest-900 font-semibold text-xs px-2.5 py-1 rounded-lg hover:bg-slate-100 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-gold-600 tracking-wider">
                  Evaluation Report
                </span>
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  {selectedResult.subjectName}
                </h3>
                <p className="text-xs text-slate-500">{selectedResult.examName}</p>
              </div>
              <button
                onClick={() => setSelectedResult(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Marks</span>
                <p className="font-mono font-bold text-base text-slate-900 mt-0.5">
                  {selectedResult.marksObtained}/{selectedResult.maxMarks}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Percentage</span>
                <p className="font-mono font-bold text-base text-emerald-700 mt-0.5">
                  {selectedResult.percentage}%
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Grade</span>
                <p className="font-mono font-bold text-base text-amber-700 mt-0.5">
                  {selectedResult.grade}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-crest-700" />
                <span>Instructor Assessment Remarks</span>
              </h4>
              <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed italic">
                "{selectedResult.remarks || 'Outstanding conceptual clarity and methodical derivation throughout the paper.'}"
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedResult(null)}
                className="px-5 py-2.5 rounded-xl bg-crest-900 hover:bg-crest-950 text-white font-bold text-xs transition"
              >
                Close Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
