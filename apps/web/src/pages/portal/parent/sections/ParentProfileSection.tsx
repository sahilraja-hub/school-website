import React from 'react';
import {
  User,
  ShieldCheck,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { ParentProfile, LinkedChild, ParentPortalTab } from '../types';

interface ParentProfileSectionProps {
  parent: ParentProfile | null;
  childrenList: LinkedChild[];
  selectedChild: LinkedChild | null;
  onSelectChild: (childId: string) => void;
  onNavigateTab: (tab: ParentPortalTab) => void;
}

export const ParentProfileSection: React.FC<ParentProfileSectionProps> = ({
  parent,
  childrenList,
  selectedChild,
  onSelectChild,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-8" data-testid="parent-profile-section">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-crest-900 to-slate-900 text-gold-400 flex items-center justify-center font-serif text-2xl font-bold shadow-md border border-crest-700">
            {parent?.firstName?.[0] || 'D'}
            {parent?.lastName?.[0] || 'V'}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Guardian
              </span>
              <span className="text-xs text-slate-400">ID: {parent?.id || 'par-001'}</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              {parent?.fullName || 'David Vance'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Registered Primary Contact for {childrenList.length} Enrolled {childrenList.length === 1 ? 'Scholar' : 'Scholars'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-crest-700" />
            <span>Family Tenancy Active</span>
          </span>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Demographic Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-crest-700" /> Guardian Demographic Details
              </h2>
              <span className="text-xs text-slate-400">Official Institutional Record</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Full Legal Name</span>
                <p className="font-semibold text-slate-900">{parent?.fullName || 'David Vance'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Relationship to Scholar(s)</span>
                <p className="font-semibold text-slate-900">{parent?.relationship || 'Father / Primary Guardian'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Email Address</span>
                <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-crest-700" />
                  <span>{parent?.email || 'parent@oakridge.edu'}</span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Contact Telephone</span>
                <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-crest-700" />
                  <span>{parent?.phone || '+1 (555) 019-2837'}</span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Professional Occupation</span>
                <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-crest-700" />
                  <span>{parent?.occupation || 'Senior Architect'}</span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Residential Address</span>
                <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-crest-700" />
                  <span>{parent?.address || '742 Evergreen Terrace'}</span>
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>To update your primary legal address or emergency phone contact, please file a request with the Registrar's Office.</span>
            </div>
          </div>

          {/* Linked Scholars Directory */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-crest-700" /> Linked Enrolled Children ({childrenList.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Institutional accounts verified under your parental guardianship.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {childrenList.map((child) => {
                const isSelected = selectedChild?.id === child.id;
                return (
                  <div
                    key={child.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-gradient-to-br from-crest-950 to-slate-900 text-white border-crest-700 shadow-md ring-2 ring-gold-400/40'
                        : 'bg-slate-50 border-slate-200 hover:border-crest-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center font-serif font-bold text-base ${
                            isSelected
                              ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                              : 'bg-white text-crest-900 border border-slate-200 shadow-sm'
                          }`}
                        >
                          {child.firstName[0]}
                          {child.lastName[0]}
                        </div>
                        <div>
                          <h4 className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {child.fullName}
                          </h4>
                          <p className={`text-xs ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                            {child.className} • {child.sectionName}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="text-[10px] bg-gold-400/20 text-gold-300 font-semibold px-2 py-0.5 rounded uppercase tracking-wider">
                          Active
                        </span>
                      )}
                    </div>

                    <div className={`mt-4 pt-3 border-t text-xs space-y-1.5 ${isSelected ? 'border-white/10 text-slate-300' : 'border-slate-200 text-slate-600'}`}>
                      <div className="flex justify-between">
                        <span>Admission No:</span>
                        <span className={`font-mono font-medium ${isSelected ? 'text-white' : 'text-slate-900'}`}>{child.admissionNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Roll Number:</span>
                        <span className={`font-mono font-medium ${isSelected ? 'text-white' : 'text-slate-900'}`}>{child.rollNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Email:</span>
                        <span className="truncate max-w-[170px]">{child.email}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-2">
                      <button
                        onClick={() => {
                          onSelectChild(child.id);
                          onNavigateTab('child-profile');
                        }}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-gold-500 hover:bg-gold-600 text-crest-950 shadow-sm'
                            : 'bg-white hover:bg-slate-100 text-crest-800 border border-slate-200'
                        }`}
                      >
                        <span>View Child Profile</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Support & Institutional Notice */}
        <div className="space-y-6">
          {/* Institutional Contact Card */}
          <div className="bg-gradient-to-br from-crest-950 to-slate-900 text-white p-6 sm:p-7 rounded-2xl shadow-md border border-crest-800/80 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-crest-800">
              <Sparkles className="w-5 h-5 text-gold-400" />
              <h3 className="font-serif font-bold text-base text-white">Admissions & Bursar Desk</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              For fee receipts, sibling tuition scholarships, official transcripts, or medical updates, please connect directly with the parent liaison office.
            </p>
            <div className="space-y-2.5 text-xs text-slate-200 pt-1">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span>Registrar Desk:</span>
                <span className="font-mono text-gold-400">+1 (555) 012-3401</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span>Bursar (Fees):</span>
                <span className="font-mono text-gold-400">+1 (555) 012-3402</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span>Direct Email:</span>
                <span className="text-gold-400">parents@oakridge.edu</span>
              </div>
            </div>
          </div>

          {/* Quick Security Badge */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-serif font-bold text-sm text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Account Authorization
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Parental privacy is strictly safeguarded. You are exclusively authorized to view grades, attendance, and fee invoices corresponding to your linked children.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
              Security Protocol: <span className="font-mono text-crest-700">AES-256 JWT RBAC</span> Active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
