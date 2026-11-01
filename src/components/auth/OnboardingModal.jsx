import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, 
  Briefcase, 
  Building, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Sparkles,
  UserCheck
} from 'lucide-react';

export function OnboardingModal({ isOpen, onClose }) {
  const { currentUser, userProfile, updateProfileDetails, showToast } = useApp();

  const [role, setRole] = useState('student');
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [course, setCourse] = useState('B.Tech - Artificial Intelligence & Data Science');
  const [department, setDepartment] = useState('Artificial Intelligence & Data Science');
  const [semester, setSemester] = useState('4th Semester');
  const [specialization, setSpecialization] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (userProfile) {
      if (userProfile.role) setRole(userProfile.role);
      if (userProfile.enrollment_number) setEnrollmentNumber(userProfile.enrollment_number);
      if (userProfile.department) setDepartment(userProfile.department);
      if (userProfile.course) setCourse(userProfile.course);
      if (userProfile.semester) setSemester(userProfile.semester);
    }
  }, [userProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!enrollmentNumber.trim()) {
      setErrorMsg(role === 'student' ? 'Please enter your Enrollment / Roll Number.' : 'Please enter your Faculty / Employee ID.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');

      await updateProfileDetails({
        enrollment_number: enrollmentNumber.trim(),
        department,
        course: role === 'student' ? course : 'Faculty / Academic Staff',
        semester: role === 'student' ? semester : 'N/A',
        specialization: role === 'faculty' ? specialization : '',
        role,
        is_profile_complete: true,
      });

      showToast('Profile configured successfully! Welcome aboard.', 'success');
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to update academic profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        // Can only close if profile is already complete
        if (userProfile?.is_profile_complete) {
          onClose();
        }
      }}
      title="Complete Your Academic Profile"
      subtitle="Welcome to Student Query Resolution System. Please confirm your academic details to personalize your portal."
      maxWidth="560px"
    >
      <form onSubmit={handleSubmit}>
        {/* User Google Identity Badge */}
        {currentUser && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.85rem 1rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              marginBottom: '1.25rem',
            }}
          >
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'User'}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--primary)',
                }}
              />
            ) : (
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                }}
              >
                {(currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                {currentUser.displayName || 'Google Account'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser.email}
              </div>
            </div>
            <div
              style={{
                fontSize: '0.7rem',
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                padding: '3px 8px',
                borderRadius: '999px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <CheckCircle2 size={12} />
              <span>Verified</span>
            </div>
          </div>
        )}

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

        {/* Role Selector */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
            Select Your Role in Institution *
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setRole('student')}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: `2px solid ${role === 'student' ? 'var(--primary)' : 'var(--border)'}`,
                background: role === 'student' ? 'var(--primary-light)' : 'var(--bg-card)',
                color: role === 'student' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 150ms',
              }}
            >
              <GraduationCap size={18} />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('faculty')}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: `2px solid ${role === 'faculty' ? 'var(--accent-purple)' : 'var(--border)'}`,
                background: role === 'faculty' ? 'var(--accent-purple-light)' : 'var(--bg-card)',
                color: role === 'faculty' ? 'var(--accent-purple)' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 150ms',
              }}
            >
              <UserCheck size={18} />
              <span>Faculty Member</span>
            </button>
          </div>
        </div>

        {/* Enrollment / Employee ID */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Briefcase size={14} />
            <span>{role === 'student' ? 'Roll / Enrollment Number *' : 'Faculty / Employee ID *'}</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder={role === 'student' ? 'e.g. 23AI-104 or 23CS-042' : 'e.g. FAC-AI-101'}
            value={enrollmentNumber}
            onChange={(e) => setEnrollmentNumber(e.target.value)}
            required
          />
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

        {role === 'student' ? (
          <>
            {/* Student Course */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <BookOpen size={14} />
                <span>Degree / Course *</span>
              </label>
              <select
                className="form-select"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              >
                <option value="B.Tech - Artificial Intelligence & Data Science">B.Tech - Artificial Intelligence & Data Science</option>
                <option value="B.Tech - Computer Science & Engineering">B.Tech - Computer Science & Engineering</option>
                <option value="B.Tech - Information Technology">B.Tech - Information Technology</option>
                <option value="B.Tech - Electrical Engineering">B.Tech - Electrical Engineering</option>
                <option value="B.Tech - Electronics & Communication">B.Tech - Electronics & Communication</option>
                <option value="M.Tech / Dual Degree">M.Tech / Dual Degree</option>
                <option value="BCA / MCA">BCA / MCA</option>
              </select>
            </div>

            {/* Semester */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={14} />
                <span>Current Semester *</span>
              </label>
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
                <option value="7th Semester">7th Semester (Year 4)</option>
                <option value="8th Semester">8th Semester (Year 4)</option>
              </select>
            </div>
          </>
        ) : (
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={14} />
              <span>Specialization / Research Area</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Deep Learning, Cloud Computing, Database Systems"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            />
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginTop: '0.75rem', gap: '0.5rem' }}
          disabled={submitting}
        >
          {submitting ? 'Saving Profile to Firestore...' : 'Confirm Details & Enter Portal'}
        </button>
      </form>
    </Modal>
  );
}

