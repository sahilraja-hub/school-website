import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { AcademicsPage } from './pages/public/AcademicsPage';
import { AdmissionsPage } from './pages/public/AdmissionsPage';
import { AnnouncementsPage } from './pages/public/AnnouncementsPage';
import { ContactPage } from './pages/public/ContactPage';
import { DesignSystemShowcasePage } from './pages/public/DesignSystemShowcasePage';
import { LoginPage } from './pages/portal/LoginPage';
import { AdminDashboard } from './pages/portal/AdminDashboard';
import { TeacherDashboard } from './pages/portal/TeacherDashboard';
import { StudentDashboard } from './pages/portal/StudentDashboard';
import { ParentDashboard } from './pages/portal/ParentDashboard';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ToastProvider } from './components/ui/Toast';

const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          {/* Public Website Pages */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/academics" element={<AcademicsPage />} />
            <Route path="/admissions" element={<AdmissionsPage />} />
            <Route path="/notices" element={<AnnouncementsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/design-system" element={<DesignSystemShowcasePage />} />

            {/* Role-Based Portal Dashboards */}
            <Route
              path="/portal/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portal/teacher"
              element={
                <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}>
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portal/student"
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'TEACHER', 'ADMIN']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portal/parent"
              element={
                <ProtectedRoute allowedRoles={['PARENT', 'ADMIN']}>
                  <ParentDashboard />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Dedicated Login Screen */}
          <Route path="/login" element={<LoginPage />} />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
};

export default App;
