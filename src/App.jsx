import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/Toast';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingModal } from './components/auth/OnboardingModal';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('SolveHub Application Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          background: 'var(--bg-main, #060D09)',
          color: 'var(--text-primary, #F2FAF4)',
          fontFamily: 'sans-serif'
        }}>
          <div style={{
            background: 'rgba(14, 27, 20, 0.85)',
            border: '1px solid rgba(182, 243, 107, 0.2)',
            borderRadius: '24px',
            padding: '2.5rem',
            maxWidth: '540px',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.6)'
          }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              SolveHub System Notice
            </h2>
            <p style={{ color: '#9DB4A5', marginBottom: '1.5rem', fontSize: '0.925rem', lineHeight: 1.5 }}>
              A temporary issue occurred while rendering. Click below to refresh or return to the main home page.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button 
                onClick={() => window.location.reload()} 
                style={{
                  background: '#B6F36B',
                  color: '#060D09',
                  border: 'none',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  padding: '0.65rem 1.5rem',
                  cursor: 'pointer'
                }}
              >
                Reload SolveHub
              </button>
              <button 
                onClick={() => { window.location.hash = '#/'; window.location.reload(); }} 
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#F2FAF4',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  padding: '0.65rem 1.5rem',
                  cursor: 'pointer'
                }}
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { AskQueryPage } from './pages/AskQueryPage';
import { MyQueriesPage } from './pages/MyQueriesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { FAQPage } from './pages/FAQPage';
import { ProfilePage } from './pages/ProfilePage';
import { StudentDashboard } from './pages/StudentDashboard';
import { FacultyDashboard } from './pages/FacultyDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AILabPage } from './pages/AILabPage';
import { ArchitectureVivaPage } from './pages/ArchitectureVivaPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

function AppLayout() {
  const location = useLocation();
  const isPublicPage = location.pathname === '/' || location.pathname === '/login';

  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalView,
    isOnboardingModalOpen,
    closeOnboardingModal
  } = useApp();

  return (
    <div className={`app-container ${isPublicPage ? 'public-layout' : ''}`}>
      {/* Responsive Sidebar - rendered on dashboard views */}
      {!isPublicPage && <Sidebar />}

      {/* Main Layout Area */}
      <div className="main-content" style={{ paddingBottom: isPublicPage ? 0 : '3rem' }}>
        {/* Top Navigation Bar with Persona & Role Switcher */}
        {!isPublicPage && <Navbar />}

        {/* Routed Pages */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route 
            path="/student" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ask" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
                <AskQueryPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/queries" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
                <MyQueriesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/faculty" 
            element={
              <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                <FacultyDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'faculty']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/ai-lab" element={<AILabPage />} />
          <Route path="/viva" element={<ArchitectureVivaPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Global Alert & Toast Notifications */}
      <ToastContainer />

      {/* Global Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialView={authModalView}
      />

      {/* Google User Profile Completion & Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={closeOnboardingModal}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <AppProvider>
          <AppLayout />
        </AppProvider>
      </HashRouter>
    </ErrorBoundary>
  );
}
