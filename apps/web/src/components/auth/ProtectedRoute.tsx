import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '@school/shared';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
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

  if (allowedRoles && !allowedRoles.includes(user.role)) {
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
          <a
            href={`/portal/${user.role.toLowerCase()}`}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-crest-700 text-white font-semibold text-sm hover:bg-crest-800 transition-colors"
          >
            Go to Your {user.role} Portal
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
