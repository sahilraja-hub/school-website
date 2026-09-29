import React from 'react';
import {
  User,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  CheckCircle,
  HeartPulse,
  Users,
} from 'lucide-react';

interface StudentProfileSectionProps {
  profile: any;
}

export const StudentProfileSection: React.FC<StudentProfileSectionProps> = ({ profile }) => {
  const p = profile || {};
  const parent = p.parent || {};

  return (
    <div className="space-y-8 animate-fadeIn" data-testid="student-profile-section">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-crest-700 to-crest-950 p-1 shadow-md">
            <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center font-serif text-3xl font-bold text-crest-800">
              {p.firstName?.[0] || 'L'}
              {p.lastName?.[0] || 'V'}
            </div>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="bg-crest-100 text-crest-800 font-bold px-2.5 py-0.5 rounded text-xs">
                {p.className || 'Grade 10'} • {p.sectionName || 'Section A'}
              </span>
              <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded text-xs flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> {p.status || 'ACTIVE'}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              {p.fullName || `${p.firstName || 'Liam'} ${p.lastName || 'Vance'}`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Scholar Admission ID: <span className="font-mono font-semibold text-slate-800">{p.admissionNumber || 'ADM-2026-0089'}</span>
            </p>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-3 bg-crest-50 border border-crest-100 p-3.5 rounded-2xl text-xs text-crest-900 max-w-sm">
          <ShieldCheck className="w-5 h-5 text-crest-700 shrink-0" />
          <div>
            <span className="font-bold block">Verified Scholar Account</span>
            <span className="text-[11px] text-crest-700">Strict end-to-end authorization enforced. Data is isolated to your profile.</span>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Academic & Cohort Credentials */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-crest-700" />
              Academic Enrollment Details
            </h3>
            <p className="text-xs text-slate-500">Class placement and administrative registration</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Admission Number</span>
              <span className="font-mono font-bold text-slate-900">{p.admissionNumber || 'ADM-2026-0089'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Class Roll Number</span>
              <span className="font-mono font-bold text-slate-900">{p.rollNumber || '10-A-01'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Current Grade / Cohort</span>
              <span className="font-bold text-slate-900">{p.className || 'Grade 10'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Section Enrolled</span>
              <span className="font-bold text-slate-900">{p.sectionName || 'Section A'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Homeroom Assigned</span>
              <span className="font-bold text-slate-900">{p.roomNumber || 'Room 301'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Admission Date</span>
              <span className="font-semibold text-slate-900">
                {p.admissionDate ? new Date(p.admissionDate).toLocaleDateString() : 'June 1, 2024'}
              </span>
            </div>
          </div>
        </div>

        {/* Scholar Demographics & Emergency */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-crest-700" />
              Personal & Demographics
            </h3>
            <p className="text-xs text-slate-500">Scholar identification and health records</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Date of Birth</span>
              <span className="font-semibold text-slate-900">
                {p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString() : 'April 12, 2010'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Gender</span>
              <span className="font-semibold text-slate-900 capitalize">{p.gender || 'Male'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Blood Group</span>
              <span className="font-bold text-crest-700 bg-crest-50 px-2 py-0.5 rounded">
                {p.bloodGroup || 'O+'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Emergency Contact Number</span>
              <span className="font-mono font-bold text-slate-900">{p.emergencyContact || '+1-555-9999'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Scholar Email</span>
              <span className="font-semibold text-slate-900">{p.email || 'student@oakridge.edu'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Residential Address</span>
              <span className="font-semibold text-slate-900 text-right">{p.address || '742 Evergreen Terrace'}</span>
            </div>
          </div>
        </div>

        {/* Guardian / Parent Information Card */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-gold-600" />
              Guardian & Parent Information
            </h3>
            <p className="text-xs text-slate-500">Authorized primary contact on official school records</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-400 block mb-1">Parent / Guardian Name</span>
              <span className="font-bold text-slate-900">{parent.name || 'David Vance'}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-400 block mb-1">Relationship</span>
              <span className="font-bold text-slate-900">{parent.relationship || 'Father'}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-400 block mb-1">Contact Phone</span>
              <span className="font-mono font-bold text-slate-900">{parent.phone || '+1 (555) 019-2837'}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-400 block mb-1">Contact Email</span>
              <span className="font-semibold text-slate-900 truncate block">{parent.email || 'parent@oakridge.edu'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
