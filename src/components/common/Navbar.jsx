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
  User,
  HelpCircle,
  Cpu,
  BookOpen
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { NotificationBell } from './NotificationBell';
import { UserAvatar } from './UserAvatar';

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
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
        background: 'var(--bg-nav)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '0.85rem 2rem',
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
          gap: '1.25rem'
        }}
      >
        {/* Brand Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn-ghost"
            style={{
              display: 'none',
              padding: '6px',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
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
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#060D09',
                boxShadow: '0 4px 16px var(--primary-glow)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                position: 'relative'
              }}
            >
              <Sparkles size={22} color={theme === 'dark' ? '#060D09' : '#ffffff'} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '-0.03em'
                  }}
                >
                  Solve<span style={{ color: 'var(--primary)' }}>Hub</span>
                </span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    border: '1px solid var(--border)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  Query Resolution
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Desktop Anchor Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
          }}
          className="desktop-nav-links"
        >
          <Link
            to="/"
            style={{
              fontSize: '0.885rem',
              fontWeight: 600,
              color: location.pathname === '/' ? 'var(--primary)' : 'var(--text-secondary)',
              transition: 'color var(--transition-fast)'
            }}
          >
            Home
          </Link>
          <a
            href="#features"
            style={{
              fontSize: '0.885rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              transition: 'color var(--transition-fast)'
            }}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            style={{
              fontSize: '0.885rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              transition: 'color var(--transition-fast)'
            }}
          >
            How it Works
          </a>
          <Link
            to="/faq"
            style={{
              fontSize: '0.885rem',
              fontWeight: 600,
              color: location.pathname === '/faq' ? 'var(--primary)' : 'var(--text-secondary)',
              transition: 'color var(--transition-fast)'
            }}
          >
            FAQ
          </Link>
          <Link
            to="/ai-lab"
            style={{
              fontSize: '0.885rem',
              fontWeight: 600,
              color: location.pathname === '/ai-lab' ? 'var(--primary)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Cpu size={15} />
            <span>AI Lab</span>
          </Link>
          <Link
            to="/viva"
            style={{
              fontSize: '0.885rem',
              fontWeight: 600,
              color: location.pathname === '/viva' ? 'var(--primary)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <BookOpen size={15} />
            <span>Viva</span>
          </Link>
        </nav>

        {/* Action Controls & Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Role Switcher Pill Bar */}
          <div
            className="role-toggle-bar"
            style={{
              background: 'var(--bg-card)',
              padding: '3px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              border: '1px solid var(--border)',
              backdropFilter: 'blur(12px)'
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
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 160ms',
                background: role === 'student' ? 'var(--primary)' : 'transparent',
                color: role === 'student' ? (theme === 'dark' ? '#060D09' : '#ffffff') : 'var(--text-muted)',
                boxShadow: role === 'student' ? '0 2px 8px var(--primary-glow)' : 'none'
              }}
            >
              <GraduationCap size={14} />
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
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 160ms',
                background: role === 'faculty' ? 'var(--primary)' : 'transparent',
                color: role === 'faculty' ? (theme === 'dark' ? '#060D09' : '#ffffff') : 'var(--text-muted)',
                boxShadow: role === 'faculty' ? '0 2px 8px var(--primary-glow)' : 'none'
              }}
            >
              <UserCheck size={14} />
              <span>Mentor</span>
              {pendingCount > 0 && (
                <span
                  style={{
                    background: 'var(--danger)',
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
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 160ms',
                background: role === 'admin' ? 'var(--primary)' : 'transparent',
                color: role === 'admin' ? (theme === 'dark' ? '#060D09' : '#ffffff') : 'var(--text-muted)',
                boxShadow: role === 'admin' ? '0 2px 8px var(--primary-glow)' : 'none'
              }}
            >
              <ShieldCheck size={14} />
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
              <Sun size={17} color="#B6F36B" />
            ) : (
              <Moon size={17} color="#8B5CF6" />
            )}
          </button>

          {/* User Status: Logged in Persona or Sign In CTA */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.3rem 0.75rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-full)',
                  backdropFilter: 'blur(10px)',
                  textDecoration: 'none'
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
                    {role.toUpperCase()}
                  </div>
                </div>
              </Link>

              {role === 'student' && userProfile && !userProfile.is_profile_complete && (
                <button
                  onClick={openOnboardingModal}
                  className="btn btn-warning btn-sm btn-pill"
                  style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem' }}
                  title="Complete profile"
                >
                  Verify
                </button>
              )}

              <button
                onClick={logout}
                title="Sign out of SolveHub"
                className="btn btn-secondary btn-sm btn-pill"
                style={{ color: 'var(--danger)', borderColor: 'var(--border)' }}
              >
                <LogOut size={14} />
                <span className="btn-text-responsive">Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => openAuthModal('login')}
                className="btn btn-secondary btn-sm btn-pill"
                style={{ gap: '0.35rem' }}
              >
                <LogIn size={14} />
                <span>Login</span>
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="btn btn-primary btn-sm btn-pill"
                style={{ gap: '0.35rem' }}
              >
                <span>Get Started</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .desktop-nav-links {
            display: none !important;
          }
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
