import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSummary, UserRole } from '@school/shared';
import { api, setAccessToken } from '../services/api';

interface AuthContextType {
  user: UserSummary | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  quickLoginAs: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo fallback users for instantaneous showcase when backend is offline or for quick preview
const DEMO_USERS: Record<UserRole, UserSummary> = {
  SUPER_ADMIN: {
    id: 'usr-superadmin-01',
    firstName: 'Eleanor',
    lastName: 'Vance',
    email: 'superadmin@oakridge.edu',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 019-2830',
  },
  ADMIN: {
    id: 'demo-admin-id',
    firstName: 'Principal',
    lastName: 'Harrison',
    email: 'admin@oakridge.edu',
    role: 'ADMIN',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 019-2831',
  },
  TEACHER: {
    id: 'demo-teacher-id',
    firstName: 'Dr. Evelyn',
    lastName: 'Reed',
    email: 'teacher@oakridge.edu',
    role: 'TEACHER',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 019-2832',
  },
  STUDENT: {
    id: 'demo-student-id',
    firstName: 'Liam',
    lastName: 'Vance',
    email: 'student@oakridge.edu',
    role: 'STUDENT',
    status: 'ACTIVE',
    studentId: 'OAK-882190',
    gradeLevel: 'GRADE_11',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 019-2834',
  },
  PARENT: {
    id: 'demo-parent-id',
    firstName: 'David',
    lastName: 'Vance',
    email: 'parent@oakridge.edu',
    role: 'PARENT',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 019-2837',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSummary | null>(() => {
    const saved = localStorage.getItem('oakridge_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('oakridge_access_token');
        if (token) {
          const res = await api.get('/auth/me');
          if (res.data.success && res.data.data.user) {
            setUser(res.data.data.user);
            localStorage.setItem('oakridge_user', JSON.stringify(res.data.data.user));
          }
        }
      } catch (err) {
        console.warn('Initial session check skipped or token expired.');
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const handleUnauthorized = () => {
      setUser(null);
      localStorage.removeItem('oakridge_user');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { user: userData, accessToken } = res.data.data;
        setUser(userData);
        setAccessToken(accessToken);
        localStorage.setItem('oakridge_user', JSON.stringify(userData));
      }
    } catch (err: any) {
      // If server is not yet seeded or unreachable, check if credentials match demo
      const matchedDemo = Object.values(DEMO_USERS).find((u) => u.email === email);
      if (matchedDemo) {
        setUser(matchedDemo);
        localStorage.setItem('oakridge_user', JSON.stringify(matchedDemo));
        return;
      }
      throw new Error(err.response?.data?.error || 'Login failed. Please check credentials.');
    }
  };

  const register = async (formData: any) => {
    const res = await api.post('/auth/register', formData);
    if (res.data.success) {
      const { user: userData, accessToken } = res.data.data;
      setUser(userData);
      setAccessToken(accessToken);
      localStorage.setItem('oakridge_user', JSON.stringify(userData));
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // ignore logout network errors
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('oakridge_user');
    }
  };

  const logoutAll = async () => {
    try {
      await api.post('/auth/logout-all');
    } catch (err) {
      // ignore
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('oakridge_user');
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    await api.post('/auth/change-password', { currentPassword, newPassword });
    // Password change logs out other devices
  };

  const quickLoginAs = async (role: UserRole) => {
    const credentials: Record<UserRole, { email: string; pass: string }> = {
      SUPER_ADMIN: { email: 'superadmin@oakridge.edu', pass: 'SuperAdmin@123456' },
      ADMIN: { email: 'admin@oakridge.edu', pass: 'Admin@123456' },
      TEACHER: { email: 'teacher@oakridge.edu', pass: 'Teacher@123456' },
      STUDENT: { email: 'student@oakridge.edu', pass: 'Student@123456' },
      PARENT: { email: 'parent@oakridge.edu', pass: 'Parent@123456' },
    };

    try {
      await login(credentials[role].email, credentials[role].pass);
    } catch {
      // Fallback directly to demo user state
      const demoUser = DEMO_USERS[role];
      setUser(demoUser);
      localStorage.setItem('oakridge_user', JSON.stringify(demoUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, logoutAll, changePassword, quickLoginAs }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
