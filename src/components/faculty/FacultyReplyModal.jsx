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
  Download
} from 'lucide-react';

export function FacultyReplyModal({ query, isOpen, onClose }) {
  const { replyToQuery, assignQuery, faculty } = useApp();

  const [message, setMessage] = useState('');
  const [newStatus, setNewStatus] = useState('Answered');
  const [assignedFaculty, setAssignedFaculty] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!query) return null;

  const handleUseAISuggestion = () => {
    if (query.suggestedAnswer) {
      setMessage(query.suggestedAnswer);
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

      if (assignedFaculty && assignedFaculty !== query.assignedTo) {
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
      maxWidth="720px"
    >
      <form onSubmit={handleSubmit}>
        {/* Query Summary Card */}
        <div
          style={{
            background: 'var(--bg-subtle)',
            borderRadius: '10px',
            padding: '1rem',
            border: '1px solid var(--border)',
            marginBottom: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <h5 style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{query.subject}</h5>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <StatusBadge status={query.status} />
              <PriorityBadge priority={query.priority} />
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {query.description}
          </p>

          {/* Attachments preview if available */}
          {query.attachments && query.attachments.length > 0 && (
            <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Paperclip size={14} color="var(--primary)" />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                {query.attachments.length} student verification file(s) attached
              </span>
            </div>
          )}
        </div>

        {/* AI Suggestion Preview & Shortcut */}
        {query.suggestedAnswer && (
          <div
            style={{
              background: 'var(--hero-gradient)',
              border: '1px solid var(--primary-glow)',
              borderRadius: '8px',
              padding: '0.85rem',
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
              <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginTop: '3px', lineHeight: 1.4 }}>
                {query.suggestedAnswer}
              </p>
            </div>
            <button
              type="button"
              onClick={handleUseAISuggestion}
              className="btn btn-secondary btn-sm"
              style={{ flexShrink: 0, fontSize: '0.75rem', gap: '0.3rem' }}
            >
              <FileText size={13} />
              <span>Use as Template</span>
            </button>
          </div>
        )}

        <div className="grid-2">
          {/* Status Update Dropdown */}
          <div className="form-group">
            <label className="form-label">Update Query Status</label>
            <select
              className="form-select"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="Answered">Mark as Answered (Awaiting Student Acknowledgment)</option>
              <option value="Resolved">Mark as Fully Resolved & Closed</option>
              <option value="Pending">Keep as Pending Investigation</option>
            </select>
          </div>

          {/* Assign / Transfer to Faculty */}
          <div className="form-group">
            <label className="form-label">Assign / Transfer Faculty In-Charge</label>
            <select
              className="form-select"
              value={assignedFaculty || query.assignedTo || ''}
              onChange={(e) => setAssignedFaculty(e.target.value)}
            >
              <option value="Unassigned">-- Unassigned --</option>
              {faculty.map(fac => (
                <option key={fac.id || fac.name} value={fac.name} disabled={!fac.available}>
                  {fac.name} ({fac.department}) {!fac.available ? '[On Leave]' : `[Load: ${fac.currentLoad}/${fac.maxLoad}]`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Official Response Text */}
        <div className="form-group">
          <label className="form-label">Official Response / Resolution Directive *</label>
          <textarea
            className="form-textarea"
            rows={5}
            placeholder="Enter institutional directions, document submission deadlines, counter clearance confirmation..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        {/* Audit Remarks */}
        <div className="form-group">
          <label className="form-label">Internal Audit Remarks (Optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Verified original medical certificate with Dr. Sharma, AC-4 approved."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-purple" disabled={isSubmitting}>
            <Send size={15} />
            <span>{isSubmitting ? 'Posting Response...' : 'Submit Official Response'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
