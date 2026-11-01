import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { getAttachmentDownloadUrl } from '../../utils/supabaseClient';
import { UserAvatar } from '../common/UserAvatar';
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
  Tag, 
  Paperclip, 
  Download, 
  History, 
  CheckCircle2,
  Star,
  RefreshCw,
  Check
} from 'lucide-react';

export function QueryDetailModal({ query, isOpen, onClose }) {
  const { voteQueryFeedback, replyToQuery, updateQueryStatus, role, currentUser, showToast } = useApp();
  const [replyText, setReplyText] = useState('');
  const [downloadingFile, setDownloadingFile] = useState(null);

  // Star Rating & Feedback State
  const [userRating, setUserRating] = useState(5);
  const [feedbackRemarks, setFeedbackRemarks] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  if (!query) return null;

  // Determine current step in 4-step stepper (Submitted -> Assigned -> In Progress -> Resolved)
  const getStepperActiveIndex = (status, assignedTo) => {
    if (status === 'Resolved') return 4;
    if (status === 'Answered') return 3;
    if (assignedTo && assignedTo !== 'Unassigned') return 2;
    return 1;
  };

  const currentStep = getStepperActiveIndex(query.status, query.assignedTo);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    await replyToQuery(query.id, replyText);
    setReplyText('');
    showToast('Reply message delivered to resolution thread.', 'success');
  };

  const handleMarkResolved = async () => {
    await updateQueryStatus(query.id, 'Resolved', 'Student confirmed resolution');
    showToast('Query marked as fully resolved!', 'success');
  };

  const handleReopenQuery = async () => {
    await updateQueryStatus(query.id, 'Pending', 'Query reopened by student for further clarification');
    showToast('Query reopened for mentor review.', 'info');
  };

  const handleSubmitRating = (e) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    showToast(`Thank you! ${userRating}-star rating submitted.`, 'success');
  };

  const handleDownloadAttachment = async (attachment) => {
    try {
      setDownloadingFile(attachment.id);
      const url = await getAttachmentDownloadUrl(attachment.filePath);
      if (url) {
        window.open(url, '_blank');
      } else {
        alert('Download link could not be generated. Check permissions.');
      }
    } catch (err) {
      console.error(err);
      alert('Error downloading attachment.');
    } finally {
      setDownloadingFile(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ticket #${query.id}`}
      subtitle={`Submitted on ${new Date(query.createdAt).toLocaleDateString()} at ${new Date(query.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
      maxWidth="780px"
    >
      <div>
        {/* =====================================================================
            STATUS STEPPER: Submitted -> Assigned -> In Progress -> Resolved
            ===================================================================== */}
        <div
          style={{
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            border: '1px solid var(--border)',
            marginBottom: '1.5rem',
          }}
        >
          <div className="status-stepper">
            <div className="stepper-line" />

            {[
              { idx: 1, label: 'Submitted' },
              { idx: 2, label: 'Assigned' },
              { idx: 3, label: 'In Progress' },
              { idx: 4, label: 'Resolved' }
            ].map(step => (
              <div
                key={step.idx}
                className={`status-step ${currentStep >= step.idx ? 'completed' : ''} ${currentStep === step.idx ? 'active' : ''}`}
              >
                <div className="step-circle">
                  {currentStep > step.idx ? <Check size={16} /> : step.idx}
                </div>
                <span className="step-label">{step.label}</span>
              </div>
            ))}
          </div>

          {/* Action Resolution Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <StatusBadge status={query.status} />
              <PriorityBadge priority={query.priority} />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {query.status !== 'Resolved' ? (
                <button
                  type="button"
                  onClick={handleMarkResolved}
                  className="btn btn-primary btn-sm btn-pill"
                >
                  <CheckCircle2 size={15} />
                  <span>Mark as Resolved</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleReopenQuery}
                  className="btn btn-secondary btn-sm btn-pill"
                  style={{ color: 'var(--warning)', borderColor: 'var(--border)' }}
                >
                  <RefreshCw size={14} />
                  <span>Reopen Query</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Query Subject & Description */}
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '0.65rem', fontFamily: 'var(--font-heading)' }}>
            {query.subject}
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {query.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <div>
              Student: <strong>{query.studentName || 'Student'}</strong> ({query.studentRoll || 'Verified'})
            </div>
            <div>
              Assigned Mentor: <strong style={{ color: 'var(--primary)' }}>{query.assignedTo || 'Pending'}</strong>
            </div>
          </div>
        </div>

        {/* AI Rule Recommendation Banner (if triggered) */}
        {query.suggestedAnswer && (
          <div
            style={{
              background: 'var(--primary-light)',
              border: '1px solid var(--border-accent)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--primary)', fontWeight: 800, fontSize: '0.825rem', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              <Sparkles size={16} />
              <span>AI Recommendation ({query.matchedRule || 'Knowledge Rule'})</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 600 }}>
              {query.suggestedAnswer}
            </p>
          </div>
        )}

        {/* File Attachments */}
        {query.attachments && query.attachments.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <h5 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 700 }}>
              Attached Documents ({query.attachments.length})
            </h5>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
              {query.attachments.map(att => (
                <div
                  key={att.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.55rem 0.95rem',
                    background: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)'
                  }}
                >
                  <Paperclip size={16} color="var(--primary)" />
                  <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {att.fileName}
                  </span>
                  <button
                    onClick={() => handleDownloadAttachment(att)}
                    disabled={downloadingFile === att.id}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '2px 6px' }}
                    title="Download document"
                  >
                    <Download size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conversation Thread UI */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <MessageSquare size={17} color="var(--primary)" />
            <h4 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
              Conversation Thread ({query.replies ? query.replies.length : 0})
            </h4>
          </div>

          {(!query.replies || query.replies.length === 0) ? (
            <div
              style={{
                background: 'var(--bg-subtle)',
                border: '1px dashed var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                textAlign: 'center',
                color: 'var(--text-muted)'
              }}
            >
              <Clock size={28} style={{ margin: '0 auto 0.5rem', opacity: 0.6 }} />
              <p style={{ fontSize: '0.9rem' }}>
                No messages yet. The assigned mentor ({query.assignedTo}) has received the inquiry.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {query.replies.map((reply) => (
                <div
                  key={reply.id}
                  className="glass-card"
                  style={{
                    padding: '1.15rem 1.25rem',
                    borderRadius: 'var(--radius-lg)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <UserAvatar name={reply.author} size="xs" />
                      <span style={{ fontWeight: 700, fontSize: '0.885rem', color: 'var(--text-primary)' }}>
                        {reply.author}
                      </span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          background: 'var(--primary-light)',
                          color: 'var(--primary)',
                          padding: '1px 8px',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: 700
                        }}
                      >
                        {reply.role || 'Official'}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {new Date(reply.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>
                    {reply.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Reply Box */}
        <form onSubmit={handleSendReply} style={{ marginBottom: '1.75rem' }}>
          <div className="form-group" style={{ marginBottom: '0.65rem' }}>
            <textarea
              className="form-textarea"
              placeholder={role === 'student' ? "Send reply or question to your mentor..." : "Add official resolution guidance..."}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={3}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="btn btn-primary btn-pill btn-sm"
              disabled={!replyText.trim()}
            >
              <Send size={14} />
              <span>Send Message</span>
            </button>
          </div>
        </form>

        {/* =====================================================================
            STAR RATING & FEEDBACK BOX
            ===================================================================== */}
        {query.status === 'Resolved' && (
          <div
            className="glass-card"
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
              <Star size={18} color="#F59E0B" fill="#F59E0B" />
              <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-heading)' }}>
                Rate Your Resolution Experience
              </h4>
            </div>

            {feedbackSubmitted ? (
              <div style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} />
                <span>Thank you! Your feedback has been logged for faculty quality metrics.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitRating}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  How satisfied are you with the explanation and response time provided by <strong>{query.assignedTo}</strong>?
                </p>

                {/* 5-Star Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '2px',
                        color: userRating >= star ? '#F59E0B' : 'var(--text-muted)',
                        transform: userRating >= star ? 'scale(1.15)' : 'scale(1)',
                        transition: 'all 120ms'
                      }}
                    >
                      <Star size={24} fill={userRating >= star ? '#F59E0B' : 'transparent'} />
                    </button>
                  ))}
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F59E0B', marginLeft: '6px' }}>
                    {userRating} / 5 Stars
                  </span>
                </div>

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Optional feedback: Was the resolution clear and helpful?"
                    value={feedbackRemarks}
                    onChange={(e) => setFeedbackRemarks(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-sm btn-pill">
                  <span>Submit Star Rating</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
