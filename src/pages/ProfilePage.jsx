import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserAvatar } from '../components/common/UserAvatar';
import {
  User,
  Mail,
  Building,
  GraduationCap,
  Shield,
  Key,
  Bell,
  Sun,
  Moon,
  Save,
  CheckCircle2,
  Lock,
  Phone,
  Sparkles
} from 'lucide-react';

export function ProfilePage() {
  const {
    currentUser,
    userProfile,
    studentUser,
    facultyUser,
    role,
    setRole,
    theme,
    toggleTheme,
    updateProfileDetails,
    resetUserPassword,
    showToast
  } = useApp();

  const activeUser = role === 'faculty' ? facultyUser : studentUser;

  const [formData, setFormData] = useState({
    name: userProfile?.full_name || activeUser?.name || 'Rahul Sharma',
    email: currentUser?.email || activeUser?.email || 'rahul.ai@university.edu',
    department: userProfile?.department || activeUser?.branch || 'Artificial Intelligence & Data Science',
    roll: userProfile?.enrollment_number || activeUser?.roll || '23AI-104',
    semester: userProfile?.semester || activeUser?.year || '4th Semester',
    phone: userProfile?.phone || '+91 98765 43210'
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailDigestEnabled, setEmailDigestEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [passwordEmailSent, setPasswordEmailSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (updateProfileDetails) {
        await updateProfileDetails({
          full_name: formData.name,
          department: formData.department,
          enrollment_number: formData.roll,
          semester: formData.semester,
          phone: formData.phone
        });
      }
      showToast('Profile information updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update profile: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (!currentUser?.email) {
      showToast('Please sign in with email to send a password reset link.', 'info');
      return;
    }
    try {
      if (resetUserPassword) {
        await resetUserPassword(currentUser.email);
        setPasswordEmailSent(true);
        showToast('Password reset link sent to your registered email!', 'success');
      }
    } catch (err) {
      showToast('Error sending reset email: ' + err.message, 'error');
    }
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Profile Header Card */}
      <div
        className="glass-card"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <UserAvatar
              user={currentUser}
              name={formData.name}
              photoUrl={activeUser?.photoURL}
              size="xl"
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                {formData.name}
              </h1>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  background: 'var(--primary-glow)',
                  color: 'var(--primary)',
                  border: '1px solid var(--border)'
                }}
              >
                {role}
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {formData.roll} • {formData.department}
            </p>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {formData.email}
            </p>
          </div>
        </div>

        {/* Persona quick switch for demo review */}
        <div style={{ background: 'var(--bg-glass-heavy)', padding: '0.75rem 1rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
            Switch Active Persona
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['student', 'faculty', 'admin'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: role === r ? 'var(--primary)' : 'transparent',
                  color: role === r ? 'var(--bg-main)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: '2rem' }}>
        {/* Left Column: Account & Academic Details */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <User size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Academic Information
            </h2>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="form-label">Email Address (Read-only)</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                disabled
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
            </div>

            <div className="grid-2" style={{ gap: '1rem' }}>
              <div>
                <label className="form-label">Roll / Reg Number</label>
                <input
                  type="text"
                  name="roll"
                  className="form-input"
                  value={formData.roll}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="form-label">Semester / Year</label>
                <input
                  type="text"
                  name="semester"
                  className="form-input"
                  value={formData.semester}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="form-label">Department / School</label>
              <input
                type="text"
                name="department"
                className="form-input"
                value={formData.department}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="form-label">Mobile Contact</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="btn btn-primary btn-lg"
              style={{ marginTop: '0.75rem' }}
            >
              <Save size={18} />
              <span>{isSaving ? 'Updating Profile...' : 'Save Academic Details'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Preferences, Theme & Security */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Theme & Display Preferences */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Sparkles size={20} color="var(--primary)" />
              <span>Appearance & Theme</span>
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-glass-heavy)', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  {theme === 'dark' ? 'Deep Green / Dark Mode' : 'Lavender Glow / Light Mode'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {theme === 'dark' ? 'Deep black-green (#0B1711) with lime accents' : 'Soft lavender (#F8F7FF) with purple-pink glow'}
                </div>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className="btn btn-outline"
                style={{ borderRadius: '9999px', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {theme === 'dark' ? <Sun size={16} color="var(--warning)" /> : <Moon size={16} color="var(--primary)" />}
                <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>
            </div>
          </div>

          {/* Notifications Preferences */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Bell size={20} color="var(--primary)" />
              <span>Alert Preferences</span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>In-App Push Updates</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Get notified when faculty responds to your ticket</div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Weekly Summary Digest</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Receive weekly resolution performance updates</div>
                </div>
                <input
                  type="checkbox"
                  checked={emailDigestEnabled}
                  onChange={(e) => setEmailDigestEnabled(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </label>
            </div>
          </div>

          {/* Security & Password */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Shield size={20} color="var(--primary)" />
              <span>Security & Password</span>
            </h2>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Manage your credentials securely. If you signed in with Google OAuth, password management is handled directly through Google.
            </p>

            <button
              type="button"
              onClick={handleResetPassword}
              className="btn btn-outline"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Key size={16} />
              <span>{passwordEmailSent ? 'Reset Email Dispatched' : 'Request Password Reset Link'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
