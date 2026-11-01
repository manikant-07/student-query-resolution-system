import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  PlusCircle,
  FileQuestion,
  Bell,
  BookOpen,
  User,
  LogOut,
  Cpu,
  Layers,
  Sparkles,
  HelpCircle,
  MessageSquareCheck
} from 'lucide-react';

export function Sidebar() {
  const navigate = useNavigate();
  const { queries, role, mobileMenuOpen, setMobileMenuOpen, logout, currentUser } = useApp();

  const pendingCount = queries.filter(q => q.status === 'Pending').length;
  const answeredCount = queries.filter(q => q.status === 'Answered').length;
  const resolvedCount = queries.filter(q => q.status === 'Resolved').length;

  const dashboardRoute = role === 'admin' ? '/admin' : role === 'faculty' ? '/faculty' : '/student';

  const navItems = [
    {
      to: dashboardRoute,
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      badge: null
    },
    {
      to: "/ask",
      label: "Ask Query",
      icon: <PlusCircle size={18} />,
      badge: "Instant",
      badgeColor: 'var(--primary)',
      textColor: 'var(--bg-main)'
    },
    {
      to: "/queries",
      label: "My Queries",
      icon: <FileQuestion size={18} />,
      badge: queries.length ? `${queries.length}` : null
    },
    {
      to: "/notifications",
      label: "Notifications",
      icon: <Bell size={18} />,
      badge: pendingCount > 0 ? `${pendingCount}` : null,
      badgeColor: 'var(--warning)'
    },
    {
      to: "/faq",
      label: "FAQ & Resources",
      icon: <HelpCircle size={18} />,
      badge: null
    },
    {
      to: "/profile",
      label: "Profile & Settings",
      icon: <User size={18} />,
      badge: null
    },
    {
      to: "/ai-lab",
      label: "AI Algorithm Lab",
      icon: <Cpu size={18} />,
      badge: "Modules 1-4"
    },
    {
      to: "/viva",
      label: "Architecture & Viva",
      icon: <BookOpen size={18} />,
      badge: "Q&A"
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.55)',
            zIndex: 40,
            backdropFilter: 'blur(4px)'
          }}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`sidebar-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}
        style={{
          width: '260px',
          background: 'var(--bg-sidebar)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.5rem 1.15rem',
          flexShrink: 0,
          transition: 'transform 250ms ease-out, background 200ms, border-color 200ms',
          zIndex: 45
        }}
      >
        <div>
          {/* Main Navigation */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text-muted)',
                padding: '0 0.75rem',
                marginBottom: '0.65rem'
              }}
            >
              Main Menu
            </p>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setMobileMenuOpen(false)}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.68rem 0.95rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.885rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 150ms',
                    background: isActive ? 'var(--primary-light)' : 'transparent',
                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                    border: isActive ? '1px solid var(--border-accent)' : '1px solid transparent',
                    boxShadow: isActive ? '0 2px 10px var(--primary-glow)' : 'none'
                  })}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        background: item.badgeColor || 'var(--primary-light)',
                        color: item.textColor || 'var(--text-primary)'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Real-time Query Pipeline Overview */}
          <div
            className="glass-card"
            style={{
              borderRadius: 'var(--radius-lg)',
              padding: '1.15rem',
              marginBottom: '1rem',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <Layers size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Resolution Engine
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.785rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Pending Review</span>
                <span style={{ fontWeight: 700, color: 'var(--warning)' }}>{pendingCount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Answered</span>
                <span style={{ fontWeight: 700, color: 'var(--info)' }}>{answeredCount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Resolved</span>
                <span style={{ fontWeight: 700, color: 'var(--success)' }}>{resolvedCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions: Logout */}
        {currentUser && (
          <button
            onClick={logout}
            className="btn btn-secondary btn-sm btn-pill"
            style={{
              width: '100%',
              justifyContent: 'center',
              color: 'var(--danger)',
              borderColor: 'var(--border)'
            }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        )}
      </aside>

      <style>{`
        @media (max-width: 900px) {
          .sidebar-nav {
            position: fixed !important;
            top: 0;
            bottom: 0;
            left: 0;
            transform: translateX(-100%);
            box-shadow: var(--shadow-xl);
          }
          .sidebar-nav.mobile-open {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
