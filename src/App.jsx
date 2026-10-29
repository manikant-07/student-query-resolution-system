import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/Toast';

import { LandingPage } from './pages/LandingPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { FacultyDashboard } from './pages/FacultyDashboard';
import { AILabPage } from './pages/AILabPage';
import { ArchitectureVivaPage } from './pages/ArchitectureVivaPage';

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
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
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/faculty" element={<FacultyDashboard />} />
              <Route path="/ai-lab" element={<AILabPage />} />
              <Route path="/viva" element={<ArchitectureVivaPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          {/* Global Alert & Toast Notifications */}
          <ToastContainer />
        </div>
      </AppProvider>
    </HashRouter>
  );
}
