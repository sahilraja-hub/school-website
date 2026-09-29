import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Search,
  Sparkles,
  Paperclip,
  Users,
} from 'lucide-react';
import { LinkedChild } from '../types';

interface HomeworkItem {
  id: string;
  title: string;
  description: string;
  subjectName?: string;
  dueDate: string;
  assignedDate?: string;
  maxPoints?: number;
  attachmentUrl?: string;
  submissions?: Array<{
    id: string;
    studentId: string;
    status: 'SUBMITTED' | 'GRADED' | 'LATE';
    submittedAt?: string;
    grade?: string | number;
    remarks?: string;
  }>;
}

interface ParentHomeworkSectionProps {
  childrenList: LinkedChild[];
  selectedChild: LinkedChild | null;
  onSelectChild: (childId: string) => void;
  homework: HomeworkItem[];
  loading?: boolean;
}

export const ParentHomeworkSection: React.FC<ParentHomeworkSectionProps> = ({
  childrenList,
  selectedChild,
  onSelectChild,
  homework,
  loading,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'SUBMITTED' | 'GRADED'>('ALL');
  const [search, setSearch] = useState('');

  // Fallback demo coursework if none returned
  const defaultHomework: HomeworkItem[] = [
    {
      id: 'hw-01',
      title: 'Thermodynamics Problem Set 4',
      description: 'Solve questions 1-12 on heat engines and entropy changes in closed systems.',
      subjectName: 'AP Physics C',
      assignedDate: '2026-10-08',
      dueDate: '2026-10-16',
      maxPoints: 100,
      submissions: [
        {
          id: 'sub-01',
          studentId: selectedChild?.id || 'stud-001',
          status: 'GRADED',
          submittedAt: '2026-10-10',
          grade: '98/100',
          remarks: 'Thorough step-by-step thermodynamic cycles derivations.',
        },
      ],
    },
    {
      id: 'hw-02',
      title: 'Calculus BC: Taylor Series Polynomials',
      description: 'Complete convergence tests and radius of convergence exercises from Chapter 9.',
      subjectName: 'Advanced Mathematics',
      assignedDate: '2026-10-10',
      dueDate: '2026-10-18',
      maxPoints: 50,
      submissions: [
        {
          id: 'sub-02',
          studentId: selectedChild?.id || 'stud-001',
          status: 'SUBMITTED',
          submittedAt: '2026-10-12',
          remarks: 'Under grading review by Dr. Robert Chen.',
        },
      ],
    },
    {
      id: 'hw-03',
      title: 'World Literature: Modernist Poetry Critique',
      description: 'Draft an 800-word analytical essay exploring thematic imagery in T.S. Eliot.',
      subjectName: 'World Literature',
      assignedDate: '2026-10-12',
      dueDate: '2026-10-22',
      maxPoints: 100,
      submissions: [],
    },
  ];

  const displayHomework = homework.length > 0 ? homework : defaultHomework;

  const getChildSubmission = (hw: HomeworkItem) => {
    return hw.submissions?.find((s) => s.studentId === selectedChild?.id);
  };

  const filteredHomework = displayHomework.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.subjectName || '').toLowerCase().includes(search.toLowerCase());

    const sub = getChildSubmission(item);

    if (filter === 'ALL') return matchesSearch;
    if (filter === 'PENDING') return matchesSearch && !sub;
    if (filter === 'SUBMITTED') return matchesSearch && sub && sub.status === 'SUBMITTED';
    if (filter === 'GRADED') return matchesSearch && sub && sub.status === 'GRADED';
    return matchesSearch;
  });

  return (
    <div className="space-y-8" data-testid="parent-homework-section">
      {/* Multi-Child Selector */}
      {childrenList.length > 1 && (
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-crest-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Coursework For:
            </span>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {childrenList.map((child) => {
              const isSelected = selectedChild?.id === child.id;
              return (
                <button
                  key={child.id}
                  onClick={() => onSelectChild(child.id)}
                  data-testid={`homework-child-btn-${child.id}`}
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

      {/* Header and Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-crest-700" /> Coursework & Homework Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor active syllabus tasks, project deadlines, and evaluated scores for {selectedChild?.fullName || 'the student'}.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search homework..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-56 pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-crest-600 transition"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['ALL', 'PENDING', 'SUBMITTED', 'GRADED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  filter === tab
                    ? 'bg-white text-crest-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Homework Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredHomework.length > 0 ? (
          filteredHomework.map((hw) => {
            const sub = getChildSubmission(hw);
            const isSubmitted = !!sub;
            const isGraded = sub?.status === 'GRADED';

            return (
              <div
                key={hw.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-crest-300 transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex justify-between items-start gap-3">
                    <span className="text-[10px] uppercase font-bold text-crest-700 bg-crest-50 px-2 py-0.5 rounded border border-crest-100">
                      {hw.subjectName || 'General Academic'}
                    </span>

                    {isGraded ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Graded ({sub?.grade})
                      </span>
                    ) : isSubmitted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                        <Clock className="w-3 h-3" /> Submitted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        <Clock className="w-3 h-3" /> Pending Submission
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-base text-slate-900 mt-2">
                    {hw.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {hw.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-crest-700" />
                      <span>Due: {new Date(hw.dueDate).toLocaleDateString()}</span>
                    </span>
                    <span className="font-semibold text-slate-700">
                      {hw.maxPoints ? `${hw.maxPoints} Points` : 'Evaluated'}
                    </span>
                  </div>

                  {sub?.remarks && (
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-600 text-[11px] italic">
                      <span className="font-bold not-italic text-slate-800">Faculty Feedback: </span>
                      "{sub.remarks}"
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            No coursework items found matching your current filter.
          </div>
        )}
      </div>
    </div>
  );
};
