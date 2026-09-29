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
} from 'lucide-react';
import { api } from '../../../../services/api';

interface StudentResultsSectionProps {
  results: any[];
  loading?: boolean;
}

export const StudentResultsSection: React.FC<StudentResultsSectionProps> = ({
  results,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResult, setSelectedResult] = useState<any | null>(null);

  // Fallback demo data if backend hasn't populated yet
  const displayResults =
    results.length > 0
      ? results
      : [
          {
            id: 'res-001',
            subjectName: 'Advanced Mathematics',
            examName: 'Mid-Term Examinations 2026',
            marksObtained: 94.5,
            maxMarks: 100,
            passMarks: 40,
            grade: 'A+',
            isPassed: true,
            percentage: 94.5,
            remarks: 'Exemplary problem-solving in calculus section.',
          },
          {
            id: 'res-002',
            subjectName: 'AP Physics C: Mechanics',
            examName: 'Mid-Term Examinations 2026',
            marksObtained: 91.0,
            maxMarks: 100,
            passMarks: 40,
            grade: 'A',
            isPassed: true,
            percentage: 91.0,
            remarks: 'Excellent experimental error calculation and derivations.',
          },
          {
            id: 'res-003',
            subjectName: 'World Literature & Rhetoric',
            examName: 'Mid-Term Examinations 2026',
            marksObtained: 88.0,
            maxMarks: 100,
            passMarks: 40,
            grade: 'A-',
            isPassed: true,
            percentage: 88.0,
            remarks: 'Insightful literary analysis on modern poetry.',
          },
        ];

  const filtered = displayResults.filter((r) =>
    (r.subjectName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.examName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const avgPercentage =
    displayResults.length > 0
      ? Math.round(
          displayResults.reduce(
            (acc, r) => acc + (r.percentage || (r.marksObtained / (r.maxMarks || 100)) * 100),
            0
          ) / displayResults.length
        )
      : 94;

  const passedCount = displayResults.filter((r) => r.isPassed !== false).length;

  return (
    <div className="space-y-8 animate-fadeIn" data-testid="student-results-section">
      {/* Grade Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cumulative Average</span>
            <TrendingUp className="w-5 h-5 text-crest-700" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{avgPercentage}%</span>
            <span className="text-xs font-bold text-crest-700 bg-crest-100 px-2 py-0.5 rounded">
              {avgPercentage >= 90 ? 'Grade A+' : 'Grade A'}
            </span>
          </div>
          <p className="text-xs text-slate-500">Across {displayResults.length} evaluated courses</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Honor Standing</span>
            <Sparkles className="w-5 h-5 text-gold-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">Dean’s List</span>
          </div>
          <p className="text-xs text-emerald-600 font-semibold">High Distinction Scholar</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Subjects Cleared</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {passedCount} / {displayResults.length}
            </span>
          </div>
          <p className="text-xs text-slate-500">100% Pass Rate</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Academic Year</span>
            <Award className="w-5 h-5 text-crest-800" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">2026–2027</span>
          </div>
          <p className="text-xs text-slate-500">Semester 1 Examination Cycle</p>
        </div>
      </div>

      {/* Results Table & Gradebook */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-crest-700" />
              Academic Gradebook & Examination Results
            </h3>
            <p className="text-xs text-slate-500">Verified official evaluation by department faculty</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search subjects or exams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-crest-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-6">Subject</th>
                <th className="py-3 px-6">Exam Series</th>
                <th className="py-3 px-6">Marks Obtained</th>
                <th className="py-3 px-6">Percentage</th>
                <th className="py-3 px-6">Grade</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Faculty Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((r, idx) => {
                  const perc = r.percentage ?? Math.round((r.marksObtained / (r.maxMarks || 100)) * 100);
                  const isPass = r.isPassed !== false;
                  return (
                    <tr
                      key={r.id || idx}
                      onClick={() => setSelectedResult(r)}
                      className="hover:bg-slate-50/80 transition cursor-pointer"
                    >
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {r.subjectName || 'Course'}
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {r.examName || 'Mid-Term Examination'}
                      </td>
                      <td className="py-4 px-6 font-mono font-semibold text-slate-800">
                        {r.marksObtained} / {r.maxMarks || 100}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {perc}%
                      </td>
                      <td className="py-4 px-6">
                        <span className="w-8 h-8 rounded-lg bg-crest-100 text-crest-800 font-bold text-xs flex items-center justify-center">
                          {r.grade || 'A'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isPass ? 'PASSED' : 'RETAKE'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-500 italic max-w-xs truncate">
                        {r.remarks || 'Satisfactory work on all sections.'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No results found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Result Detail Modal */}
      {selectedResult && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-crest-700 bg-crest-50 px-2.5 py-0.5 rounded">
                  {selectedResult.examName || 'Examination Assessment'}
                </span>
                <h3 className="font-serif text-2xl font-bold text-slate-900 mt-1">
                  {selectedResult.subjectName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedResult(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Marks Obtained</span>
                <span className="text-2xl font-bold font-mono text-slate-900">
                  {selectedResult.marksObtained}
                </span>
                <span className="text-xs text-slate-400"> / {selectedResult.maxMarks || 100} maximum</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Percentage & Grade</span>
                <span className="text-2xl font-bold text-crest-800">
                  {selectedResult.percentage ?? Math.round((selectedResult.marksObtained / (selectedResult.maxMarks || 100)) * 100)}%
                </span>
                <span className="text-xs font-bold text-gold-600 ml-1">({selectedResult.grade || 'A'})</span>
              </div>
            </div>

            {selectedResult.remarks && (
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs sm:text-sm text-amber-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <MessageSquare className="w-4 h-4" /> Faculty Remarks:
                </div>
                <p className="italic">"{selectedResult.remarks}"</p>
              </div>
            )}

            <button
              onClick={() => setSelectedResult(null)}
              className="w-full py-2.5 rounded-xl bg-crest-900 text-white font-semibold text-xs hover:bg-crest-950 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
