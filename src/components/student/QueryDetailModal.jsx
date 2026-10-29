import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Clock, 
  User, 
  Building, 
  Send,
  AlertCircle,
  Tag
} from 'lucide-react';

export function QueryDetailModal({ query, isOpen, onClose }) {
  const { voteQueryFeedback, replyToQuery, role, studentUser } = useApp();
  const [replyText, setReplyText] = useState('');

  if (!query) return null;

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    replyToQuery(query.id, replyText);
    setReplyText('');
  };

  const feedback = query.feedback || { helpful: 0, notHelpful: 0, userVoted: null };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Query Details: ${query.id}`}
      subtitle={`Submitted on ${new Date(query.createdAt).toLocaleDateString()} at ${new Date(query.createdAt).toLocaleTimeString()}`}
      maxWidth="780px"
    >
      <div>
        {/* Status & Metadata Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            background: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            marginBottom: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <StatusBadge status={query.status} />
            <PriorityBadge priority={query.priority} />
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                background: '#e0f2fe',
                color: '#0369a1',
                padding: '2px 8px',
                borderRadius: '6px'
              }}
            >
              {query.category}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <User size={14} />
              {query.studentName} ({query.studentRoll})
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Building size={14} />
              {query.assignedDept || 'Academic Cell'}
            </span>
          </div>
        </div>

        {/* Subject & Description */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h4 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '0.5rem' }}>
            {query.subject}
          </h4>
          <p style={{ fontSize: '0.925rem', color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {query.description}
          </p>

          {/* Tags */}
          {query.tags && query.tags.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <Tag size={14} color="#94a3b8" />
              {query.tags.map(t => (
                <span
                  key={t}
                  style={{
                    fontSize: '0.75rem',
                    background: '#f1f5f9',
                    color: '#475569',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Automated AI Suggestion Card */}
        {query.suggestedAnswer && (
          <div
            style={{
              background: 'linear-gradient(135deg, #f0f7ff 0%, #faf5ff 100%)',
              border: '1px solid #c7d2fe',
              borderRadius: '12px',
              padding: '1.15rem',
              marginBottom: '1.5rem',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4338ca', fontWeight: 700, fontSize: '0.9rem' }}>
                <Sparkles size={18} />
                <span>AI Automated Knowledge Suggestion</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: '#e0e7ff',
                    color: '#3730a3',
                    padding: '2px 8px',
                    borderRadius: '999px'
                  }}
                >
                  Certainty: {Math.round((query.certaintyScore || 0.8) * 100)}%
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: '#64748b',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    padding: '2px 6px',
                    borderRadius: '6px'
                  }}
                >
                  Rule: {query.matchedRule || 'KNOWLEDGE_BASE'}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.885rem', color: '#1e293b', lineHeight: 1.5, marginBottom: '0.65rem' }}>
              {query.suggestedAnswer}
            </p>

            {query.explanation && (
              <p style={{ fontSize: '0.775rem', color: '#6b7280', borderTop: '1px dashed #cbd5e1', paddingTop: '0.5rem', fontStyle: 'italic' }}>
                <strong>Explanation Facility:</strong> {query.explanation}
              </p>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid #e0e7ff' }}>
              <span style={{ fontSize: '0.775rem', color: '#64748b' }}>
                Was this automated recommendation helpful?
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => voteQueryFeedback(query.id, true)}
                  className="btn btn-secondary btn-sm"
                  style={{
                    background: feedback.userVoted === 'helpful' ? '#dcfce7' : '#ffffff',
                    color: feedback.userVoted === 'helpful' ? '#166534' : '#475569',
                    borderColor: feedback.userVoted === 'helpful' ? '#86efac' : '#e2e8f0'
                  }}
                >
                  <ThumbsUp size={14} />
                  <span>Helpful ({feedback.helpful})</span>
                </button>
                <button
                  type="button"
                  onClick={() => voteQueryFeedback(query.id, false)}
                  className="btn btn-secondary btn-sm"
                  style={{
                    background: feedback.userVoted === 'notHelpful' ? '#fee2e2' : '#ffffff',
                    color: feedback.userVoted === 'notHelpful' ? '#991b1b' : '#475569',
                    borderColor: feedback.userVoted === 'notHelpful' ? '#fca5a5' : '#e2e8f0'
                  }}
                >
                  <ThumbsDown size={14} />
                  <span>Not Helpful ({feedback.notHelpful})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Conversation & Official Faculty Resolution Thread */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <MessageSquare size={17} color="#2563eb" />
            <h5 style={{ fontSize: '0.95rem', color: '#0f172a' }}>
              Official Responses & Resolution Thread ({query.replies ? query.replies.length : 0})
            </h5>
          </div>

          {(!query.replies || query.replies.length === 0) ? (
            <div
              style={{
                background: '#f8fafc',
                border: '1px dashed #cbd5e1',
                borderRadius: '10px',
                padding: '1.25rem',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '0.85rem'
              }}
            >
              No faculty reply has been posted yet. The query has been assigned to{' '}
              <strong>{query.assignedTo !== 'Unassigned' ? query.assignedTo : query.assignedDept}</strong> for departmental review.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {query.replies.map(rep => (
                <div
                  key={rep.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderLeft: '4px solid #2563eb',
                    borderRadius: '8px',
                    padding: '0.95rem 1.15rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>
                        {rep.author}
                      </span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          background: '#eff6ff',
                          color: '#1d4ed8',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontWeight: 600
                        }}
                      >
                        {rep.role}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {new Date(rep.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(rep.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.885rem', color: '#334155', lineHeight: 1.5 }}>
                    {rep.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Follow-up Form */}
        <form onSubmit={handleSendReply} style={{ marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
          <div className="form-group" style={{ marginBottom: '0.5rem' }}>
            <label className="form-label" style={{ fontSize: '0.825rem' }}>
              Post Follow-Up Message or Clarification
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Type a follow-up response or additional detail..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
                <Send size={15} />
                <span>Send</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
