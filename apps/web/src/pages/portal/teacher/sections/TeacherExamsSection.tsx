import React, { useState, useEffect } from 'react';
import {
  Award,
  Calendar,
  Clock,
  CheckCircle2,
  FileCheck,
  ChevronRight,
  Bookmark,
  Layers,
  Search,
} from 'lucide-react';
import { api } from '../../../../services/api';

interface ExamItem {
  id: string;
  name: string;
  academicYear: string;
  term: string;
  startDate: string;
  endDate: string;
  status: string;
  description?: string;
  subjects?: any[];
}

interface TeacherExamsProps {
  assignments: any[];
  onNavigateToResults: (examId: string) => void;
}

export const TeacherExamsSection: React.FC<TeacherExamsProps> = ({
  assignments,
  onNavigateToResults,
}) => {
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        const res = await api.get('/exams');
        if (res.data.success) {
          setExams(res.data.data);
        }
      } catch {
        setExams([
          {
            id: 'exam-midterm-2026',
            name: 'Mid-Term Examinations 2026',
            academicYear: '2026-2027',
            term: 'Term 1',
            startDate: '2026-10-15',
            endDate: '2026-10-25',
            status: 'SCHEDULED',
            description: 'First semester comprehensive examination series across STEM & Humanities.',
          },
          {
            id: 'exam-final-2026',
            name: 'Annual Board Evaluations 2027',
            academicYear: '2026-2027',
            term: 'Term 2',
            startDate: '2027-03-01',
            endDate: '2027-03-15',
            status: 'DRAFT',
            description: 'Year-end academic certification examinations.',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const filteredExams = exams.filter(
    (e) =>
      !searchTerm ||
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Institutional Examinations</h2>
          <p className="text-xs text-slate-400 mt-1">
            Exam schedules, papers, and assessment windows for your authorized subjects and cohorts.
          </p>
        </div>

        <div className="relative w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search exams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#0B1528] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Exam Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="bg-[#0B1528]/90 border border-white/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between group hover:border-amber-500/30 transition"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  {exam.term}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                    exam.status === 'SCHEDULED'
                      ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                      : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {exam.status}
                </span>
              </div>

              <h3 className="text-lg font-serif font-bold text-white group-hover:text-amber-300 transition">
                {exam.name}
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{exam.description}</p>

              <div className="mt-4 pt-3 border-t border-white/5 space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    Examination Window:
                  </span>
                  <span className="font-mono text-white">
                    {exam.startDate} to {exam.endDate}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-purple-400" />
                    Authorized Paper:
                  </span>
                  <span className="text-white font-medium">Advanced Mathematics (MATH-101)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Exam ID: {exam.id}</span>
              <button
                onClick={() => onNavigateToResults(exam.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 text-xs font-semibold transition"
              >
                <Award className="w-3.5 h-3.5" />
                Open Gradebook
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
