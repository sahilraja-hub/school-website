import React from 'react';
import {
  Users,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  Award,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ParentDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Guardian & Family Portal
              </span>
              <span className="text-xs text-slate-400">Academic Year 2026-2027</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Welcome, {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Monitor academic performance, attendance records, and faculty correspondence for your student.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>All Tuition Dues Cleared</span>
            </span>
          </div>
        </div>

        {/* Linked Student Card */}
        <div className="bg-gradient-to-r from-crest-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80"
              alt="Liam Vance"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-crest-400"
            />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-gold-400 font-bold">Linked Student</span>
              <h2 className="font-serif text-2xl font-bold">Liam Vance</h2>
              <p className="text-xs text-slate-300">Grade 11 • Senior High School Division • ID: OAK-882190</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-3 rounded-xl border border-white/10 text-xs">
            <div className="text-center px-2">
              <span className="text-slate-400 block text-[10px]">Overall GPA</span>
              <span className="font-serif text-xl font-bold text-gold-400">3.96</span>
            </div>
            <div className="h-6 w-px bg-white/20" />
            <div className="text-center px-2">
              <span className="text-slate-400 block text-[10px]">Attendance</span>
              <span className="font-serif text-xl font-bold text-emerald-400">98%</span>
            </div>
            <div className="h-6 w-px bg-white/20" />
            <div className="text-center px-2">
              <span className="text-slate-400 block text-[10px]">Honor Standing</span>
              <span className="font-bold text-white">Dean's List</span>
            </div>
          </div>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Parent-Teacher Conferences */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-crest-700" />
                <span>Parent-Teacher Academic Conferences</span>
              </h3>
              <span className="text-[11px] bg-crest-50 text-crest-700 px-2 py-0.5 rounded font-semibold">
                Upcoming
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between items-center font-bold text-slate-900">
                <span>Fall Mid-Term Progress Review</span>
                <span className="text-crest-700">Oct 15, 2026</span>
              </div>
              <p className="text-slate-600 text-xs">
                Scheduled consultation with Dr. Evelyn Reed (AP Physics) & Mrs. Sarah Jenkins (World Literature).
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                <Clock className="w-3.5 h-3.5 text-gold-500" />
                <span>Time: 3:30 PM – 4:15 PM (Conference Room B / Virtual Zoom)</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-xs uppercase text-slate-500 tracking-wider">Faculty Contacts</h4>
              <div className="flex items-center justify-between text-xs p-3 border border-slate-100 rounded-lg">
                <div>
                  <span className="font-bold text-slate-900 block">Dr. Evelyn Reed</span>
                  <span className="text-slate-500">AP Physics & Math</span>
                </div>
                <a
                  href="mailto:teacher@oakridge.edu"
                  className="flex items-center gap-1 text-crest-700 font-semibold hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" /> Message
                </a>
              </div>
            </div>
          </div>

          {/* Academic Report Summary */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-gold-600" />
                <span>Recent Subject Evaluations</span>
              </h3>
              <span className="text-xs text-slate-400">Quarter 1</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900">AP Physics C: Mechanics</h4>
                  <span className="text-slate-500">Lab Report: Two-Dimensional Kinematics</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-700 text-sm">96% (A)</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900">AP Calculus BC</h4>
                  <span className="text-slate-500">Taylor Series Assessment</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-700 text-sm">96% (A)</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900">World Literature & Rhetoric</h4>
                  <span className="text-slate-500">Shakespearean Essay Analysis</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-700 text-sm">94% (A)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
