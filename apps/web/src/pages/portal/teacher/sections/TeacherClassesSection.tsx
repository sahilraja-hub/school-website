import React from 'react';
import {
  Users,
  DoorOpen,
  BookOpen,
  Calendar,
  ClipboardCheck,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface TeacherClassesProps {
  assignments: any[];
  onSelectClassForAttendance: (classId: string, sectionId: string) => void;
  onSelectClassForStudents: (sectionId: string) => void;
}

export const TeacherClassesSection: React.FC<TeacherClassesProps> = ({
  assignments,
  onSelectClassForAttendance,
  onSelectClassForStudents,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Assigned Classes & Cohorts</h2>
          <p className="text-xs text-slate-400 mt-1">
            Classes and sections where you are officially designated as instructor or class supervisor.
          </p>
        </div>
        <span className="self-start px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400">
          {assignments.length} Assigned Sections
        </span>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assignments.map((item, idx) => (
          <div
            key={item.id || idx}
            className="bg-[#0B1528]/90 border border-white/10 hover:border-amber-400/40 rounded-2xl p-6 transition flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  {item.gradeLevel || 'GRADE_10'}
                </span>
                {item.isPrimaryTeacher ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <ShieldCheck className="w-3 h-3" />
                    Class Teacher
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">Subject Faculty</span>
                )}
              </div>

              <h3 className="text-lg font-serif font-bold text-white group-hover:text-amber-300 transition">
                {item.className || 'Grade 10'} • {item.sectionName || 'Section A'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Subject: <span className="text-slate-200 font-medium">{item.subjectName || 'Advanced Mathematics'}</span>
              </p>

              <div className="mt-4 pt-4 border-t border-white/5 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <DoorOpen className="w-3.5 h-3.5 text-slate-500" />
                    Lecture Room:
                  </span>
                  <span className="font-mono text-white">{item.roomNumber || 'Room 301'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Academic Term:
                  </span>
                  <span className="text-white">{item.academicYear || '2026-2027'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    Roster Size:
                  </span>
                  <span className="text-white">35 Students (Capacity)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2">
              <button
                onClick={() => onSelectClassForAttendance(item.classId || 'cls-10', item.sectionId || 'sec-10a')}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                Attendance
              </button>
              <button
                onClick={() => onSelectClassForStudents(item.sectionId || 'sec-10a')}
                className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-medium transition flex items-center justify-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                Students
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
