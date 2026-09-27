import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Award, Clock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-left">
      {/* Top Banner Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-crest-600 via-gold-500 to-crest-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: School Identity */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-crest-800 to-crest-600 p-2 flex items-center justify-center">
                <img src="/favicon.svg" alt="Oakridge Crest" className="w-7 h-7" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-white tracking-wide">OAKRIDGE</span>
                <p className="text-[10px] uppercase tracking-widest text-gold-400 font-medium -mt-1">
                  International Academy
                </p>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Cultivating intellectual curiosity, moral leadership, and global perspectives since 1988. Preparing scholars to shape a rapidly evolving world.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
                <Award className="w-3.5 h-3.5 text-gold-400" />
                <span>IB World School</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-crest-400" />
                <span>Cognia Certified</span>
              </div>
            </div>
          </div>

          {/* Column 2: About & Academics */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">About & Academics</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Oakridge</Link></li>
              <li><Link to="/principal" className="hover:text-white transition-colors">Principal's Welcome</Link></li>
              <li><Link to="/academics" className="hover:text-white transition-colors">K-12 Curriculum & AP/IB</Link></li>
              <li><Link to="/faculty" className="hover:text-white transition-colors">Faculty Directory</Link></li>
              <li><Link to="/facilities" className="hover:text-white transition-colors">Campus Facilities & Labs</Link></li>
            </ul>
          </div>

          {/* Column 3: Admissions & Campus Life */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Admissions & Life</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link to="/admissions" className="hover:text-white transition-colors">Apply for 2026-2027</Link></li>
              <li><Link to="/admissions" className="hover:text-white transition-colors">Track Application Status</Link></li>
              <li><Link to="/events" className="hover:text-white transition-colors">Campus Calendar & Events</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Photo & Media Gallery</Link></li>
              <li><Link to="/notices" className="hover:text-white transition-colors">Official Notice Board</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Cambridge Campus</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-crest-400 shrink-0 mt-0.5" />
                <span>450 Academy Way, Cambridge Campus, Seattle, WA 98101</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4 text-crest-400 shrink-0" />
                <span>+1 (800) 555-OAKRIDGE</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-crest-400 shrink-0" />
                <span>admissions@oakridge.edu</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Mon - Fri: 8:00 AM - 4:30 PM PST</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Oakridge International Academy. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/notices" className="hover:text-slate-300 transition-colors">Notice Board</Link>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Directions & Safety</Link>
            <Link to="/design-system" className="hover:text-slate-300 transition-colors">Design System</Link>
            <Link to="/login" className="hover:text-white transition-colors text-crest-400 font-semibold">
              Portal Login →
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
