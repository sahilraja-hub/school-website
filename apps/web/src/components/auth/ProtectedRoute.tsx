import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '@school/shared';
import { ShieldAlert, AlertTriangle, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-crest-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 text-sm font-medium">Verifying credentials & RBAC permissions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Account Status Check (Suspended or Locked)
  if (user.status && user.status !== 'ACTIVE') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-red-200 text-center space-y-4">
          <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Account {user.status === 'SUSPENDED' ? 'Suspended' : 'Restricted'}
          </h2>
          <p className="text-slate-600 text-sm">
            Your account status is currently <span className="font-bold text-red-600">{user.status}</span>.
            Access to the school portal has been restricted. Please contact the administrator.
          </p>
          <div className="pt-2">
            <Button variant="outline" onClick={logout} className="w-full gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Role-Based Access Control (SUPER_ADMIN has universal access)
  const isAuthorized =
    !allowedRoles ||
    user.role === 'SUPER_ADMIN' ||
    allowedRoles.includes(user.role);

  if (!isAuthorized) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full glass-panel p-8 rounded-2xl text-center shadow-lg border border-red-200">
          <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied (403 RBAC)</h2>
          <p className="text-slate-600 text-sm mb-6">
            Your role (<span className="font-semibold text-slate-800">{user.role}</span>) does not have authorization to view this section.
          </p>
          <Link
            to={user.role === 'SUPER_ADMIN' ? '/portal/admin' : `/portal/${user.role.toLowerCase()}`}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-crest-700 text-white font-semibold text-sm hover:bg-crest-800 transition-colors shadow-sm"
          >
            Go to Your Authorized Portal
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
