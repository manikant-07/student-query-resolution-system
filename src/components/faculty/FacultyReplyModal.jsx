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
  FileText
} from 'lucide-react';

export function FacultyReplyModal({ query, isOpen, onClose }) {
  const { replyToQuery, assignQuery, faculty } = useApp();

  const [message, setMessage] = useState('');
  const [newStatus, setNewStatus] = useState('Answered');
  const [assignedFaculty, setAssignedFaculty] = useState('');

  if (!query) return null;

  const handleUseAISuggestion = () => {
    if (query.suggestedAnswer) {
      setMessage(query.suggestedAnswer);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      alert("Please enter a response message.");
      return;
    }

    replyToQuery(query.id, message, newStatus);

    if (assignedFaculty && assignedFaculty !== query.assignedTo) {
      const facObj = faculty.find(f => f.name === assignedFaculty);
      assignQuery(query.id, assignedFaculty, facObj ? facObj.department : query.assignedDept);
    }

    setMessage('');
    onClose();
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
            background: '#f8fafc',
            borderRadius: '10px',
            padding: '1rem',
            border: '1px solid #e2e8f0',
            marginBottom: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <h5 style={{ fontSize: '0.95rem', color: '#0f172a' }}>{query.subject}</h5>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <StatusBadge status={query.status} />
              <PriorityBadge priority={query.priority} />
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
            {query.description}
          </p>
        </div>

        {/* AI Suggestion Preview & Shortcut */}
        {query.suggestedAnswer && (
          <div
            style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1d4ed8', fontWeight: 700, fontSize: '0.8rem' }}>
                <Sparkles size={14} />
                <span>AI Automated Knowledge Suggestion</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#1e3a8a', marginTop: '3px', lineHeight: 1.4 }}>
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

          {/* Assign to Faculty */}
          <div className="form-group">
            <label className="form-label">Assign / Transfer Faculty In-Charge</label>
            <select
              className="form-select"
              value={assignedFaculty || query.assignedTo || ''}
              onChange={(e) => setAssignedFaculty(e.target.value)}
            >
              <option value="Unassigned">-- Unassigned --</option>
              {faculty.map(fac => (
                <option key={fac.id} value={fac.name} disabled={!fac.available}>
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

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-purple">
            <Send size={15} />
            <span>Submit Official Response</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
