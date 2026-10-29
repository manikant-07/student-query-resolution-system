import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  UserCheck, 
  GraduationCap, 
  RotateCcw, 
  Menu, 
  X, 
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar() {
  const { 
    role, 
    setRole, 
    studentUser, 
    facultyUser, 
    queries, 
    resetDemoData, 
    mobileMenuOpen, 
    setMobileMenuOpen 
  } = useApp();

  const pendingCount = queries.filter(q => q.status === 'Pending').length;

  return (
    <header
      style={{
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '0.75rem 1.5rem'
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        {/* Brand & Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn-ghost"
            style={{
              display: 'none',
              padding: '6px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            id="mobile-nav-toggle"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}
            >
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>
                  Student Query Resolution System
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    background: '#eff6ff',
                    color: '#2563eb',
                    border: '1px solid #bfdbfe',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    textTransform: 'uppercase'
                  }}
                >
                  AI Powered
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                Ask Smarter. Resolve Faster. • College AI Project
              </p>
            </div>
          </Link>
        </div>

        {/* Action Controls & Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Role Switcher Pill */}
          <div
            style={{
              background: '#f1f5f9',
              padding: '3px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #e2e8f0'
            }}
          >
            <button
              onClick={() => setRole('student')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '9px',
                border: 'none',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 150ms',
                background: role === 'student' ? '#ffffff' : 'transparent',
                color: role === 'student' ? '#2563eb' : '#64748b',
                boxShadow: role === 'student' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <GraduationCap size={15} />
              <span>Student Mode</span>
            </button>
            <button
              onClick={() => setRole('faculty')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '9px',
                border: 'none',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 150ms',
                background: role === 'faculty' ? '#ffffff' : 'transparent',
                color: role === 'faculty' ? '#7c3aed' : '#64748b',
                boxShadow: role === 'faculty' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <UserCheck size={15} />
              <span>Faculty Mode</span>
              {pendingCount > 0 && (
                <span
                  style={{
                    background: '#ef4444',
                    color: '#fff',
                    borderRadius: '50%',
                    padding: '1px 5px',
                    fontSize: '0.65rem'
                  }}
                >
                  {pendingCount}
                </span>
              )}
            </button>
          </div>

          {/* User Persona Chip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.35rem 0.8rem',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px'
            }}
            className="persona-chip"
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: role === 'student' ? '#eff6ff' : '#f5f3ff',
                color: role === 'student' ? '#2563eb' : '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.75rem'
              }}
            >
              {role === 'student' ? 'MK' : 'RS'}
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }}>
                {role === 'student' ? studentUser.name : facultyUser.name}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                {role === 'student' ? studentUser.roll : facultyUser.department}
              </div>
            </div>
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={resetDemoData}
            title="Reset to default queries & FAQs"
            className="btn btn-secondary btn-sm"
            style={{ color: '#64748b', gap: '0.35rem' }}
          >
            <RotateCcw size={14} />
            <span style={{ fontSize: '0.775rem' }}>Reset Demo</span>
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #mobile-nav-toggle {
            display: flex !important;
          }
          .persona-chip {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
