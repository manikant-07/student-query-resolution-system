import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  GraduationCap, 
  Users, 
  Cpu, 
  BookOpen, 
  MessageSquareCheck,
  Sparkles,
  Layers,
  HelpCircle,
  Clock
} from 'lucide-react';

export function Sidebar() {
  const { queries, role, mobileMenuOpen, setMobileMenuOpen } = useApp();

  const pendingCount = queries.filter(q => q.status === 'Pending').length;
  const answeredCount = queries.filter(q => q.status === 'Answered').length;
  const resolvedCount = queries.filter(q => q.status === 'Resolved').length;

  const navItems = [
    {
      to: "/",
      label: "Home / Overview",
      icon: <Home size={19} />,
      badge: null
    },
    {
      to: "/student",
      label: "Student Portal",
      icon: <GraduationCap size={19} />,
      badge: role === 'student' ? `${queries.length}` : null
    },
    {
      to: "/faculty",
      label: "Faculty Dashboard",
      icon: <Users size={19} />,
      badge: pendingCount > 0 ? `${pendingCount} new` : null,
      badgeColor: '#ef4444'
    },
    {
      to: "/ai-lab",
      label: "AI Algorithm Lab",
      icon: <Cpu size={19} />,
      badge: "Modules 1-4",
      badgeColor: '#7c3aed'
    },
    {
      to: "/viva",
      label: "Architecture & Viva",
      icon: <BookOpen size={19} />,
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
            background: 'rgba(15, 23, 42, 0.4)',
            zIndex: 40,
            backdropFilter: 'blur(3px)'
          }}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`sidebar-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}
        style={{
          width: '260px',
          background: 'var(--bg-card)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.25rem 1rem',
          flexShrink: 0,
          transition: 'transform 250ms ease-out, background 200ms, border-color 200ms',
          zIndex: 45
        }}
      >
        <div>
          {/* Section: Main Navigation */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-muted)',
                padding: '0 0.75rem',
                marginBottom: '0.5rem'
              }}
            >
              Navigation
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
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 150ms',
                    background: isActive ? 'var(--primary-light)' : 'transparent',
                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                    border: isActive ? '1px solid var(--primary-glow)' : '1px solid transparent'
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
                        padding: '2px 7px',
                        borderRadius: '999px',
                        background: item.badgeColor || 'var(--primary-light)',
                        color: item.badgeColor ? '#ffffff' : 'var(--primary)'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Section: Live Query Pipeline Status */}
          <div
            style={{
              background: 'var(--bg-subtle)',
              borderRadius: '12px',
              padding: '1rem',
              border: '1px solid var(--border)',
              marginTop: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
              <Layers size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Query Pipeline Status</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.785rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Pending Review</span>
                <span style={{ fontWeight: 700, color: '#f59e0b' }}>{pendingCount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Faculty Answered</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{answeredCount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Fully Resolved</span>
                <span style={{ fontWeight: 700, color: 'var(--success)' }}>{resolvedCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Project AI Attribution */}
        <div
          style={{
            background: 'var(--success-light)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '0.85rem',
            textAlign: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--success)', fontWeight: 700, fontSize: '0.8rem' }}>
            <Sparkles size={15} />
            <span>AI Modules Verified</span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Modules 1, 2, 3 & 4 executable algorithms loaded client-side.
          </p>
        </div>
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
