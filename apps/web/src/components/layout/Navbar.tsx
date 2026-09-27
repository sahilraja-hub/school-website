import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Menu,
  X,
  UserCheck,
  LogOut,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Calendar,
  PhoneCall,
  Bell,
  Building2,
  Users,
  Camera,
  Mail,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '@school/shared';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [campusDropdownOpen, setCampusDropdownOpen] = useState(false);

  const { user, logout, quickLoginAs } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleRoleSwitch = async (role: UserRole) => {
    await quickLoginAs(role);
    setDemoMenuOpen(false);
    navigate(`/portal/${role.toLowerCase()}`);
  };

  const getPortalPath = () => {
    if (!user) return '/login';
    return `/portal/${user.role.toLowerCase()}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Notification / Hotline Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-gold-500/20 text-gold-400 font-semibold px-2 py-0.5 rounded-full text-[11px] border border-gold-500/30">
              <Sparkles className="w-3 h-3 text-gold-400" /> Admissions Open
            </span>
            <span className="hidden md:inline text-slate-400">Applications now accepted for 2026-2027 Academic Cohort.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-slate-400">
              <PhoneCall className="w-3 h-3 text-crest-400" /> +1 (800) 555-OAKRIDGE
            </span>
            <span className="hidden lg:inline text-slate-500">|</span>
            {/* Quick One-Click Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center gap-1.5 bg-crest-950/80 hover:bg-crest-900 border border-crest-700/50 text-crest-300 px-2 py-0.5 rounded text-[11px] font-medium transition-colors"
                title="Quick demo access across all 4 RBAC roles"
              >
                <ShieldCheck className="w-3 h-3 text-gold-400" />
                <span>Demo Switcher</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 z-50">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-semibold text-slate-400 tracking-wider border-b border-slate-800">
                    Switch Active Role
                  </div>
                  <button
                    onClick={() => handleRoleSwitch('ADMIN')}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-crest-800/40 flex items-center justify-between"
                  >
                    <span>🛡️ Principal (Admin)</span>
                    <span className="text-[10px] text-crest-400 font-mono">RBAC</span>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('TEACHER')}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-crest-800/40 flex items-center justify-between"
                  >
                    <span>🔬 Faculty (Teacher)</span>
                    <span className="text-[10px] text-emerald-400 font-mono">RBAC</span>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('STUDENT')}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-crest-800/40 flex items-center justify-between"
                  >
                    <span>🎓 Scholar (Student)</span>
                    <span className="text-[10px] text-sky-400 font-mono">RBAC</span>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('PARENT')}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-crest-800/40 flex items-center justify-between"
                  >
                    <span>👨‍👩‍👧 Parent / Guardian</span>
                    <span className="text-[10px] text-amber-400 font-mono">RBAC</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="glass-panel border-b border-slate-200/80 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* School Crest Brand */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-crest-900 to-crest-700 p-2 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center border border-crest-500/20">
                <img src="/favicon.svg" alt="Oakridge Crest" className="w-8 h-8" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-crest-700 transition-colors">
                  OAKRIDGE
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-500 font-medium -mt-1">
                  International Academy
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {/* Home */}
              <Link
                to="/"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === '/' ? 'text-crest-700 bg-crest-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Home
              </Link>

              {/* About Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setAboutDropdownOpen(true)}
                onMouseLeave={() => setAboutDropdownOpen(false)}
              >
                <button
                  className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    ['/about', '/principal', '/facilities'].includes(location.pathname)
                      ? 'text-crest-700 bg-crest-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <span>About</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {aboutDropdownOpen && (
                  <div className="absolute left-0 mt-1 w-56 rounded-2xl bg-white shadow-modal border border-slate-200 py-2 z-50 animate-slide-down">
                    <Link
                      to="/about"
                      onClick={() => setAboutDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-crest-700"
                    >
                      <Building2 className="w-4 h-4 text-crest-600" />
                      <div>
                        <span>About Oakridge</span>
                        <p className="text-[10px] text-slate-400 font-normal">History & Core Values</p>
                      </div>
                    </Link>
                    <Link
                      to="/principal"
                      onClick={() => setAboutDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-crest-700"
                    >
                      <Award className="w-4 h-4 text-gold-500" />
                      <div>
                        <span>Principal's Message</span>
                        <p className="text-[10px] text-slate-400 font-normal">Welcome from Dr. Vance</p>
                      </div>
                    </Link>
                    <Link
                      to="/facilities"
                      onClick={() => setAboutDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-crest-700"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span>Campus & Facilities</span>
                        <p className="text-[10px] text-slate-400 font-normal">40-Acre Campus Tour</p>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Academics */}
              <Link
                to="/academics"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === '/academics' ? 'text-crest-700 bg-crest-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Academics
              </Link>

              {/* Admissions */}
              <Link
                to="/admissions"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === '/admissions' ? 'text-crest-700 bg-crest-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Admissions
              </Link>

              {/* Faculty */}
              <Link
                to="/faculty"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === '/faculty' ? 'text-crest-700 bg-crest-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Faculty
              </Link>

              {/* Campus Life Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setCampusDropdownOpen(true)}
                onMouseLeave={() => setCampusDropdownOpen(false)}
              >
                <button
                  className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    ['/gallery', '/events', '/notices'].includes(location.pathname)
                      ? 'text-crest-700 bg-crest-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <span>Campus Life</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {campusDropdownOpen && (
                  <div className="absolute left-0 mt-1 w-56 rounded-2xl bg-white shadow-modal border border-slate-200 py-2 z-50 animate-slide-down">
                    <Link
                      to="/gallery"
                      onClick={() => setCampusDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-crest-700"
                    >
                      <Camera className="w-4 h-4 text-crest-600" />
                      <div>
                        <span>Photo Gallery</span>
                        <p className="text-[10px] text-slate-400 font-normal">Campus Life Showcase</p>
                      </div>
                    </Link>
                    <Link
                      to="/events"
                      onClick={() => setCampusDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-crest-700"
                    >
                      <Calendar className="w-4 h-4 text-gold-500" />
                      <div>
                        <span>Upcoming Events</span>
                        <p className="text-[10px] text-slate-400 font-normal">School Master Calendar</p>
                      </div>
                    </Link>
                    <Link
                      to="/notices"
                      onClick={() => setCampusDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-crest-700"
                    >
                      <Bell className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span>Notice Board</span>
                        <p className="text-[10px] text-slate-400 font-normal">Circulars & Announcements</p>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Contact */}
              <Link
                to="/contact"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === '/contact' ? 'text-crest-700 bg-crest-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Contact
              </Link>
            </div>

            {/* Portal Action Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    to={getPortalPath()}
                    className="flex items-center gap-2 bg-crest-700 hover:bg-crest-800 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-subtle transition-colors"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>{user.role} Portal</span>
                  </Link>
                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="p-2 text-slate-500 hover:text-danger-600 hover:bg-danger-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/admissions"
                    className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-semibold px-4 py-2 rounded-xl text-sm transition-colors shadow-subtle"
                  >
                    Apply Now
                  </Link>
                  <Link
                    to="/login"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-2 rounded-xl text-sm transition-colors"
                  >
                    Portal Login
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu with all 11 pages */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-1.5 max-h-[80vh] overflow-y-auto">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-crest-50 hover:text-crest-700"
            >
              Home
            </Link>
            <div className="pt-1 pb-1">
              <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">About Oakridge</span>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 rounded-lg text-sm text-slate-700 hover:bg-crest-50"
              >
                • About the Academy
              </Link>
              <Link
                to="/principal"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 rounded-lg text-sm text-slate-700 hover:bg-crest-50"
              >
                • Principal's Message
              </Link>
              <Link
                to="/facilities"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 rounded-lg text-sm text-slate-700 hover:bg-crest-50"
              >
                • Campus & Facilities
              </Link>
            </div>

            <Link
              to="/academics"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-crest-50 hover:text-crest-700"
            >
              Academics
            </Link>
            <Link
              to="/admissions"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-crest-50 hover:text-crest-700"
            >
              Admissions
            </Link>
            <Link
              to="/faculty"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-crest-50 hover:text-crest-700"
            >
              Faculty & Mentors
            </Link>

            <div className="pt-1 pb-1">
              <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Campus Life</span>
              <Link
                to="/gallery"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 rounded-lg text-sm text-slate-700 hover:bg-crest-50"
              >
                • Photo Gallery
              </Link>
              <Link
                to="/events"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 rounded-lg text-sm text-slate-700 hover:bg-crest-50"
              >
                • Upcoming Events Calendar
              </Link>
              <Link
                to="/notices"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 rounded-lg text-sm text-slate-700 hover:bg-crest-50"
              >
                • Notices & Circulars
              </Link>
            </div>

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-crest-50 hover:text-crest-700"
            >
              Contact & Directions
            </Link>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    to={getPortalPath()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center bg-crest-700 text-white py-2.5 rounded-xl font-semibold"
                  >
                    Go to {user.role} Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center text-slate-600 py-2 rounded-xl border border-slate-200 text-sm"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/admissions"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center bg-gold-500 text-slate-950 font-semibold py-2.5 rounded-xl text-sm"
                  >
                    Apply for 2026-2027
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center bg-slate-900 text-white font-medium py-2.5 rounded-xl text-sm"
                  >
                    Portal Login
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
