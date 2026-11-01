import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  UserCheck, 
  GraduationCap, 
  ShieldCheck,
  Menu, 
  X, 
  Sun, 
  Moon,
  LogIn,
  LogOut,
  User
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { NotificationBell } from './NotificationBell';
import { UserAvatar } from './UserAvatar';

export function Navbar() {
  const navigate = useNavigate();
  const { 
    role, 
    setRole, 
    studentUser, 
    facultyUser, 
    currentUser,
    userProfile,
    logout,
    openAuthModal,
    openOnboardingModal,
    queries, 
    mobileMenuOpen, 
    setMobileMenuOpen,
    theme,
    toggleTheme
  } = useApp();

  const pendingCount = queries.filter(q => q.status === 'Pending').length;

  return (
    <header
      style={{
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '0.75rem 1.5rem',
        transition: 'background 200ms, border-color 200ms'
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
              border: '1px solid var(--border)',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            id="mobile-nav-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 2px 6px rgba(23, 63, 53, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}
            >
              <Sparkles size={20} color="var(--accent-copper)" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', letterSpacing: '-0.01em' }}>
                  Student Query Resolution System
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    border: '1px solid var(--border)',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  Academic ERP
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                University Academic Resolution & AI Decision System
              </p>
            </div>
          </Link>
        </div>

        {/* Action Controls & Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Role Switcher Pill */}
          <div
            className="role-toggle-bar"
            style={{
              background: 'var(--bg-subtle)',
              padding: '3px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              border: '1px solid var(--border)'
            }}
          >
            <button
              onClick={() => {
                setRole('student');
                navigate('/student');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '9px',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 150ms',
                background: role === 'student' ? 'var(--bg-card)' : 'transparent',
                color: role === 'student' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: role === 'student' ? 'var(--shadow-xs)' : 'none'
              }}
            >
              <GraduationCap size={15} />
              <span>Student</span>
            </button>
            <button
              onClick={() => {
                setRole('faculty');
                navigate('/faculty');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '9px',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 150ms',
                background: role === 'faculty' ? 'var(--bg-card)' : 'transparent',
                color: role === 'faculty' ? 'var(--accent-purple)' : 'var(--text-muted)',
                boxShadow: role === 'faculty' ? 'var(--shadow-xs)' : 'none'
              }}
            >
              <UserCheck size={15} />
              <span>Faculty</span>
              {pendingCount > 0 && (
                <span
                  style={{
                    background: '#ef4444',
                    color: '#fff',
                    borderRadius: '50%',
                    padding: '1px 5px',
                    fontSize: '0.62rem'
                  }}
                >
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setRole('admin');
                navigate('/admin');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '9px',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 150ms',
                background: role === 'admin' ? 'var(--bg-card)' : 'transparent',
                color: role === 'admin' ? '#4338ca' : 'var(--text-muted)',
                boxShadow: role === 'admin' ? 'var(--shadow-xs)' : 'none'
              }}
            >
              <ShieldCheck size={15} />
              <span>Admin</span>
            </button>
          </div>

          {/* Real-time Notifications Bell */}
          <NotificationBell />

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="theme-toggle-btn"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun size={15} color="#f59e0b" style={{ filter: 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.4))' }} />
            ) : (
              <Moon size={15} color="#4f46e5" />
            )}
          </button>

          {/* User Status: Logged in Persona or Sign In CTA */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.3rem 0.75rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px'
                }}
                className="persona-chip"
              >
                <UserAvatar
                  user={currentUser}
                  profile={userProfile}
                  size="sm"
                />
                <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                    {userProfile?.full_name || currentUser.displayName || currentUser?.user_metadata?.full_name || currentUser.email}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    {role.toUpperCase()} • {userProfile?.enrollment_number || 'Google Verified'}
                  </div>
                </div>
              </div>

              {role === 'student' && userProfile && !userProfile.is_profile_complete && (
                <button
                  onClick={openOnboardingModal}
                  className="btn btn-warning btn-sm"
                  style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem' }}
                  title="Complete required college profile details"
                >
                  Complete Profile
                </button>
              )}

              <button
                onClick={logout}
                title="Sign out of portal"
                className="btn btn-secondary btn-sm"
                style={{ color: 'var(--danger)', borderColor: 'var(--border)' }}
              >
                <LogOut size={14} />
                <span className="btn-text-responsive">Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <button
                onClick={() => openAuthModal('login')}
                className="btn btn-secondary btn-sm"
                style={{ gap: '0.35rem' }}
              >
                <LogIn size={14} />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="btn btn-primary btn-sm"
                style={{ gap: '0.35rem' }}
              >
                <User size={14} />
                <span>Register</span>
              </button>
            </div>
          )}
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
          .btn-text-responsive {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
