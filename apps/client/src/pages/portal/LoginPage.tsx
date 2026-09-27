import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '@school/shared';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, quickLoginAs } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      const saved = localStorage.getItem('oakridge_user');
      const user = saved ? JSON.parse(saved) : null;
      if (from) {
        navigate(from, { replace: true });
      } else if (user) {
        navigate(`/portal/${user.role.toLowerCase()}`, { replace: true });
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: UserRole) => {
    setError('');
    setLoading(true);
    try {
      await quickLoginAs(role);
      navigate(`/portal/${role.toLowerCase()}`);
    } catch (err: any) {
      setError('Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-crest-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-crest-700 to-crest-900 p-2 flex items-center justify-center border border-crest-500/30">
              <img src="/favicon.svg" alt="Oakridge Crest" className="w-8 h-8" />
            </div>
          </Link>
          <h2 className="font-serif text-3xl font-bold text-white tracking-tight">Oakridge Portal</h2>
          <p className="mt-1 text-xs text-slate-400">
            Sign in to access your role-based academic dashboard
          </p>
        </div>

        {/* Demo Fast Login Pills */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gold-400 mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Instant Demo Sign-In (Select Role)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('ADMIN')}
              className="text-left p-2.5 rounded-lg bg-slate-900/80 hover:bg-crest-950 border border-slate-700 hover:border-crest-500 transition-all text-xs"
            >
              <span className="block font-bold text-white">🛡️ Admin</span>
              <span className="text-[10px] text-slate-400">Principal Harrison</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('TEACHER')}
              className="text-left p-2.5 rounded-lg bg-slate-900/80 hover:bg-crest-950 border border-slate-700 hover:border-crest-500 transition-all text-xs"
            >
              <span className="block font-bold text-white">🔬 Teacher</span>
              <span className="text-[10px] text-slate-400">Dr. Evelyn Reed</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('STUDENT')}
              className="text-left p-2.5 rounded-lg bg-slate-900/80 hover:bg-crest-950 border border-slate-700 hover:border-crest-500 transition-all text-xs"
            >
              <span className="block font-bold text-white">🎓 Student</span>
              <span className="text-[10px] text-slate-400">Liam Vance (Gr. 11)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('PARENT')}
              className="text-left p-2.5 rounded-lg bg-slate-900/80 hover:bg-crest-950 border border-slate-700 hover:border-crest-500 transition-all text-xs"
            >
              <span className="block font-bold text-white">👨‍👩‍👧 Parent</span>
              <span className="text-[10px] text-slate-400">David Vance</span>
            </button>
          </div>
        </div>

        {/* Regular Login Form */}
        <div className="glass-panel-dark rounded-2xl p-8 border border-slate-800 shadow-2xl">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-900/30 border border-red-700 text-red-300 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Institutional Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@oakridge.edu"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-crest-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-crest-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-lg bg-gradient-to-r from-crest-600 to-crest-700 hover:from-crest-700 hover:to-crest-800 text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="text-center text-xs text-slate-500">
          <Link to="/" className="hover:text-slate-300 transition-colors">
            ← Return to Oakridge Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};
