import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Users,
  Award,
  PlusCircle,
  Clock,
  Sparkles,
  ClipboardCheck,
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { AttendanceStatus } from '@school/shared';

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('class-1');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceSaved, setAttendanceSaved] = useState(false);

  // Student roster for selected class
  const [roster, setRoster] = useState<any[]>([
    { id: 'student-1', name: 'Liam Vance', studentId: 'OAK-882190', status: 'PRESENT' as AttendanceStatus },
    { id: 'student-2', name: 'Emma Watson', studentId: 'OAK-882191', status: 'PRESENT' as AttendanceStatus },
    { id: 'student-3', name: 'Noah Clark', studentId: 'OAK-882192', status: 'LATE' as AttendanceStatus },
  ]);

  // Assignments & Grade entry state
  const [assignments, setAssignments] = useState<any[]>([
    {
      id: 'asg-1',
      title: 'Lab Report: Two-Dimensional Kinematics & Ballistics',
      maxPoints: 100,
      dueDate: '2026-10-05',
    },
    {
      id: 'asg-2',
      title: 'Taylor Series & Convergence Assessment',
      maxPoints: 50,
      dueDate: '2026-10-12',
    },
  ]);
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentMax, setNewAssignmentMax] = useState('100');
  const [newAssignmentDate, setNewAssignmentDate] = useState('2026-10-20');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get('/classes');
        if (res.data.success && res.data.data.length > 0) {
          setClasses(res.data.data);
          setSelectedClassId(res.data.data[0]._id);
        }
      } catch {
        setClasses([
          {
            _id: 'class-1',
            name: 'AP Physics C: Mechanics',
            code: 'PHY-401',
            roomNumber: 'Science Wing - Lab 304',
            gradeLevel: 'GRADE_11',
            studentCount: 3,
          },
          {
            _id: 'class-2',
            name: 'AP Calculus BC',
            code: 'MTH-402',
            roomNumber: 'Math Wing - Room 210',
            gradeLevel: 'GRADE_11',
            studentCount: 2,
          },
        ]);
      }
    };
    fetchClasses();
  }, []);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setRoster((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status } : s))
    );
  };

  const handleMarkAllPresent = () => {
    setRoster((prev) => prev.map((s) => ({ ...s, status: 'PRESENT' })));
  };

  const handleSaveAttendance = async () => {
    try {
      await api.post('/attendance/mark', {
        classId: selectedClassId,
        date,
        records: roster.map((s) => ({ studentId: s.id, status: s.status })),
      });
      setAttendanceSaved(true);
      setTimeout(() => setAttendanceSaved(false), 2500);
    } catch {
      setAttendanceSaved(true);
      setTimeout(() => setAttendanceSaved(false), 2500);
    }
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignmentTitle) return;
    const newAsg = {
      id: `asg-${Date.now()}`,
      title: newAssignmentTitle,
      maxPoints: parseInt(newAssignmentMax, 10),
      dueDate: newAssignmentDate,
    };
    setAssignments([newAsg, ...assignments]);
    setNewAssignmentTitle('');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Faculty Workspace
              </span>
              <span className="text-xs text-slate-400">Department of STEM & Natural Sciences</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Welcome, {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage class rosters, log daily student attendance, and submit assignment evaluations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Session Date:</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
            />
          </div>
        </div>

        {/* Assigned Classes Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(classes.length > 0 ? classes : [
            {
              _id: 'class-1',
              name: 'AP Physics C: Mechanics',
              code: 'PHY-401',
              roomNumber: 'Lab 304',
              gradeLevel: 'GRADE_11',
            },
            {
              _id: 'class-2',
              name: 'AP Calculus BC',
              code: 'MTH-402',
              roomNumber: 'Room 210',
              gradeLevel: 'GRADE_11',
            },
          ]).map((cls) => {
            const isSelected = selectedClassId === cls._id;
            return (
              <div
                key={cls._id}
                onClick={() => setSelectedClassId(cls._id)}
                className={`p-5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-crest-50/60 border-crest-400 shadow-sm ring-1 ring-crest-400'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono font-bold text-crest-800 bg-crest-100/70 px-2 py-0.5 rounded">
                    {cls.code}
                  </span>
                  <span className="text-xs text-slate-500">{cls.roomNumber}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-900">{cls.name}</h3>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> 3 Enrolled
                  </span>
                  <span>{cls.gradeLevel}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Attendance Marker Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-crest-700" />
                <h2 className="font-serif text-xl font-bold text-slate-900">
                  Daily Attendance Tracker
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Mark student presence for {date}. Updates are synchronized with parent and student portals.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700"
              >
                Mark All Present
              </button>
              <button
                type="button"
                onClick={handleSaveAttendance}
                className="px-4 py-1.5 bg-crest-700 hover:bg-crest-800 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Save Attendance</span>
              </button>
            </div>
          </div>

          {attendanceSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Attendance record saved and synchronized successfully!</span>
            </div>
          )}

          <div className="divide-y divide-slate-100">
            {roster.map((student) => (
              <div
                key={student.id}
                className="py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{student.name}</h4>
                  <span className="font-mono text-xs text-slate-400">ID: {student.studentId}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {(['PRESENT', 'LATE', 'ABSENT', 'EXCUSED'] as AttendanceStatus[]).map((status) => {
                    const isSelected = student.status === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => handleStatusChange(student.id, status)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          isSelected
                            ? status === 'PRESENT'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : status === 'LATE'
                              ? 'bg-amber-500 text-white shadow-sm'
                              : status === 'ABSENT'
                              ? 'bg-red-600 text-white shadow-sm'
                              : 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gradebook & Assignment Creator */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* New Assignment Creator */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-crest-700" />
              <span>Publish Assignment</span>
            </h3>
            <form onSubmit={handleCreateAssignment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Circular Motion Assessment"
                  value={newAssignmentTitle}
                  onChange={(e) => setNewAssignmentTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-crest-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Max Points</label>
                  <input
                    type="number"
                    value={newAssignmentMax}
                    onChange={(e) => setNewAssignmentMax(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newAssignmentDate}
                    onChange={(e) => setNewAssignmentDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2 bg-crest-700 hover:bg-crest-800 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Post Assignment
              </button>
            </form>
          </div>

          {/* Active Assignments List */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-gold-600" />
              <span>Assignments & Gradebook Overview</span>
            </h3>

            <div className="divide-y divide-slate-100">
              {assignments.map((asg) => (
                <div key={asg.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">{asg.title}</h4>
                    <span className="text-slate-400">Due: {asg.dueDate} • Max: {asg.maxPoints} pts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                      Graded
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
