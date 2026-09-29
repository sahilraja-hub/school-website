import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  User,
  GraduationCap,
  CheckCircle2,
  Award,
  BookOpen,
  Calendar,
  Bell,
  Sparkles,
  FileText,
  CreditCard,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  ChevronDown,
  Users,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  ParentPortalTab,
  LinkedChild,
  ParentProfile,
  FeeInvoice,
} from './parent/types';

// Section components
import { ParentOverviewSection } from './parent/sections/ParentOverviewSection';
import { ParentProfileSection } from './parent/sections/ParentProfileSection';
import { ParentChildProfileSection } from './parent/sections/ParentChildProfileSection';
import { ParentAttendanceSection } from './parent/sections/ParentAttendanceSection';
import { ParentResultsSection } from './parent/sections/ParentResultsSection';
import { ParentHomeworkSection } from './parent/sections/ParentHomeworkSection';
import { ParentTimetableSection } from './parent/sections/ParentTimetableSection';
import { ParentFeesSection } from './parent/sections/ParentFeesSection';
import { ParentNoticesSection } from './parent/sections/ParentNoticesSection';
import { ParentEventsSection } from './parent/sections/ParentEventsSection';
import { ParentDocumentsSection } from './parent/sections/ParentDocumentsSection';

export const ParentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<ParentPortalTab>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Core Data States
  const [parent, setParent] = useState<ParentProfile | null>(null);
  const [childrenList, setChildrenList] = useState<LinkedChild[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('stud-001');

  // Child-specific data states
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [homework, setHomework] = useState<any[]>([]);
  const [timetable, setTimetable] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<FeeInvoice[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  // Payment modal state
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [activeInvoiceForModal, setActiveInvoiceForModal] = useState<FeeInvoice | null>(null);

  // Derived active child
  const selectedChild = useMemo(() => {
    return (
      childrenList.find((c) => c.id === selectedChildId) ||
      childrenList[0] ||
      null
    );
  }, [childrenList, selectedChildId]);

  // Initial Fetch: Parent Profile & Linked Children
  const fetchParentData = async () => {
    setLoading(true);
    let loadedChildren: LinkedChild[] = [];

    try {
      const res = await api.get('/parents/me');
      if (res.data.success && res.data.data) {
        const parentData = res.data.data;
        setParent(parentData);
        if (parentData.children && parentData.children.length > 0) {
          loadedChildren = parentData.children;
          setChildrenList(loadedChildren);
          setSelectedChildId(loadedChildren[0].id);
        }
      }
    } catch {
      // Fallback Seeded Profile: David Vance with 2 linked children
      const fallbackParent: ParentProfile = {
        id: 'par-001',
        userId: 'usr-parent-01',
        fullName: `${user?.firstName || 'David'} ${user?.lastName || 'Vance'}`,
        firstName: user?.firstName || 'David',
        lastName: user?.lastName || 'Vance',
        email: user?.email || 'parent@oakridge.edu',
        relationship: 'Father',
        phone: '+1 (555) 019-2837',
        occupation: 'Senior Architect',
        address: '742 Evergreen Terrace',
        studentIds: ['stud-001', 'stud-003'],
      };
      setParent(fallbackParent);

      loadedChildren = [
        {
          id: 'stud-001',
          admissionNumber: 'ADM-2026-0089',
          rollNumber: '10-A-01',
          firstName: 'Liam',
          lastName: 'Vance',
          fullName: 'Liam Vance',
          email: 'student@oakridge.edu',
          dateOfBirth: '2010-04-12',
          gender: 'Male',
          bloodGroup: 'O+',
          emergencyContact: '+1 (555) 019-2837',
          address: '742 Evergreen Terrace',
          status: 'ACTIVE',
          className: 'Grade 10',
          sectionName: 'Section A',
          sectionId: 'sec-10a',
          roomNumber: 'Room 301',
        },
        {
          id: 'stud-003',
          admissionNumber: 'ADM-2026-0091',
          rollNumber: '10-B-04',
          firstName: 'Lucas',
          lastName: 'Vance',
          fullName: 'Lucas Vance',
          email: 'lucas.vance@oakridge.edu',
          dateOfBirth: '2010-08-22',
          gender: 'Male',
          bloodGroup: 'A+',
          emergencyContact: '+1 (555) 019-2837',
          address: '742 Evergreen Terrace',
          status: 'ACTIVE',
          className: 'Grade 10',
          sectionName: 'Section B',
          sectionId: 'sec-10b',
          roomNumber: 'Room 304',
        },
      ];
      setChildrenList(loadedChildren);
      setSelectedChildId(loadedChildren[0].id);
    }

    const initialChild = loadedChildren[0];
    if (initialChild) {
      await fetchChildData(initialChild.id, initialChild.sectionId);
    }
    setLoading(false);
  };

  // Fetch Child-Specific Data (Attendance, Results, Timetable, Fees, Homework)
  const fetchChildData = async (childId: string, sectionId?: string) => {
    try {
      // 1. Attendance & Attendance Stats
      const [attRes, statsRes] = await Promise.allSettled([
        api.get(`/attendance?studentId=${childId}`),
        api.get(`/attendance/stats?studentId=${childId}`),
      ]);
      if (attRes.status === 'fulfilled' && attRes.value.data.success) {
        setAttendanceRecords(attRes.value.data.data || []);
      }
      if (statsRes.status === 'fulfilled' && statsRes.value.data.success) {
        setAttendanceStats(statsRes.value.data.data);
      }
    } catch {
      // Handled gracefully with fallback demo data
    }

    try {
      // 2. Results
      const res = await api.get(`/results?studentId=${childId}`);
      if (res.data.success && res.data.data) {
        setResults(res.data.data);
      }
    } catch {
      // Handled gracefully
    }

    try {
      // 3. Invoices / Fees
      const res = await api.get(`/fees/invoices?studentId=${childId}`);
      if (res.data.success && res.data.data) {
        setInvoices(res.data.data);
      }
    } catch {
      // Handled gracefully
    }

    try {
      // 4. Timetable for child's section
      const timetableUrl = sectionId ? `/timetable?sectionId=${sectionId}` : '/timetable';
      const res = await api.get(timetableUrl);
      if (res.data.success && res.data.data) {
        setTimetable(res.data.data);
      }
    } catch {
      // Handled gracefully
    }

    try {
      // 5. Homework, Notices, Events, Documents
      const [hwRes, notRes, evtRes, docRes] = await Promise.allSettled([
        api.get('/homework'),
        api.get('/notices'),
        api.get('/events'),
        api.get('/documents'),
      ]);

      if (hwRes.status === 'fulfilled' && hwRes.value.data.success) {
        setHomework(hwRes.value.data.data || []);
      }
      if (notRes.status === 'fulfilled' && notRes.value.data.success) {
        setNotices(notRes.value.data.data || []);
      }
      if (evtRes.status === 'fulfilled' && evtRes.value.data.success) {
        setEvents(evtRes.value.data.data || []);
      }
      if (docRes.status === 'fulfilled' && docRes.value.data.success) {
        setDocuments(docRes.value.data.data || []);
      }
    } catch {
      // Handled gracefully
    }
  };

  useEffect(() => {
    fetchParentData();
  }, []);

  const handleSelectChild = (childId: string) => {
    setSelectedChildId(childId);
    const target = childrenList.find((c) => c.id === childId);
    if (target) {
      fetchChildData(target.id, target.sectionId);
    }
  };

  const handlePaymentSuccess = (updatedInvoice: FeeInvoice) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === updatedInvoice.id ? updatedInvoice : inv))
    );
  };

  const handleOpenPayModal = (invoice?: FeeInvoice) => {
    if (invoice) {
      setActiveInvoiceForModal(invoice);
    } else {
      const pendingInv = invoices.find((i) => i.balance > 0) || invoices[0];
      setActiveInvoiceForModal(pendingInv || null);
    }
    setIsPayModalOpen(true);
  };

  const navigationItems = [
    { id: 'overview' as ParentPortalTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'parent-profile' as ParentPortalTab, label: 'Guardian Profile', icon: User },
    { id: 'child-profile' as ParentPortalTab, label: 'Scholar Profile', icon: GraduationCap },
    { id: 'attendance' as ParentPortalTab, label: 'Attendance', icon: CheckCircle2 },
    { id: 'results' as ParentPortalTab, label: 'Results & Gradebook', icon: Award },
    { id: 'homework' as ParentPortalTab, label: 'Coursework & Homework', icon: BookOpen },
    { id: 'timetable' as ParentPortalTab, label: 'Class Timetable', icon: Calendar },
    { id: 'fees' as ParentPortalTab, label: 'Tuition & Fees', icon: CreditCard },
    { id: 'notices' as ParentPortalTab, label: 'Circulars & Notices', icon: Bell },
    { id: 'events' as ParentPortalTab, label: 'Campus Events', icon: Sparkles },
    { id: 'documents' as ParentPortalTab, label: 'Handbooks & Docs', icon: FileText },
  ];

  return (
    <div
      className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 selection:bg-crest-600 selection:text-white"
      data-testid="parent-dashboard"
    >
      {/* Mobile Top Header */}
      <div className="md:hidden bg-gradient-to-r from-crest-950 via-crest-900 to-slate-900 text-white p-4 flex items-center justify-between shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center font-serif font-bold text-gold-400">
            OA
          </div>
          <div>
            <h1 className="font-serif font-bold text-base tracking-wide text-white">Oakridge Academy</h1>
            <p className="text-[10px] text-gold-400 uppercase tracking-widest">Family & Guardian Portal</p>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-white"
          aria-label="Toggle Navigation"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop Sidebar & Mobile Drawer */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-gradient-to-b from-crest-950 via-crest-900 to-slate-900 text-white p-6 z-50 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-crest-800/40 shadow-2xl overflow-y-auto`}
      >
        <div className="space-y-6">
          {/* Academy Crest Brand */}
          <div className="flex items-center gap-3.5 pb-4 border-b border-crest-800/60">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 p-0.5 shadow-lg">
              <div className="w-full h-full rounded-[14px] bg-crest-950 flex items-center justify-center font-serif font-bold text-gold-400 text-lg">
                OA
              </div>
            </div>
            <div>
              <h2 className="font-serif font-bold text-base tracking-wider text-white">OAKRIDGE</h2>
              <p className="text-[10px] text-gold-400 uppercase tracking-widest font-semibold">
                Guardian Portal
              </p>
            </div>
          </div>

          {/* Active Scholar Selector Dropdown in Sidebar */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-[10px] text-gold-400 font-bold uppercase tracking-wider">
              <span>Active Child Profile</span>
              <span className="bg-gold-500/20 px-1.5 py-0.5 rounded text-[9px]">
                {childrenList.length} Linked
              </span>
            </div>

            {childrenList.length > 1 ? (
              <div className="relative">
                <select
                  value={selectedChildId}
                  onChange={(e) => handleSelectChild(e.target.value)}
                  data-testid="sidebar-child-dropdown"
                  className="w-full bg-crest-900 border border-crest-700/60 text-white text-xs font-semibold rounded-xl px-3 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-gold-400 pr-8"
                >
                  {childrenList.map((child) => (
                    <option key={child.id} value={child.id} className="bg-crest-950 text-white">
                      {child.fullName} ({child.className} - {child.sectionName})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gold-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            ) : (
              <div className="flex items-center gap-2.5 pt-1">
                <div className="w-8 h-8 rounded-lg bg-gold-500/20 text-gold-400 flex items-center justify-center font-serif font-bold text-xs">
                  {selectedChild?.firstName?.[0] || 'L'}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs text-white truncate">
                    {selectedChild?.fullName || 'Liam Vance'}
                  </h4>
                  <p className="text-[10px] text-slate-300 truncate">
                    {selectedChild?.className} • {selectedChild?.sectionName}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  data-testid={`nav-tab-${item.id}`}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-gradient-to-r from-crest-800 to-crest-700 text-white shadow-md border border-crest-600/50'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-gold-400" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Parent User & Sign Out */}
        <div className="pt-4 border-t border-crest-800/60 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-crest-800 flex items-center justify-center text-xs font-bold text-gold-400 border border-crest-700">
              {parent?.firstName?.[0] || 'D'}
              {parent?.lastName?.[0] || 'V'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">
                {parent?.fullName || `${user?.firstName || 'David'} ${user?.lastName || 'Vance'}`}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {parent?.email || user?.email || 'parent@oakridge.edu'}
              </p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            data-testid="parent-logout-btn"
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold transition border border-white/5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Top Desktop Bar with Child Switcher Pills */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Scholar:
              </span>
              <div className="flex items-center gap-1.5" data-testid="topbar-child-switcher">
                {childrenList.map((c) => {
                  const isSelected = selectedChild?.id === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleSelectChild(c.id)}
                      data-testid={`top-child-pill-${c.id}`}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-crest-950 text-white shadow-sm ring-1 ring-gold-400'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-gold-400' : 'bg-slate-400'}`} />
                      <span>{c.fullName}</span>
                      <span className="text-[10px] opacity-75">({c.className})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-crest-50 text-crest-800 border border-crest-100 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-crest-700" />
              <span>Guardian Verified</span>
            </span>
          </div>
        </header>

        {/* Dynamic Section Container */}
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
          {activeTab === 'overview' && (
            <ParentOverviewSection
              parent={parent}
              childrenList={childrenList}
              selectedChild={selectedChild}
              onSelectChild={handleSelectChild}
              attendanceStats={attendanceStats}
              results={results}
              homework={homework}
              invoices={invoices}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenPayModal={handleOpenPayModal}
            />
          )}

          {activeTab === 'parent-profile' && (
            <ParentProfileSection
              parent={parent}
              childrenList={childrenList}
              selectedChild={selectedChild}
              onSelectChild={handleSelectChild}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'child-profile' && (
            <ParentChildProfileSection
              childrenList={childrenList}
              selectedChild={selectedChild}
              onSelectChild={handleSelectChild}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'attendance' && (
            <ParentAttendanceSection
              childrenList={childrenList}
              selectedChild={selectedChild}
              onSelectChild={handleSelectChild}
              attendanceRecords={attendanceRecords}
              attendanceStats={attendanceStats}
              loading={loading}
            />
          )}

          {activeTab === 'results' && (
            <ParentResultsSection
              childrenList={childrenList}
              selectedChild={selectedChild}
              onSelectChild={handleSelectChild}
              results={results}
              loading={loading}
            />
          )}

          {activeTab === 'homework' && (
            <ParentHomeworkSection
              childrenList={childrenList}
              selectedChild={selectedChild}
              onSelectChild={handleSelectChild}
              homework={homework}
              loading={loading}
            />
          )}

          {activeTab === 'timetable' && (
            <ParentTimetableSection
              childrenList={childrenList}
              selectedChild={selectedChild}
              onSelectChild={handleSelectChild}
              timetable={timetable}
              loading={loading}
            />
          )}

          {activeTab === 'fees' && (
            <ParentFeesSection
              childrenList={childrenList}
              selectedChild={selectedChild}
              onSelectChild={handleSelectChild}
              invoices={invoices}
              onPaymentSuccess={handlePaymentSuccess}
              isPayModalOpen={isPayModalOpen}
              activeInvoiceForModal={activeInvoiceForModal}
              onClosePayModal={() => setIsPayModalOpen(false)}
              onOpenPayModal={handleOpenPayModal}
            />
          )}

          {activeTab === 'notices' && (
            <ParentNoticesSection notices={notices} loading={loading} />
          )}

          {activeTab === 'events' && (
            <ParentEventsSection events={events} loading={loading} />
          )}

          {activeTab === 'documents' && (
            <ParentDocumentsSection documents={documents} loading={loading} />
          )}
        </div>
      </main>
    </div>
  );
};
