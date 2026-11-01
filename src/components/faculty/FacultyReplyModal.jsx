import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { 
  Send, 
  CheckCircle, 
  UserCheck, 
  Sparkles, 
  AlertCircle,
  FileText,
  Paperclip,
  Download,
  Share2,
  ShieldAlert,
  Clock
} from 'lucide-react';

export function FacultyReplyModal({ query, isOpen, onClose }) {
  const { replyToQuery, assignQuery, faculty, showToast } = useApp();

  const [message, setMessage] = useState('');
  const [newStatus, setNewStatus] = useState('Answered');
  const [assignedFaculty, setAssignedFaculty] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!query) return null;

  const cannedResponses = [
    {
      label: 'Standard medical leave condonation required',
      text: 'Your medical leave inquiry has been received. Please submit original medical certificates signed by the registered medical practitioner along with hospital discharge slips to Room 204 within 3 business days for condonation clearance.'
    },
    {
      label: 'Fee receipt verified with Accounts desk',
      text: 'Your fee transaction receipt has been verified with the university finance accounts division. The financial hold on your student profile has been revoked and hall ticket download is now unlocked.'
    },
    {
      label: 'Timetable examination clash escalated',
      text: 'The reported collision between the scheduled elective slot and core course has been escalated to the Chief Superintendent of Examinations. A revised slot timetable will be issued.'
    },
    {
      label: 'Hostel maintenance dispatched',
      text: 'Your complaint regarding hostel facilities has been assigned to the Chief Warden and campus maintenance facility. Technicians are scheduled to inspect the room today between 2 PM and 5 PM.'
    }
  ];

  const handleSelectCannedResponse = (e) => {
    const selected = cannedResponses.find(c => c.label === e.target.value);
    if (selected) {
      setMessage(selected.text);
    }
  };

  const handleUseAISuggestion = () => {
    if (query.suggestedAnswer) {
      setMessage(query.suggestedAnswer);
    }
  };

  const handleForwardToTeacher = async () => {
    if (!assignedFaculty || assignedFaculty === 'Unassigned') {
      alert('Please select a faculty member from the dropdown first.');
      return;
    }
    try {
      const facObj = faculty.find(f => f.name === assignedFaculty);
      await assignQuery(query.id, assignedFaculty, facObj ? facObj.department : query.assignedDept);
      showToast(`Query ${query.id} forwarded to ${assignedFaculty}`, 'success');
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEscalateToAdmin = async () => {
    try {
      await replyToQuery(query.id, '[ESCALATED TO ADMIN]: Higher approval required for this student appeal.', 'In Progress', 'Escalated to Academic Dean/Admin');
      showToast(`Query ${query.id} escalated to Academic Dean / Admin desk.`, 'warning');
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      alert("Please enter an official response message.");
      return;
    }

    setIsSubmitting(true);
    try {
      await replyToQuery(query.id, message, newStatus, remarks);

      if (assignedFaculty && assignedFaculty !== query.assignedTo && assignedFaculty !== 'Unassigned') {
        const facObj = faculty.find(f => f.name === assignedFaculty);
        await assignQuery(query.id, assignedFaculty, facObj ? facObj.department : query.assignedDept);
      }

      setMessage('');
      setRemarks('');
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error submitting response.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Faculty Resolution Desk: ${query.id}`}
      subtitle={`Student: ${query.studentName} (${query.studentRoll}) • Category: ${query.category}`}
      maxWidth="760px"
    >
      <form onSubmit={handleSubmit}>
        {/* Query Summary Card */}
        <div
          style={{
            background: 'var(--bg-glass-heavy)',
            borderRadius: '16px',
            padding: '1.25rem',
            border: '1px solid var(--border)',
            marginBottom: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h5 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>{query.subject}</h5>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <StatusBadge status={query.status} />
              <PriorityBadge priority={query.priority} />
            </div>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {query.description}
          </p>

          {/* Attachments preview */}
          {query.attachments && query.attachments.length > 0 && (
            <div style={{ marginTop: '0.75rem', paddingTop: '0.65rem', borderTop: '1px dashed var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Paperclip size={15} color="var(--primary)" />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                {query.attachments.length} student verification file(s) attached
              </span>
            </div>
          )}
        </div>

        {/* Quick Canned Response Dropdown */}
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileText size={14} color="var(--primary)" />
            <span>Quick Reply Templates (Canned Responses)</span>
          </label>
          <select
            className="form-select"
            onChange={handleSelectCannedResponse}
            defaultValue=""
          >
            <option value="" disabled>-- Select a standard resolution template --</option>
            {cannedResponses.map((cr, idx) => (
              <option key={idx} value={cr.label}>
                {cr.label}
              </option>
            ))}
          </select>
        </div>

        {/* AI Suggestion Preview */}
        {query.suggestedAnswer && (
          <div
            style={{
              background: 'var(--primary-glow)',
              border: '1px solid var(--primary)',
              borderRadius: '14px',
              padding: '0.85rem 1.15rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem' }}>
                <Sparkles size={14} />
                <span>AI Automated Knowledge Suggestion</span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-primary)', marginTop: '3px', lineHeight: 1.4 }}>
                {query.suggestedAnswer}
              </p>
            </div>
            <button
              type="button"
              onClick={handleUseAISuggestion}
              className="btn btn-secondary btn-sm"
              style={{ flexShrink: 0, fontSize: '0.75rem', gap: '0.3rem', borderRadius: '9999px' }}
            >
              <FileText size={13} />
              <span>Use as Template</span>
            </button>
          </div>
        )}

        <div className="grid-2" style={{ gap: '1rem' }}>
          {/* Status Update Dropdown */}
          <div className="form-group">
            <label className="form-label">Update Query Status</label>
            <select
              className="form-select"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="In Progress">In Progress (Reviewing Details)</option>
              <option value="Answered">Answered (Awaiting Student Acknowledgment)</option>
              <option value="Resolved">Resolved (Fully Closed)</option>
              <option value="Pending">Keep as Pending</option>
            </select>
          </div>

          {/* Forward / Reassign Dropdown */}
          <div className="form-group">
            <label className="form-label">Forward to Another Teacher / Mentor</label>
            <select
              className="form-select"
              value={assignedFaculty || query.assignedTo || ''}
              onChange={(e) => setAssignedFaculty(e.target.value)}
            >
              <option value="Unassigned">-- Select Teacher --</option>
              {faculty.map(fac => (
                <option key={fac.id || fac.name} value={fac.name} disabled={!fac.available}>
                  {fac.name} ({fac.department}) {!fac.available ? '[Away]' : `[Active Load: ${fac.currentLoad}/${fac.maxLoad}]`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Official Response Text */}
        <div className="form-group">
          <label className="form-label">Official Mentor Response *</label>
          <textarea
            className="form-textarea"
            rows={5}
            placeholder="Provide official directions, document submission deadlines, counter clearance confirmation..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        {/* Audit Remarks */}
        <div className="form-group">
          <label className="form-label">Internal Resolution Remarks (Optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g., Verified original medical certificate with Dr. Sharma, AC-4 approved."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        {/* Action Buttons Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleForwardToTeacher}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.8rem', gap: '5px' }}
            >
              <Share2 size={14} />
              <span>Forward to Teacher</span>
            </button>
            <button
              type="button"
              onClick={handleEscalateToAdmin}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.8rem', gap: '5px', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            >
              <ShieldAlert size={14} />
              <span>Escalate to Admin</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ gap: '6px' }}>
              <Send size={15} />
              <span>{isSubmitting ? 'Posting Response...' : 'Send Reply'}</span>
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
