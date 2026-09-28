import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Shield,
  BookOpen,
  Users,
  Edit2,
  Save,
  Award,
} from 'lucide-react';
import { api } from '../../../../services/api';

interface TeacherProfileProps {
  profile: any;
  assignments: any[];
  onRefresh: () => void;
}

export const TeacherProfileSection: React.FC<TeacherProfileProps> = ({
  profile,
  assignments,
  onRefresh,
}) => {
  const teacherUser = profile?.user || {};
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(teacherUser.phone || '+1 (555) 019-2832');
  const [specialization, setSpecialization] = useState(
    profile?.specialization || 'Advanced Calculus & Mathematical Physics'
  );
  const [qualification, setQualification] = useState(
    profile?.qualification || 'M.Sc. Pure Mathematics, Oxford'
  );
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (profile?.id) {
        await api.patch(`/teachers/${profile.id}`, {
          qualification,
          specialization,
        });
      }
      setSavedSuccess(true);
      setIsEditing(false);
      onRefresh();
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Profile Hero Card */}
      <div className="bg-[#0B1528]/90 border border-white/10 rounded-2xl p-8 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold font-serif text-3xl shadow-lg shadow-amber-500/20">
                {teacherUser.firstName ? teacherUser.firstName.charAt(0) : 'S'}
                {teacherUser.lastName ? teacherUser.lastName.charAt(0) : 'J'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0B1528] flex items-center justify-center text-white" title="Active Status">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-serif font-bold text-white">
                  {teacherUser.firstName ? `${teacherUser.firstName} ${teacherUser.lastName}` : 'Dr. Sarah Jenkins'}
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  {profile?.department || 'Department of Mathematics'}
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                Faculty ID: <span className="font-mono text-amber-300 font-medium">{profile?.employeeId || 'EMP-2024-001'}</span> • {profile?.qualification || 'Senior Faculty'}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {teacherUser.email || 'teacher@oakridge.edu'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Joined: {profile?.joiningDate || 'August 2021'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition border border-white/10"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium text-xs transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {savedSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Faculty profile details successfully updated and saved.
          </div>
        )}
      </div>

      {/* Edit Form (if active) */}
      {isEditing && (
        <form onSubmit={handleSave} className="bg-[#0B1528]/90 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-semibold text-white">Update Professional Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Highest Qualification</label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Academic Specialization</label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold text-xs hover:from-amber-400 hover:to-amber-500 transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      {/* Details Grid: Credentials & Current Class Allocations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Credentials & Institutional Record */}
        <div className="bg-[#0B1528]/90 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-white">Credentials & Institutional Record</h3>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-slate-400">Employee ID</span>
              <span className="font-mono font-medium text-white">{profile?.employeeId || 'EMP-2024-001'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-slate-400">Department</span>
              <span className="font-medium text-white">{profile?.department || 'Mathematics'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-slate-400">Qualifications</span>
              <span className="font-medium text-white text-right max-w-xs">{qualification}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-slate-400">Specialization</span>
              <span className="font-medium text-white text-right max-w-xs">{specialization}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-slate-400">Status</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                {profile?.status || 'ACTIVE'}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400">Academic Year</span>
              <span className="font-medium text-white">2026-2027</span>
            </div>
          </div>
        </div>

        {/* Assigned Classes & Authorized Subjects */}
        <div className="bg-[#0B1528]/90 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-semibold text-white">Authorized Class Allocations</h3>
          </div>

          <div className="space-y-3">
            {assignments.length > 0 ? (
              assignments.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">
                      {item.className ? item.className.replace('Grade ', '') : '10'}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {item.className || 'Grade 10'} • {item.sectionName || 'Section A'}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {item.subjectName || 'Advanced Mathematics'} ({item.subjectCode || 'MATH-101'})
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/10 text-slate-300 block mb-1">
                      {item.roomNumber || 'Room 301'}
                    </span>
                    {item.isPrimaryTeacher && (
                      <span className="text-[10px] text-amber-400 font-medium">Class Teacher</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400 text-sm">
                No active class allocations recorded. Contact the academic office.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
