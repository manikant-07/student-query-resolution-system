import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Hero3DVisual } from '../components/common/Hero3DVisual';
import { 
  LogIn, 
  UserPlus, 
  Lock, 
  Mail, 
  User, 
  Briefcase, 
  Building, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  KeyRound,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

export function AuthPage() {
  const navigate = useNavigate();
  const { 
    login, 
    registerStudent, 
    resetUserPassword, 
    loginWithGoogle, 
    supabaseHealth, 
    isSupabaseConnected,
    role: appRole,
    setRole: setAppRole
  } = useApp();

  const [view, setView] = useState('login'); // 'login' | 'register' | 'otp' | 'forgot'
  const [selectedRole, setSelectedRole] = useState('student'); // 'student' | 'faculty' | 'admin'
  const [showPassword, setShowPassword] = useState(false);
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
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);

  const clearAlerts = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleRoleSelect = (r) => {
    setSelectedRole(r);
    setAppRole(r);
    clearAlerts();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both your college email and password.');
      return;
    }

    try {
      setLoading(true);
      clearAlerts();
      await login(email.trim(), password);
      // Navigate to appropriate dashboard
      if (selectedRole === 'admin') navigate('/admin');
      else if (selectedRole === 'faculty') navigate('/faculty');
      else navigate('/student');
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (selectedRole !== 'student') {
      setErrorMsg('Self-registration is available for Students. Faculty & Admin accounts are provisioned by College Governance.');
      return;
    }
    if (!fullName.trim() || !email.trim() || !enrollmentNumber.trim() || !password) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      clearAlerts();
      await registerStudent({
        fullName: fullName.trim(),
        email: email.trim(),
        enrollmentNumber: enrollmentNumber.trim().toUpperCase(),
        department,
        semester,
        password
      });
      setSuccessMsg('Student account created successfully! Please sign in.');
      setView('login');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      clearAlerts();
      await loginWithGoogle();
      navigate('/student');
    } catch (err) {
      setErrorMsg(err.message || 'Google sign in failed.');
    } finally {
      setGoogleLoading(false);
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
      clearAlerts();
      await resetUserPassword(email.trim());
      setSuccessMsg('Password reset instructions sent. Enter the 6-digit verification code below.');
      setView('otp');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send password reset link.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const code = otpCode.join('');
    if (code.length < 6) {
      setErrorMsg('Please enter the complete 6-digit verification code.');
      return;
    }
    setSuccessMsg('Code verified! You may now create a new password.');
    setTimeout(() => {
      navigate('/reset-password');
    }, 1500);
  };

  return (
    <div className="page-wrapper" style={{ padding: '3rem 1.5rem', minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center' }}>
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0',
          display: 'grid',
          gridTemplateColumns: '1.05fr 1.15fr',
          borderRadius: 'var(--radius-card)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)'
        }}
        id="split-auth-container"
      >
        {/* =====================================================================
            LEFT PANEL: 3D Visual & Motivational Presentation
            ===================================================================== */}
        <div
          style={{
            background: 'var(--bg-subtle)',
            padding: '3.5rem 2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRight: '1px solid var(--border)',
            position: 'relative',
            overflow: 'hidden'
          }}
          className="auth-left-panel"
        >
          {/* Subtle Ambient Glow */}
          <div
            style={{
              position: 'absolute',
              top: '10%',
              left: '10%',
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              background: 'var(--primary-glow)',
              filter: 'blur(70px)',
              pointerEvents: 'none'
            }}
          />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--accent-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#060D09',
                  fontWeight: 800
                }}
              >
                SH
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                Solve<span style={{ color: 'var(--primary)' }}>Hub</span>
              </span>
            </div>

            <h2 style={{ fontSize: '2.1rem', lineHeight: 1.2, marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
              Unlock Instant Academic Answers.
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
              "Education is the premise of progress, in every society, in every family." Experience AI-guided triage, direct mentor communication, and verified resolutions.
            </p>

            {/* Micro 3D Display */}
            <div style={{ margin: '1rem 0 2rem' }}>
              <Hero3DVisual />
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={18} color="var(--primary)" />
              <span>Protected by Supabase Auth with PostgreSQL Row Level Security</span>
            </div>
          </div>
        </div>

        {/* =====================================================================
            RIGHT PANEL: Auth Form & Pill Roles
            ===================================================================== */}
        <div style={{ padding: '3.5rem 3rem', background: 'var(--bg-card)' }}>
          {/* Pill Role Selector */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" style={{ fontSize: '0.785rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Select Portal Role
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                background: 'var(--bg-subtle)',
                padding: '4px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border)',
                gap: '4px'
              }}
            >
              {[
                { key: 'student', label: 'Student', icon: <GraduationCap size={15} /> },
                { key: 'faculty', label: 'Teacher', icon: <User size={15} /> },
                { key: 'admin', label: 'Admin', icon: <ShieldCheck size={15} /> }
              ].map(r => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => handleRoleSelect(r.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    padding: '0.55rem',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    background: selectedRole === r.key ? 'var(--primary)' : 'transparent',
                    color: selectedRole === r.key ? '#060D09' : 'var(--text-muted)',
                    boxShadow: selectedRole === r.key ? '0 2px 10px var(--primary-glow)' : 'none'
                  }}
                >
                  {r.icon}
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Login / Signup Tabs */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--border)',
              marginBottom: '1.75rem',
              gap: '1.5rem'
            }}
          >
            <button
              type="button"
              onClick={() => { setView('login'); clearAlerts(); }}
              style={{
                background: 'transparent',
                border: 'none',
                paddingBottom: '0.75rem',
                fontFamily: 'var(--font-heading)',
                fontSize: '1.1rem',
                fontWeight: 700,
                cursor: 'pointer',
                color: view === 'login' ? 'var(--text-primary)' : 'var(--text-muted)',
                borderBottom: `2px solid ${view === 'login' ? 'var(--primary)' : 'transparent'}`,
                transition: 'all var(--transition-fast)'
              }}
            >
              Sign In
            </button>

            {selectedRole === 'student' && (
              <button
                type="button"
                onClick={() => { setView('register'); clearAlerts(); }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  paddingBottom: '0.75rem',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: view === 'register' ? 'var(--text-primary)' : 'var(--text-muted)',
                  borderBottom: `2px solid ${view === 'register' ? 'var(--primary)' : 'transparent'}`,
                  transition: 'all var(--transition-fast)'
                }}
              >
                Create Account
              </button>
            )}
          </div>

          {/* Backend Health Diagnostics Notice (if credentials ever missing) */}
          {supabaseHealth && !supabaseHealth.ok && (
            <div
              style={{
                background: 'var(--danger-light)',
                border: '1px solid var(--danger)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                marginBottom: '1.25rem',
                fontSize: '0.8rem',
                color: 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <AlertCircle size={16} />
              <span>{supabaseHealth.message}</span>
            </div>
          )}

          {/* Inline Alerts */}
          {errorMsg && (
            <div
              style={{
                background: 'var(--danger-light)',
                border: '1px solid var(--danger)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
                color: 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div
              style={{
                background: 'var(--success-light)',
                border: '1px solid var(--success)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ===================================================================
              VIEW 1: SIGN IN
              =================================================================== */}
          {view === 'login' && (
            <div>
              {/* Google OAuth Button (For Student) */}
              {selectedRole === 'student' && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading || loading}
                    className="btn btn-secondary btn-pill"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      justifyContent: 'center',
                      fontSize: '0.925rem'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', margin: '1.25rem 0', gap: '0.75rem' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                      or college credentials
                    </span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                  </div>
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label">College Email</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="name@college.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label">Password</label>
                    <button
                      type="button"
                      onClick={() => setView('forgot')}
                      style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-pill btn-lg"
                  style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}
                >
                  <LogIn size={18} />
                  <span>{loading ? 'Authenticating...' : `Sign In as ${selectedRole.toUpperCase()}`}</span>
                </button>
              </form>
            </div>
          )}

          {/* ===================================================================
              VIEW 2: STUDENT SIGNUP
              =================================================================== */}
          {view === 'register' && (
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Rahul Verma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">College Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="student@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Enrollment / Roll No</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 23AI-104"
                    value={enrollmentNumber}
                    onChange={(e) => setEnrollmentNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select
                    className="form-select"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                    <option value="Computer Science Engineering">Computer Science</option>
                    <option value="Information Technology">Information Tech</option>
                    <option value="Electronics & Communication">Electronics & Comm</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Semester / Year</label>
                  <select
                    className="form-select"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                  >
                    <option value="1st Semester">1st Semester (Year 1)</option>
                    <option value="2nd Semester">2nd Semester (Year 1)</option>
                    <option value="3rd Semester">3rd Semester (Year 2)</option>
                    <option value="4th Semester">4th Semester (Year 2)</option>
                    <option value="5th Semester">5th Semester (Year 3)</option>
                    <option value="6th Semester">6th Semester (Year 3)</option>
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Password</label>
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
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-pill btn-lg"
                style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}
              >
                <UserPlus size={18} />
                <span>{loading ? 'Registering...' : 'Create Student Account'}</span>
              </button>
            </form>
          )}

          {/* ===================================================================
              VIEW 3: FORGOT PASSWORD
              =================================================================== */}
          {view === 'forgot' && (
            <form onSubmit={handleForgotPassword}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Enter your registered college email and we will send a 6-digit OTP verification code to reset your password.
              </p>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-pill btn-lg"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Send size={16} />
                <span>Send OTP Code</span>
              </button>

              <button
                type="button"
                onClick={() => setView('login')}
                className="btn btn-ghost btn-sm"
                style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}
              >
                Back to Login
              </button>
            </form>
          )}

          {/* ===================================================================
              VIEW 4: OTP VERIFICATION
              =================================================================== */}
          {view === 'otp' && (
            <form onSubmit={handleVerifyOtp}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem',
                    color: 'var(--primary)'
                  }}
                >
                  <KeyRound size={24} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-heading)' }}>
                  Enter Verification Code
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  We sent a 6-digit code to <strong>{email}</strong>
                </p>
              </div>

              {/* 6-box OTP Input */}
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value;
                      const next = [...otpCode];
                      next[idx] = val;
                      setOtpCode(next);
                      if (val && idx < 5) {
                        document.getElementById(`otp-input-${idx + 1}`)?.focus();
                      }
                    }}
                    style={{
                      width: '44px',
                      height: '52px',
                      textAlign: 'center',
                      fontSize: '1.35rem',
                      fontWeight: 800,
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      outline: 'none'
                    }}
                  />
                ))}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-pill btn-lg"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>Verify & Proceed</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => setView('login')}
                className="btn btn-ghost btn-sm"
                style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}
              >
                Back to Sign In
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #split-auth-container {
            grid-template-columns: 1fr !important;
          }
          .auth-left-panel {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
