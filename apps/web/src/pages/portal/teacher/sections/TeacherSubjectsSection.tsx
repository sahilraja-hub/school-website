import React from 'react';
import {
  BookOpen,
  Award,
  FileText,
  Clock,
  CheckCircle2,
  Bookmark,
  Layers,
  Sparkles,
} from 'lucide-react';

interface TeacherSubjectsProps {
  assignments: any[];
  onNavigateToHomework: (subjectId: string) => void;
  onNavigateToResults: (subjectId: string) => void;
}

export const TeacherSubjectsSection: React.FC<TeacherSubjectsProps> = ({
  assignments,
  onNavigateToHomework,
  onNavigateToResults,
}) => {
  // Deduplicate subjects from assignments
  const subjectsMap = new Map<string, any>();
  assignments.forEach((a) => {
    if (a.subjectId && !subjectsMap.has(a.subjectId)) {
      subjectsMap.set(a.subjectId, {
        id: a.subjectId,
        name: a.subjectName || 'Advanced Mathematics',
        code: a.subjectCode || 'MATH-101',
        description: 'Advanced calculus, limits, analytical geometry, and multivariable functions.',
        credits: 4,
        isElective: false,
        sections: [a.sectionName || 'Section A'],
      });
    } else if (a.subjectId && subjectsMap.has(a.subjectId)) {
      const existing = subjectsMap.get(a.subjectId);
      if (a.sectionName && !existing.sections.includes(a.sectionName)) {
        existing.sections.push(a.sectionName);
      }
    }
  });

  const subjects = Array.from(subjectsMap.values());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Assigned Academic Subjects</h2>
          <p className="text-xs text-slate-400 mt-1">
            Curriculum subjects and syllabi under your instructional authorization for this academic year.
          </p>
        </div>
        <span className="self-start px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400">
          {subjects.length} Authorized Subjects
        </span>
      </div>

      {/* Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((sub, idx) => (
          <div
            key={sub.id || idx}
            className="bg-[#0B1528]/90 border border-white/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs">
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-400 block">{sub.code}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      {sub.isElective ? 'Elective Course' : 'Core Curriculum'}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-white">
                  {sub.credits} Credits
                </span>
              </div>

              <h3 className="text-lg font-serif font-bold text-white">{sub.name}</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{sub.description}</p>

              <div className="mt-4 pt-4 border-t border-white/5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                  Assigned Student Cohorts:
                </span>
                <div className="flex flex-wrap gap-2">
                  {sub.sections.map((secName: string, sIdx: number) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-slate-200"
                    >
                      Grade 10 • {secName}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3">
              <button
                onClick={() => onNavigateToHomework(sub.id)}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                Assign Homework
              </button>
              <button
                onClick={() => onNavigateToResults(sub.id)}
                className="flex-1 py-2 px-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5" />
                Gradebook
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
