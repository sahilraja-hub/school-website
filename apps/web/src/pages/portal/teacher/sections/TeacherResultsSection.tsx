import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Save,
  ShieldCheck,
  Search,
  Filter,
  Layers,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { api } from '../../../../services/api';

interface GradeRow {
  studentId: string;
  studentName: string;
  rollNumber: string;
  admissionNumber: string;
  marksObtained: number | string;
  maxMarks: number;
  passMarks: number;
  grade: string;
  remarks: string;
  isSaved?: boolean;
}

interface TeacherResultsProps {
  assignments: any[];
  students: any[];
  preselectedExamId?: string;
}

export const TeacherResultsSection: React.FC<TeacherResultsProps> = ({
  assignments,
  students,
  preselectedExamId,
}) => {
  // Authorized Exam Papers
  const authorizedExamSubjects = [
    {
      id: 'es-math-101',
      examId: 'exam-midterm-2026',
      examName: 'Mid-Term Examinations 2026',
      subjectId: 'sub-math',
      subjectName: 'Advanced Mathematics',
      sectionId: 'sec-10a',
      sectionName: 'Grade 10-A',
      maxMarks: 100,
      passMarks: 40,
    },
    {
      id: 'es-math-102',
      examId: 'exam-midterm-2026',
      examName: 'Mid-Term Examinations 2026',
      subjectId: 'sub-math',
      subjectName: 'Advanced Mathematics',
      sectionId: 'sec-10b',
      sectionName: 'Grade 10-B',
      maxMarks: 100,
      passMarks: 40,
    },
  ];

  const [selectedExamSubjectId, setSelectedExamSubjectId] = useState(
    authorizedExamSubjects[0].id
  );

  const activeExamSubject =
    authorizedExamSubjects.find((es) => es.id === selectedExamSubjectId) ||
    authorizedExamSubjects[0];

  const [gradeRows, setGradeRows] = useState<GradeRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);

  // Compute Letter Grade helper
  const calculateGrade = (marks: number, max: number): string => {
    const pct = (marks / max) * 100;
    if (pct >= 90) return 'A+';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B';
    if (pct >= 60) return 'C';
    if (pct >= 50) return 'D';
    return 'F';
  };

  // Populate grade rows for selected section
  useEffect(() => {
    // Filter students by section of the active exam subject
    const sectionStudents = students.filter(
      (s) => s.sectionId === activeExamSubject.sectionId
    );

    if (sectionStudents.length > 0) {
      setGradeRows(
        sectionStudents.map((st, idx) => ({
          studentId: st.id,
          studentName: st.user
            ? `${st.user.firstName} ${st.user.lastName}`
            : `Student ${idx + 1}`,
          rollNumber: st.rollNumber || `10-A-${(idx + 1).toString().padStart(2, '0')}`,
          admissionNumber: st.admissionNumber || `ADM-2026-008${idx}`,
          marksObtained: idx === 0 ? 94.5 : 85,
          maxMarks: activeExamSubject.maxMarks,
          passMarks: activeExamSubject.passMarks,
          grade: idx === 0 ? 'A+' : 'A',
          remarks: idx === 0 ? 'Exemplary problem-solving in calculus section.' : '',
          isSaved: idx === 0,
        }))
      );
    } else {
      setGradeRows([
        {
          studentId: 'stud-001',
          studentName: 'Liam Vance',
          rollNumber: '10-A-01',
          admissionNumber: 'ADM-2026-0089',
          marksObtained: 94.5,
          maxMarks: activeExamSubject.maxMarks,
          passMarks: activeExamSubject.passMarks,
          grade: 'A+',
          remarks: 'Exemplary problem-solving in calculus section.',
          isSaved: true,
        },
        {
          studentId: 'stud-002',
          studentName: 'Emma Watson',
          rollNumber: '10-A-02',
          admissionNumber: 'ADM-2026-0090',
          marksObtained: 88,
          maxMarks: activeExamSubject.maxMarks,
          passMarks: activeExamSubject.passMarks,
          grade: 'A',
          remarks: 'Strong analytical reasoning.',
          isSaved: false,
        },
        {
          studentId: 'stud-003',
          studentName: 'Noah Clark',
          rollNumber: '10-A-03',
          admissionNumber: 'ADM-2026-0091',
          marksObtained: 72,
          maxMarks: activeExamSubject.maxMarks,
          passMarks: activeExamSubject.passMarks,
          grade: 'B',
          remarks: 'Needs review on trigonometric integrals.',
          isSaved: false,
        },
      ]);
    }
  }, [selectedExamSubjectId, students]);

  const handleMarksChange = (idx: number, val: string) => {
    const num = parseFloat(val);
    const marks = isNaN(num) ? 0 : Math.min(activeExamSubject.maxMarks, Math.max(0, num));
    const grade = calculateGrade(marks, activeExamSubject.maxMarks);

    setGradeRows((prev) => {
      const next = [...prev];
      next[idx] = {
        ...next[idx],
        marksObtained: val === '' ? '' : marks,
        grade,
        isSaved: false,
      };
      return next;
    });
  };

  const handleRemarksChange = (idx: number, val: string) => {
    setGradeRows((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], remarks: val, isSaved: false };
      return next;
    });
  };

  const handleSaveSingleGrade = async (idx: number) => {
    setSavingIndex(idx);
    setErrorMessage(null);
    const row = gradeRows[idx];

    try {
      const marks = typeof row.marksObtained === 'number' ? row.marksObtained : parseFloat(row.marksObtained as string) || 0;
      await api.post('/results', {
        examSubjectId: activeExamSubject.id,
        studentId: row.studentId,
        marksObtained: marks,
        grade: row.grade,
        remarks: row.remarks || undefined,
      });

      setGradeRows((prev) => {
        const next = [...prev];
        next[idx] = { ...next[idx], isSaved: true };
        return next;
      });

      setSuccessMessage(`Grade recorded for ${row.studentName} (${row.grade} • ${marks}/${activeExamSubject.maxMarks}).`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      const msg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Authorization Error: Teacher can only manage results for authorized subjects/classes.';
      setErrorMessage(msg);
    } finally {
      setSavingIndex(null);
    }
  };

  const handleSaveAllGrades = async () => {
    setErrorMessage(null);
    let successCount = 0;

    for (let i = 0; i < gradeRows.length; i++) {
      const row = gradeRows[i];
      try {
        const marks = typeof row.marksObtained === 'number' ? row.marksObtained : parseFloat(row.marksObtained as string) || 0;
        await api.post('/results', {
          examSubjectId: activeExamSubject.id,
          studentId: row.studentId,
          marksObtained: marks,
          grade: row.grade,
          remarks: row.remarks || undefined,
        });
        successCount++;
      } catch (err: any) {
        setErrorMessage(
          err.response?.data?.error?.message ||
          'Failed to record some grades. RBAC authorization enforced.'
        );
        break;
      }
    }

    if (successCount > 0) {
      setGradeRows((prev) => prev.map((r) => ({ ...r, isSaved: true })));
      setSuccessMessage(`Successfully saved ${successCount} student grades.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const filteredRows = gradeRows.filter(
    (r) =>
      !searchTerm ||
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header and Authorization Notice */}
      <div className="bg-[#0B1528]/90 border border-white/10 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Authorized Gradebook Access Only
            </div>
            <h2 className="text-xl font-serif font-bold text-white">Examinations & Result Management</h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter official marks and qualitative remarks for your authorized subject assignments. Unauthorized classes are restricted by RBAC.
            </p>
          </div>

          <button
            onClick={handleSaveAllGrades}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold text-xs hover:from-purple-400 hover:to-purple-500 transition shadow-lg shadow-purple-500/20"
          >
            <Save className="w-4 h-4" />
            Commit All Grades
          </button>
        </div>

        {/* Paper Selector & Meta Bar */}
        <div className="pt-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Authorized Subject Paper
              </label>
              <select
                value={selectedExamSubjectId}
                onChange={(e) => setSelectedExamSubjectId(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-[#0F1E36] border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-amber-400"
              >
                {authorizedExamSubjects.map((es) => (
                  <option key={es.id} value={es.id}>
                    {es.examName} • {es.subjectName} ({es.sectionName})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-6 flex items-center gap-3 text-xs text-slate-300">
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                Max Marks: <strong className="font-mono text-white">{activeExamSubject.maxMarks}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                Pass Marks: <strong className="font-mono text-amber-300">{activeExamSubject.passMarks}</strong>
              </span>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-64 pt-5">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search student..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#0F1E36] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Error and Success Banners */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-3 animate-shake">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Grade Entry Table */}
      <div className="bg-[#0B1528]/90 border border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Roll</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Marks Obtained (/{activeExamSubject.maxMarks})</th>
                <th className="py-3.5 px-4">Percentage</th>
                <th className="py-3.5 px-4">Grade</th>
                <th className="py-3.5 px-4">Result</th>
                <th className="py-3.5 px-4">Teacher Evaluation Remarks</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-slate-300">
              {filteredRows.map((row, idx) => {
                const marks = typeof row.marksObtained === 'number' ? row.marksObtained : parseFloat(row.marksObtained as string) || 0;
                const pct = Math.round((marks / activeExamSubject.maxMarks) * 100);
                const isPassed = marks >= activeExamSubject.passMarks;

                return (
                  <tr key={row.studentId} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4 font-mono font-medium text-amber-300">
                      {row.rollNumber}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-white block">{row.studentName}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{row.admissionNumber}</span>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="0"
                        max={activeExamSubject.maxMarks}
                        step="0.5"
                        value={row.marksObtained}
                        onChange={(e) => handleMarksChange(idx, e.target.value)}
                        className="w-24 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white font-mono font-bold text-center focus:outline-none focus:border-purple-400"
                      />
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-white">
                      {pct}%
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold font-mono bg-purple-500/10 border border-purple-500/20 text-purple-300">
                        {row.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          isPassed
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {isPassed ? 'PASS' : 'FAIL'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        placeholder="Evaluation feedback..."
                        value={row.remarks}
                        onChange={(e) => handleRemarksChange(idx, e.target.value)}
                        className="w-full max-w-xs px-3 py-1.5 rounded-lg bg-black/30 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-400"
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleSaveSingleGrade(idx)}
                        disabled={savingIndex === idx}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1 ${
                          row.isSaved
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-purple-600 hover:bg-purple-500 text-white shadow-sm'
                        }`}
                      >
                        {savingIndex === idx ? (
                          'Saving...'
                        ) : row.isSaved ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            Saved
                          </>
                        ) : (
                          'Save'
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
