import React from 'react';
import { Menu, Search, ShieldCheck } from 'lucide-react';
import { NotificationsUI } from './NotificationsUI';
import { UserMenu } from './UserMenu';
import { Breadcrumb } from '../ui/Breadcrumb';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

export interface DashboardTopbarProps {
  onOpenMobileMenu: () => void;
}

export const DashboardTopbar: React.FC<DashboardTopbarProps> = ({ onOpenMobileMenu }) => {
  const { user } = useAuth();
  const location = useLocation();

  const getBreadcrumbs = () => {
    const parts = location.pathname.split('/').filter(Boolean);
    return parts.map((p, idx) => ({
      label: p.charAt(0).toUpperCase() + p.slice(1),
      href: '/' + parts.slice(0, idx + 1).join('/'),
    }));
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <Breadcrumb items={getBreadcrumbs()} />
        </div>
      </div>

      {/* Right: Actions, Notifications, User Menu */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick Search trigger (visual design element) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-xs w-56 cursor-pointer hover:border-slate-300 transition-colors">
          <Search className="w-3.5 h-3.5" />
          <span>Quick search... (⌘K)</span>
        </div>

        {/* Notifications Popover */}
        <NotificationsUI />

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        {/* User Profile Dropdown */}
        <UserMenu />
      </div>
    </header>
  );
};
