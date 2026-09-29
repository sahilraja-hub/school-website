import React from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  GraduationCap,
  Users,
  Briefcase,
  UserCheck,
  Layers,
  Grid,
  BookOpen,
  Clock,
  CheckSquare,
  FileText,
  Award,
  Bookmark,
  Bell,
  Calendar,
  Image,
  FolderOpen,
  CreditCard,
  Settings,
  ShieldAlert,
  LogOut,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { AdminSection } from './types';
import { useAuth } from '../../../context/AuthContext';

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  pendingAdmissionsCount?: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavGroup {
  label: string;
  items: Array<{
    id: AdminSection;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    superAdminOnly?: boolean;
  }>;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  onSelectSection,
  pendingAdmissionsCount = 0,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const { user, logout } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const navGroups: NavGroup[] = [
    {
      label: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        {
          id: 'admissions',
          label: 'Admissions',
          icon: ClipboardList,
          badge: pendingAdmissionsCount > 0 ? pendingAdmissionsCount : undefined,
        },
      ],
    },
    {
      label: 'PEOPLE',
      items: [
        { id: 'students', label: 'Students', icon: GraduationCap },
        { id: 'parents', label: 'Parents', icon: Users },
        { id: 'teachers', label: 'Teachers', icon: Briefcase },
        { id: 'users', label: 'Users & Roles', icon: UserCheck, superAdminOnly: false },
      ],
    },
    {
      label: 'ACADEMICS',
      items: [
        { id: 'classes', label: 'Classes', icon: Layers },
        { id: 'sections', label: 'Sections', icon: Grid },
        { id: 'subjects', label: 'Subjects', icon: BookOpen },
        { id: 'timetable', label: 'Timetable', icon: Clock },
        { id: 'attendance', label: 'Attendance', icon: CheckSquare },
        { id: 'exams', label: 'Exams', icon: FileText },
        { id: 'results', label: 'Results', icon: Award },
        { id: 'homework', label: 'Homework', icon: Bookmark },
      ],
    },
    {
      label: 'COMMUNICATION & MEDIA',
      items: [
        { id: 'notices', label: 'Notices', icon: Bell },
        { id: 'events', label: 'Events', icon: Calendar },
        { id: 'gallery', label: 'Gallery', icon: Image },
        { id: 'documents', label: 'Documents', icon: FolderOpen },
      ],
    },
    {
      label: 'FINANCE & CONTROL',
      items: [
        { id: 'fees', label: 'Fees & Invoices', icon: CreditCard },
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'audit-logs', label: 'Audit Logs', icon: ShieldAlert },
      ],
    },
  ];

  const handleItemClick = (section: AdminSection) => {
    onSelectSection(section);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy-950/70 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col bg-navy-900 text-slate-200 shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="flex h-18 items-center border-b border-navy-800 px-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/15 border border-gold-500/30 text-gold-400 font-serif font-bold text-xl shadow-inner">
              R
            </div>
            <div>
              <h2 className="font-serif text-sm font-bold tracking-tight text-white">
                R.B.S Public School
              </h2>
              <div className="flex items-center space-x-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-2xs font-medium text-slate-400">
                  {isSuperAdmin ? 'Super Admin Portal' : 'Admin Operations'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 scrollbar-thin scrollbar-thumb-navy-700">
          {navGroups.map((group) => {
            const filteredItems = group.items.filter(
              (item) => !item.superAdminOnly || isSuperAdmin
            );
            if (filteredItems.length === 0) return null;

            return (
              <div key={group.label} className="space-y-1">
                <p className="px-3 text-2xs font-semibold uppercase tracking-wider text-slate-500">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {filteredItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleItemClick(item.id)}
                        className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-gold-500/20 to-gold-600/10 text-gold-300 font-semibold border-l-3 border-gold-400 shadow-sm'
                            : 'text-slate-400 hover:bg-navy-800/80 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon
                            className={`h-4 w-4 transition-colors ${
                              isActive ? 'text-gold-400' : 'text-slate-400 group-hover:text-slate-200'
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          {item.badge !== undefined && (
                            <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-3xs font-bold text-amber-300">
                              {item.badge}
                            </span>
                          )}
                          {isActive && <ChevronRight className="h-3.5 w-3.5 text-gold-400" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* User profile footer & Logout */}
        <div className="border-t border-navy-800 p-4">
          <div className="flex items-center justify-between rounded-xl bg-navy-800/60 p-2.5 border border-navy-700/50">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-700 font-bold text-white border border-navy-600">
                {user?.firstName?.[0] || 'A'}
              </div>
              <div className="truncate">
                <p className="truncate text-xs font-semibold text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="truncate text-3xs text-slate-400">{user?.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => logout()}
              title="Sign Out"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-navy-700 hover:text-red-400 transition"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
