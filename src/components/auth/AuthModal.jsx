import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { 
  LogIn, 
  UserPlus, 
  KeyRound, 
  Mail, 
  Lock, 
  User, 
  GraduationCap, 
  Building, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export function AuthModal({ isOpen, onClose, initialView = 'login' }) {
  const { login, registerStudent, resetUserPassword, loginWithGoogle, isConfigured, isFirebaseConfigured } = useApp();

  const [view, setView] = useState(initialView); // 'login' | 'register' | 'forgot'
  const [roleHint, setRoleHint] = useState('student'); // 'student' | 'faculty' | 'admin'
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [department, setDepartment] = useState('Artificial Intelligence & Data Science');
  const [semester, setSemester] = useState('4th Semester');

  const clearState = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleTabChange = (newView) => {
    clearState();
    setView(newView);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      await login(email.trim(), password);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setErrorMsg('');
      await loginWithGoogle();
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Google Sign-In failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMsg('Please fill in all mandatory fields.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      await registerStudent({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        enrollmentNumber: enrollmentNumber.trim(),
        department,
        semester,
      });

      setSuccessMsg('Student account created successfully! Signing you in...');
      try {
        await login(email.trim(), password);
        onClose();
      } catch {
        setSuccessMsg('Account registered! Please sign in with your credentials.');
        setTimeout(() => {
          setView('login');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      await resetUserPassword(email.trim());
      setSuccessMsg('Password reset link sent to your email address!');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  const renderRoleHelper = () => (
    <div style={{ marginBottom: '1.25rem' }}>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.45rem' }}>
        Signing in as:
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
        {[
          { key: 'student', label: 'Student', icon: <GraduationCap size={15} /> },
          { key: 'faculty', label: 'Faculty', icon: <User size={15} /> },
          { key: 'admin', label: 'Admin', icon: <Sparkles size={15} /> },
        ].map(r => (
          <button
            key={r.key}
            type="button"
            onClick={() => {
              setRoleHint(r.key);
              if (r.key === 'faculty' && !email) setEmail('roshni.prasad@college.edu');
              if (r.key === 'student' && !email) setEmail('manikant.ai@college.edu');
              if (r.key === 'admin' && !email) setEmail('admin@college.edu');
            }}
            style={{
              padding: '0.45rem 0.6rem',
              borderRadius: '8px',
              border: `1px solid ${roleHint === r.key ? 'var(--primary)' : 'var(--border)'}`,
              background: roleHint === r.key ? 'var(--primary-light)' : 'var(--bg-card)',
              color: roleHint === r.key ? 'var(--primary)' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              transition: 'all 150ms',
            }}
          >
            {r.icon}
            <span>{r.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        view === 'login' ? 'Sign In to Resolution Portal' :
        view === 'register' ? 'Student Portal Registration' :
        'Reset Account Password'
      }
      subtitle={
        view === 'login' ? 'Access your student queries, faculty response desk, or administration' :
        view === 'register' ? 'Create a secure academic account to submit and track queries' :
        'Enter your email to receive a password reset link'
      }
      maxWidth="540px"
    >
      <div>
        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border)',
            marginBottom: '1.25rem',
          }}
        >
          <button
            type="button"
            onClick={() => handleTabChange('login')}
            style={{
              flex: 1,
              padding: '0.65rem',
              border: 'none',
              background: 'transparent',
              color: view === 'login' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.9rem',
              borderBottom: `2px solid ${view === 'login' ? 'var(--primary)' : 'transparent'}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
            }}
          >
            <LogIn size={16} />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('register')}
            style={{
              flex: 1,
              padding: '0.65rem',
              border: 'none',
              background: 'transparent',
              color: view === 'register' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.9rem',
              borderBottom: `2px solid ${view === 'register' ? 'var(--primary)' : 'transparent'}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
            }}
          >
            <UserPlus size={16} />
            <span>Student Register</span>
          </button>
        </div>

        {/* Database Config Notice */}
        {!isConfigured && (
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              fontSize: '0.8rem',
              color: '#d97706',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Demo Environment Active:</strong> Supabase credentials (.env) are being configured. You can test in live demo mode or configure your Supabase URL & Key in <code>.env</code>.
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div
            style={{
              background: 'var(--danger-light)',
              border: '1px solid var(--danger)',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              fontSize: '0.85rem',
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div
            style={{
              background: 'var(--success-light)',
              border: '1px solid var(--success)',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              fontSize: '0.85rem',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Professional Continue with Google Button */}
        {(view === 'login' || view === 'register') && (
          <div style={{ marginBottom: '1.25rem' }}>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                fontSize: '0.92rem',
                fontWeight: 600,
                cursor: (googleLoading || loading) ? 'not-allowed' : 'pointer',
                transition: 'all 200ms ease',
                boxShadow: 'var(--shadow-xs)',
              }}
              className="google-sign-in-btn"
            >
              {googleLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 16, height: 16, border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  <span>Connecting to Google...</span>
                </div>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '1.25rem 0 0.5rem',
                gap: '0.75rem',
              }}
            >
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <span
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  fontWeight: 600,
                }}
              >
                or continue with college email
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>
          </div>
        )}

        {/* VIEW 1: SIGN IN */}
        {view === 'login' && (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Mail size={14} />
                <span>College Email Address</span>
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="name@college.edu or gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.3rem' }}>
                  <Lock size={14} />
                  <span>Password</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleTabChange('forgot')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? 'Authenticating with Supabase...' : 'Sign In to Portal'}
            </button>
          </form>
        )}

        {/* VIEW 2: STUDENT REGISTRATION */}
        {view === 'register' && (
          <form onSubmit={handleRegister}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                background: 'var(--primary-light)',
                border: '1px solid var(--primary-glow)',
                marginBottom: '1.25rem',
                fontSize: '0.78rem',
                color: 'var(--primary)',
                fontWeight: 600,
                lineHeight: 1.4,
              }}
            >
              <GraduationCap size={18} style={{ flexShrink: 0 }} />
              <span>
                <strong>Student Self-Registration:</strong> Faculty and Administrator accounts are provisioned exclusively by Institutional Administration.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <User size={14} />
                <span>Full Name *</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Manikant Rajpoot"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <GraduationCap size={14} />
                  <span>Roll / Enrollment No.</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 23AI-104"
                  value={enrollmentNumber}
                  onChange={(e) => setEnrollmentNumber(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={14} />
                  <span>Current Semester</span>
                </label>
                <select
                  className="form-select"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                >
                  <option value="1st Semester">1st Semester</option>
                  <option value="2nd Semester">2nd Semester</option>
                  <option value="3rd Semester">3rd Semester</option>
                  <option value="4th Semester">4th Semester</option>
                  <option value="5th Semester">5th Semester</option>
                  <option value="6th Semester">6th Semester</option>
                  <option value="7th Semester">7th Semester</option>
                  <option value="8th Semester">8th Semester</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Building size={14} />
                <span>Academic Department</span>
              </label>
              <select
                className="form-select"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Mail size={14} />
                <span>College Email Address *</span>
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="student@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Lock size={14} />
                  <span>Password *</span>
                </label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Lock size={14} />
                  <span>Confirm Password *</span>
                </label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Re-type password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>
        )}

        {/* VIEW 3: FORGOT PASSWORD */}
        {view === 'forgot' && (
          <form onSubmit={handleForgotPassword}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Mail size={14} />
                <span>Registered College Email</span>
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="name@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="form-hint">
                We will email you a secure link to reset your account password.
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? 'Sending Link...' : 'Send Password Reset Link'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => handleTabChange('login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}

