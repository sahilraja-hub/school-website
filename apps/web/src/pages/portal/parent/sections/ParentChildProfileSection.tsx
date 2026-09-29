import React from 'react';
import {
  User,
  GraduationCap,
  Calendar,
  Heart,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { LinkedChild, ParentPortalTab } from '../types';

interface ParentChildProfileSectionProps {
  childrenList: LinkedChild[];
  selectedChild: LinkedChild | null;
  onSelectChild: (childId: string) => void;
  onNavigateTab: (tab: ParentPortalTab) => void;
}

export const ParentChildProfileSection: React.FC<ParentChildProfileSectionProps> = ({
  childrenList,
  selectedChild,
  onSelectChild,
  onNavigateTab,
}) => {
  if (!selectedChild) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
        No linked student selected. Please choose a child profile.
      </div>
    );
  }

  return (
    <div className="space-y-8" data-testid="parent-child-profile-section">
      {/* Multi-Child Selector Chips */}
      {childrenList.length > 1 && (
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-crest-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Select Child Profile:
            </span>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {childrenList.map((child) => {
              const isSelected = selectedChild.id === child.id;
              return (
                <button
                  key={child.id}
                  onClick={() => onSelectChild(child.id)}
                  data-testid={`child-profile-tab-${child.id}`}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                    isSelected
                      ? 'bg-crest-950 text-white shadow-sm ring-2 ring-gold-400'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{child.fullName}</span>
                  <span className="text-[10px] opacity-75">({child.className})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Child Hero Card */}
      <div className="bg-gradient-to-r from-crest-950 via-crest-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-crest-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 p-0.5 shadow-md flex-shrink-0">
            <div className="w-full h-full rounded-[14px] bg-crest-950 flex items-center justify-center font-serif font-bold text-gold-400 text-2xl">
              {selectedChild.firstName[0]}
              {selectedChild.lastName[0]}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="bg-gold-500/20 text-gold-300 border border-gold-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Full-Time Scholar
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded">
                Active Enrolled
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white" data-testid="child-profile-title">
              {selectedChild.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              {selectedChild.className} • {selectedChild.sectionName} • Roll No: {selectedChild.rollNumber || '10-A-01'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => onNavigateTab('attendance')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Attendance</span>
          </button>
          <button
            onClick={() => onNavigateTab('results')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white transition flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5 text-gold-400" />
            <span>Results</span>
          </button>
          <button
            onClick={() => onNavigateTab('fees')}
            className="px-3.5 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-crest-950 font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
          >
            <span>Tuition & Fees</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid: Academic & Personal Attributes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Academic Profile */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-crest-700" /> Academic & Enrollment Record
            </h2>
            <span className="text-xs text-slate-400">Term 2026-27</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Admission Number</span>
              <p className="font-mono font-bold text-slate-900">{selectedChild.admissionNumber}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Roll Number</span>
              <p className="font-mono font-bold text-slate-900">{selectedChild.rollNumber || '10-A-01'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Class / Grade</span>
              <p className="font-semibold text-slate-900">{selectedChild.className || 'Grade 10'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Assigned Section</span>
              <p className="font-semibold text-slate-900">{selectedChild.sectionName || 'Section A'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Primary Classroom</span>
              <p className="font-semibold text-slate-900">{selectedChild.roomNumber || 'Room 302, Senior Wing'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Academic Stream</span>
              <p className="font-semibold text-slate-900">Advanced STEM & Pre-University</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-900 block">Homeroom Mentor:</span>
              <p>Dr. Robert Chen (Science Dept.) • Office Hours: Tuesdays & Thursdays 3:30 PM - 5:00 PM</p>
            </div>
          </div>
        </div>

        {/* Personal & Medical Information */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-600" /> Personal & Medical Registry
            </h2>
            <span className="text-xs text-slate-400">Confidential</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Date of Birth</span>
              <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-crest-700" />
                <span>{selectedChild.dateOfBirth || '2010-04-12'}</span>
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Gender</span>
              <p className="font-semibold text-slate-900">{selectedChild.gender || 'Male'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Blood Group</span>
              <p className="font-semibold text-rose-700 font-mono font-bold bg-rose-50 px-2 py-0.5 rounded w-fit">
                {selectedChild.bloodGroup || 'O+'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Emergency Contact</span>
              <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-crest-700" />
                <span>{selectedChild.emergencyContact || '+1 (555) 019-2837'}</span>
              </p>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Registered Scholar Email</span>
              <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-crest-700" />
                <span>{selectedChild.email || 'student@oakridge.edu'}</span>
              </p>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Campus Residence / Address</span>
              <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-crest-700" />
                <span>{selectedChild.address || '742 Evergreen Terrace'}</span>
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
            <Sparkles className="w-4 h-4 text-gold-500 flex-shrink-0" />
            <span>Health records & allergy notifications are managed through the Oakridge Infirmary portal.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
