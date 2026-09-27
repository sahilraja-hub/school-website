import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [gradesData, setGradesData] = useState<any>({
    summary: {
      overallPercentage: 96,
      totalGradedAssignments: 2,
      totalPointsEarned: 144,
      totalPointsPossible: 150,
    },
    records: [
      {
        assignmentTitle: 'Lab Report: Two-Dimensional Kinematics & Ballistics',
        className: 'AP Physics C: Mechanics',
        classCode: 'PHY-401',
        pointsEarned: 96,
        maxPoints: 100,
        letterGrade: 'A',
        feedback: 'Exceptional error analysis and mathematical modeling!',
        dueDate: '2026-10-05',
      },
      {
        assignmentTitle: 'Taylor Series & Convergence Test Assessment',
        className: 'AP Calculus BC',
        classCode: 'MTH-402',
        pointsEarned: 48,
        maxPoints: 50,
        letterGrade: 'A',
        feedback: 'Flawless proof on problem 4.',
        dueDate: '2026-10-12',
      },
    ],
  });

  const [attendance, setAttendance] = useState<any>({
    attendanceRate: 98,
    totalDays: 45,
    presentCount: 44,
    lateCount: 1,
    absentCount: 0,
  });

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await api.get('/grades/student');
        if (res.data.success && res.data.data.records?.length > 0) {
          setGradesData(res.data.data);
        }
      } catch {
        // Fallback to demo data
      }
    };
    fetchGrades();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Student Profile Banner */}
        <div className="bg-gradient-to-r from-crest-950 via-crest-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80'}
              alt={user?.firstName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-crest-400/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-gold-500/20 text-gold-400 font-bold px-2 py-0.5 rounded text-[10px] border border-gold-500/30">
                  {user?.gradeLevel || 'GRADE 11'}
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {user?.studentId || 'OAK-882190'}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-xs text-slate-300">Oakridge Scholar Portal • Academic Year 2026-2027</p>
            </div>
          </div>

          {/* Quick GPA & Standing */}
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-3 rounded-xl backdrop-blur-md">
            <div className="text-center px-3">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Weighted GPA</span>
              <span className="font-serif text-2xl font-bold text-gold-400">3.96</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center px-3">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Class Rank</span>
              <span className="font-serif text-2xl font-bold text-white">Top 3%</span>
            </div>
          </div>
        </div>

        {/* Attendance & Performance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Attendance Gauge */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold uppercase text-slate-500">Attendance Standing</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-bold text-slate-900">{attendance.attendanceRate}%</span>
                <span className="block text-xs text-emerald-600 font-medium">Exemplary Record</span>
              </div>
              <div className="text-right text-xs text-slate-500 space-y-1">
                <div>Present: <span className="font-bold text-slate-800">{attendance.presentCount}</span></div>
                <div>Tardy: <span className="font-bold text-slate-800">{attendance.lateCount}</span></div>
                <div>Unexcused: <span className="font-bold text-slate-800">{attendance.absentCount}</span></div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${attendance.attendanceRate}%` }}
              />
            </div>
          </div>

          {/* Academic Courses */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold uppercase text-slate-500">Class Schedule & Teachers</span>
              <BookOpen className="w-5 h-5 text-crest-700" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between font-bold text-slate-900 mb-1">
                  <span>PHY-401 • AP Physics C</span>
                  <span className="text-crest-700">Period 1</span>
                </div>
                <p className="text-slate-500">Dr. Evelyn Reed • Lab 304</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between font-bold text-slate-900 mb-1">
                  <span>MTH-402 • AP Calculus BC</span>
                  <span className="text-crest-700">Period 2</span>
                </div>
                <p className="text-slate-500">Dr. Evelyn Reed • Room 210</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between font-bold text-slate-900 mb-1">
                  <span>ENG-301 • World Literature</span>
                  <span className="text-crest-700">Period 3</span>
                </div>
                <p className="text-slate-500">Mrs. Sarah Jenkins • Hall 105</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between font-bold text-slate-900 mb-1">
                  <span>CSC-350 • Robotics & AI</span>
                  <span className="text-crest-700">Period 4</span>
                </div>
                <p className="text-slate-500">Innovation Center • Hub 1</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gradebook and Evaluated Submissions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-slate-900">Academic Gradebook</h2>
              <p className="text-xs text-slate-500">Detailed breakdown of graded assignments, letter marks, and teacher commentary.</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Term Average</span>
              <span className="font-serif text-2xl font-bold text-crest-800">{gradesData.summary.overallPercentage}% (A)</span>
            </div>
          </div>

          <div className="space-y-4">
            {gradesData.records.map((record: any, idx: number) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold bg-crest-100 text-crest-800 px-2 py-0.5 rounded">
                      {record.classCode}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">{record.assignmentTitle}</h3>
                  </div>
                  <p className="text-xs text-slate-500">{record.className} • Due: {record.dueDate}</p>
                  {record.feedback && (
                    <p className="text-xs text-slate-600 bg-white p-2 rounded border border-slate-200 italic mt-2">
                      "{record.feedback}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="font-bold text-sm text-slate-900">
                      {record.pointsEarned} / {record.maxPoints} pts
                    </span>
                    <span className="block text-[11px] text-slate-500">
                      {Math.round((record.pointsEarned / record.maxPoints) * 100)}%
                    </span>
                  </div>
                  <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-base flex items-center justify-center">
                    {record.letterGrade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
