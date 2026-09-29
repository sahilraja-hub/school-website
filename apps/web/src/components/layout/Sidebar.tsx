import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  CheckCircle2,
  Award,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  FileText,
  DollarSign,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '@school/shared';

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  className = '',
}) => {
  const { user } = useAuth();
  const location = useLocation();

  const getNavLinks = (role?: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return [
          { name: 'Dashboard', path: '/portal/admin', icon: LayoutDashboard },
          { name: 'Admissions Pipeline', path: '/portal/admin', icon: FileCheck, badge: '3' },
          { name: 'Scholars & Students', path: '/portal/admin', icon: GraduationCap },
          { name: 'Faculty Registry', path: '/portal/admin', icon: Users },
          { name: 'Classes & Sections', path: '/portal/admin', icon: BookOpen },
          { name: 'Notice Broadcaster', path: '/notices', icon: Bell },
        ];
      case 'TEACHER':
        return [
          { name: 'Faculty Workspace', path: '/portal/teacher', icon: LayoutDashboard },
          { name: 'Daily Attendance', path: '/portal/teacher', icon: CheckCircle2 },
          { name: 'Assignments & Marks', path: '/portal/teacher', icon: Award },
          { name: 'Academic Schedule', path: '/portal/teacher', icon: Calendar },
          { name: 'Bulletin Circulars', path: '/notices', icon: Bell },
        ];
      case 'STUDENT':
        return [
          { name: 'Scholar Portal', path: '/portal/student', icon: LayoutDashboard },
          { name: 'Attendance Record', path: '/portal/student', icon: CheckCircle2 },
          { name: 'My Gradebook', path: '/portal/student', icon: Award },
          { name: 'Course Timetable', path: '/portal/student', icon: Calendar },
          { name: 'School Bulletin', path: '/notices', icon: Bell },
        ];
      case 'PARENT':
        return [
          { name: 'Guardian Portal', path: '/portal/parent', icon: LayoutDashboard },
          { name: 'Child Progress', path: '/portal/parent', icon: Award },
          { name: 'Attendance Oversight', path: '/portal/parent', icon: CheckCircle2 },
          { name: 'Conferences & Visits', path: '/portal/parent', icon: Calendar },
          { name: 'Tuition & Billing', path: '/portal/parent', icon: DollarSign },
        ];
      default:
        return [{ name: 'Public Portal', path: '/', icon: LayoutDashboard }];
    }
  };

  const navLinks = getNavLinks(user?.role);

  return (
    <aside
      className={`bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between shrink-0 select-none ${
        collapsed ? 'w-20' : 'w-64'
      } ${className}`}
    >
      <div>
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-crest-700 to-crest-900 p-2 flex items-center justify-center shrink-0 border border-crest-500/30">
              <img src="/favicon.svg" alt="R.B.S. School Crest" className="w-6 h-6" />
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-serif text-base font-bold text-white tracking-wide truncate">
                  R.B.S. SCHOOL
                </span>
                <span className="text-[9px] uppercase tracking-widest text-gold-400 font-semibold truncate -mt-1">
                  Portal Console
                </span>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden lg:block"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Role Identity Tag */}
        {!collapsed && user && (
          <div className="px-4 py-3 mx-3 my-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                Access Level
              </span>
              <span className="text-xs font-bold text-white truncate block">
                {user.role} Console
              </span>
            </div>
          </div>
        )}

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          {navLinks.map((item, idx) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={idx}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-crest-700 text-white shadow-subtle'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
                title={collapsed ? item.name : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                {!collapsed && <span className="truncate flex-1">{item.name}</span>}
                {!collapsed && item.badge && (
                  <span className="bg-crest-950 text-crest-300 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full border border-crest-700">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Link */}
      <div className="p-3 border-t border-slate-800">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
          title={collapsed ? 'Public Site' : undefined}
        >
          <BookOpen className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Public Website</span>}
        </Link>
      </div>
    </aside>
  );
};
