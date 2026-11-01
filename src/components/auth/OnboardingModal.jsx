import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from '../common/UserAvatar';
import {
  GraduationCap,
  Briefcase,
  Building,
  Calendar,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export function OnboardingModal({ isOpen, onClose }) {
  const { currentUser, userProfile, updateProfileDetails, showToast } = useApp();

  const [fullName, setFullName] = useState('');
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [course, setCourse] = useState('B.Tech - Artificial Intelligence & Data Science');
  const [department, setDepartment] = useState('Artificial Intelligence & Data Science');
  const [semester, setSemester] = useState('4th Semester');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Prefill available information from Google Auth / current profile
  useEffect(() => {
    const activeName = (
      userProfile?.full_name ||
      currentUser?.displayName ||
      currentUser?.user_metadata?.full_name ||
      currentUser?.user_metadata?.name ||
      currentUser?.email?.split('@')[0] ||
      ''
    );
    setFullName(activeName);

    if (userProfile?.enrollment_number) {
      setEnrollmentNumber(userProfile.enrollment_number);
    }
    if (userProfile?.department) {
      setDepartment(userProfile.department);
    }
    if (userProfile?.course) {
      setCourse(userProfile.course);
    }
    if (userProfile?.semester) {
      setSemester(userProfile.semester);
    }
  }, [userProfile, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!enrollmentNumber.trim()) {
      setErrorMsg('Please enter your official Enrollment / Roll Number.');
      return;
    }
    if (!fullName.trim()) {
      setErrorMsg('Please confirm your full student name.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');

      await updateProfileDetails({
        full_name: fullName.trim(),
        enrollment_number: enrollmentNumber.trim().toUpperCase(),
        department,
        course,
        semester,
        role: 'student', // Strictly 'student' for public Google login onboarding
        is_profile_complete: true,
      });

      showToast('Academic profile saved successfully to Supabase! Welcome.', 'success');
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to save academic profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const userEmail = currentUser?.email || userProfile?.email || '';

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        // Only allow closing if profile is already complete
        if (userProfile?.is_profile_complete) {
          onClose();
        }
      }}
      title="Complete Your Academic Profile"
      subtitle="Welcome to the University Student Portal. Please provide your official academic details to complete initial onboarding."
      maxWidth="540px"
    >
      <form onSubmit={handleSubmit}>
        {/* Authenticated Identity Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            padding: '0.85rem 1rem',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            marginBottom: '1.25rem',
          }}
        >
          <UserAvatar
            user={currentUser}
            profile={userProfile}
            size="md"
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.925rem' }}>
              {fullName || 'Student Account'}
            </div>
            <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userEmail}
            </div>
          </div>
          <div
            style={{
              fontSize: '0.72rem',
              background: 'var(--success-light)',
              color: 'var(--success)',
              border: '1px solid var(--border)',
              padding: '3px 8px',
              borderRadius: '999px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <ShieldCheck size={13} />
            <span>Google Verified</span>
          </div>
        </div>

        {/* Error notification */}
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

        {/* Full Name Confirmation */}
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            className="form-input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Official full name"
            required
          />
        </div>

        {/* Enrollment / Roll Number */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Briefcase size={14} />
            <span>Enrollment / Roll Number *</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. 23AI-104, 23CS-042, 23IT-088"
            value={enrollmentNumber}
            onChange={(e) => setEnrollmentNumber(e.target.value)}
            required
          />
          <span className="form-hint">
            Official university registration number issued by the academic registrar.
          </span>
        </div>

        {/* Department */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Building size={14} />
            <span>Department *</span>
          </label>
          <select
            className="form-select"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          >
            <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
            <option value="Computer Science & Engineering">Computer Science & Engineering</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
            <option value="Electronics & Communication">Electronics & Communication</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Civil Engineering">Civil Engineering</option>
          </select>
        </div>

        {/* Degree / Course */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <BookOpen size={14} />
            <span>Degree / Program *</span>
          </label>
          <select
            className="form-select"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          >
            <option value="B.Tech - Artificial Intelligence & Data Science">B.Tech - Artificial Intelligence & Data Science</option>
            <option value="B.Tech - Computer Science & Engineering">B.Tech - Computer Science & Engineering</option>
            <option value="B.Tech - Information Technology">B.Tech - Information Technology</option>
            <option value="B.Tech - Electrical Engineering">B.Tech - Electrical Engineering</option>
            <option value="B.Tech - Electronics & Communication">B.Tech - Electronics & Communication</option>
            <option value="M.Tech - Advanced Computing & AI">M.Tech - Advanced Computing & AI</option>
            <option value="BCA / MCA Integrated">BCA / MCA Integrated</option>
          </select>
        </div>

        {/* Current Semester */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={14} />
            <span>Current Semester *</span>
          </label>
          <select
            className="form-select"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            required
          >
            <option value="1st Semester">1st Semester (Year 1 - Autumn)</option>
            <option value="2nd Semester">2nd Semester (Year 1 - Spring)</option>
            <option value="3rd Semester">3rd Semester (Year 2 - Autumn)</option>
            <option value="4th Semester">4th Semester (Year 2 - Spring)</option>
            <option value="5th Semester">5th Semester (Year 3 - Autumn)</option>
            <option value="6th Semester">6th Semester (Year 3 - Spring)</option>
            <option value="7th Semester">7th Semester (Year 4 - Autumn)</option>
            <option value="8th Semester">8th Semester (Year 4 - Spring)</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginTop: '0.75rem', gap: '0.5rem' }}
          disabled={submitting}
        >
          {submitting ? 'Saving Profile to Supabase...' : 'Confirm Details & Access Student Portal'}
        </button>
      </form>
    </Modal>
  );
}
