import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, LogIn, ArrowRight } from 'lucide-react';

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { currentUser, role, openAuthModal, isConfigured } = useApp();

  // If Supabase is configured and user is not logged in:
  // In demo mode (before Supabase .env setup), fallback to existing demo role simulation
  if (isConfigured && !currentUser) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
        <div
          className="glass-card"
          style={{
            maxWidth: '520px',
            margin: '0 auto',
            padding: '2.5rem 2rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--danger-light)',
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <ShieldAlert size={28} />
          </div>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Authentication Required
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            You need to be signed in to access this academic dashboard. Please log in with your college credentials.
          </p>
          <button
            onClick={() => openAuthModal('login')}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', gap: '0.5rem' }}
          >
            <LogIn size={18} />
            <span>Sign In to Continue</span>
          </button>
        </div>
      </div>
    );
  }

  // Check role authorization
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
        <div
          className="glass-card"
          style={{
            maxWidth: '540px',
            margin: '0 auto',
            padding: '2.5rem 2rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--warning-light)',
              color: 'var(--warning)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <ShieldAlert size={28} />
          </div>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Access Restricted
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Your account role is <strong>{role.toUpperCase()}</strong>. You do not have permission to access this page. Only authorized <strong>{allowedRoles.join(' / ').toUpperCase()}</strong> can view this area.
          </p>
          <a
            href={role === 'faculty' ? '#/faculty' : role === 'admin' ? '#/admin' : '#/student'}
            className="btn btn-secondary btn-lg"
            style={{ display: 'inline-flex', gap: '0.5rem' }}
          >
            <span>Return to Your {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    );
  }

  return children;
}
