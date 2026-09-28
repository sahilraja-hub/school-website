import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  UserCheck,
  ChevronRight,
  Shield,
  X,
} from 'lucide-react';

interface TeacherStudentsProps {
  students: any[];
  assignments: any[];
  selectedSectionFilter: string;
  onFilterChange: (sectionId: string) => void;
}

export const TeacherStudentsSection: React.FC<TeacherStudentsProps> = ({
  students,
  assignments,
  selectedSectionFilter,
  onFilterChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStudentModal, setActiveStudentModal] = useState<any | null>(null);

  // Filter students based on search and section
  const filteredStudents = students.filter((s) => {
    const matchesSection = !selectedSectionFilter || s.sectionId === selectedSectionFilter;
    const sName = `${s.user?.firstName || ''} ${s.user?.lastName || ''}`.toLowerCase();
    const sAdm = (s.admissionNumber || '').toLowerCase();
    const sRoll = (s.rollNumber || '').toLowerCase();
    const q = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || sName.includes(q) || sAdm.includes(q) || sRoll.includes(q);
    return matchesSection && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Student Roster</h2>
          <p className="text-xs text-slate-400 mt-1">
            Enrolled students across your assigned sections with academic records and emergency details.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Section Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedSectionFilter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-[#0B1528] border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-amber-400"
            >
              <option value="">All Assigned Sections</option>
              {assignments.map((a) => (
                <option key={a.sectionId} value={a.sectionId}>
                  {a.className || 'Grade 10'} • {a.sectionName || 'Section A'}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, roll, adm#..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#0B1528] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-[#0B1528]/90 border border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Roll Number</th>
                <th className="py-3.5 px-4">Admission #</th>
                <th className="py-3.5 px-4">Section</th>
                <th className="py-3.5 px-4">Emergency Contact</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-slate-300">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((st) => {
                  const studentName = st.user
                    ? `${st.user.firstName} ${st.user.lastName}`
                    : 'Liam Vance';
                  return (
                    <tr key={st.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold text-xs">
                            {studentName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-semibold text-white block">{studentName}</span>
                            <span className="text-[11px] text-slate-400">{st.user?.email || 'student@oakridge.edu'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-amber-300">
                        {st.rollNumber || '10-A-01'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {st.admissionNumber || 'ADM-2026-0089'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white font-medium">
                          {st.sectionId === 'sec-10b' ? 'Grade 10-B' : 'Grade 10-A'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-slate-300">{st.emergencyContact || '+1-555-9999'}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          {st.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setActiveStudentModal(st)}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 transition inline-flex items-center gap-1 font-medium"
                        >
                          <Eye className="w-3 h-3" />
                          Profile
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No students match the selected section or search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Profile Modal */}
      {activeStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0B1528] border border-white/15 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-serif font-bold text-lg">
                  {(activeStudentModal.user?.firstName || 'L').charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">
                    {activeStudentModal.user?.firstName || 'Liam'} {activeStudentModal.user?.lastName || 'Vance'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Roll: <span className="font-mono text-amber-300">{activeStudentModal.rollNumber || '10-A-01'}</span> • {activeStudentModal.admissionNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveStudentModal(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                <div>
                  <span className="text-slate-400 block mb-0.5">Gender</span>
                  <span className="font-medium text-white">{activeStudentModal.gender || 'MALE'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Date of Birth</span>
                  <span className="font-medium text-white">{activeStudentModal.dateOfBirth || '2010-04-12'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Blood Group</span>
                  <span className="font-medium text-amber-300">{activeStudentModal.bloodGroup || 'O+'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Admission Date</span>
                  <span className="font-medium text-white">{activeStudentModal.admissionDate || '2024-06-01'}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                  Parent / Guardian Information
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Guardian Name:</span>
                  <span className="text-white font-medium">Mr. Robert Vance</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Emergency Phone:</span>
                  <span className="text-amber-300 font-mono font-medium">{activeStudentModal.emergencyContact || '+1-555-9999'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Residential Address:</span>
                  <span className="text-slate-300 text-right max-w-xs">{activeStudentModal.address || '742 Evergreen Terrace'}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveStudentModal(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
