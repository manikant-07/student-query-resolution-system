import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/Toast';
import { AuthModal } from './components/auth/AuthModal';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { FacultyDashboard } from './pages/FacultyDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AILabPage } from './pages/AILabPage';
import { ArchitectureVivaPage } from './pages/ArchitectureVivaPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

function AppLayout() {
  const { isAuthModalOpen, closeAuthModal, authModalView } = useApp();

  return (
    <div className="app-container">
      {/* Responsive Sidebar */}
      <Sidebar />

      {/* Main Layout Area */}
      <div className="main-content">
        {/* Top Navigation Bar with Persona & Role Switcher */}
        <Navbar />

        {/* Routed Pages */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/student" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}>
                <StudentDashboard />
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
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </HashRouter>
  );
}
