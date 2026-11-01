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
  CheckCircle2
} from 'lucide-react';

export function QueryDetailModal({ query, isOpen, onClose }) {
  const { voteQueryFeedback, replyToQuery, role, currentUser } = useApp();
  const [replyText, setReplyText] = useState('');
  const [downloadingFile, setDownloadingFile] = useState(null);

  if (!query) return null;

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    await replyToQuery(query.id, replyText);
    setReplyText('');
  };

  const handleDownloadAttachment = async (attachment) => {
    try {
      setDownloadingFile(attachment.id);
      const url = await getAttachmentDownloadUrl(attachment.filePath);
      if (url) {
        window.open(url, '_blank');
      } else {
        alert('Could not generate download link. Please check permissions.');
      }
    } catch (err) {
      console.error(err);
      alert('Error downloading attachment.');
    } finally {
      setDownloadingFile(null);
    }
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
            background: 'var(--bg-subtle)',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <StatusBadge status={query.status} />
            <PriorityBadge priority={query.priority} />
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                padding: '2px 8px',
                borderRadius: '6px',
              }}
            >
              {query.category}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
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
          <h4 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            {query.subject}
          </h4>
          <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {query.description}
          </p>

          {/* Tags */}
          {query.tags && query.tags.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <Tag size={14} color="var(--text-muted)" />
              {query.tags.map(t => (
                <span
                  key={t}
                  style={{
                    fontSize: '0.75rem',
                    background: 'var(--bg-subtle)',
                    color: 'var(--text-muted)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                  }}
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Uploaded Documents & Attachments */}
        {query.attachments && query.attachments.length > 0 && (
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.65rem' }}>
              <Paperclip size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Attached Verification Documents ({query.attachments.length})
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {query.attachments.map(att => (
                <div
                  key={att.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem',
                    background: 'var(--bg-subtle)',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {att.fileName}
                    </span>
                    {att.fileSize && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        ({(att.fileSize / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDownloadAttachment(att)}
                    disabled={downloadingFile === att.id}
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '0.35rem' }}
                  >
                    <Download size={13} />
                    <span>{downloadingFile === att.id ? 'Accessing...' : 'View / Download'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Automated AI Suggestion Card */}
        {query.suggestedAnswer && (
          <div
            style={{
              background: 'var(--hero-gradient)',
              border: '1px solid var(--primary-glow)',
              borderRadius: '12px',
              padding: '1.15rem',
              marginBottom: '1.5rem',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>
                <Sparkles size={18} />
                <span>AI Automated Knowledge Suggestion</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    padding: '2px 8px',
                    borderRadius: '999px',
                  }}
                >
                  Certainty: {Math.round((query.certaintyScore || 0.8) * 100)}%
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    padding: '2px 6px',
                    borderRadius: '6px',
                  }}
                >
                  Rule: {query.matchedRule || 'KNOWLEDGE_BASE'}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.885rem', color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '0.65rem' }}>
              {query.suggestedAnswer}
            </p>

            {query.explanation && (
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', borderTop: '1px dashed var(--border)', paddingTop: '0.5rem', fontStyle: 'italic' }}>
                <strong>Explanation Facility:</strong> {query.explanation}
              </p>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                Was this automated recommendation helpful?
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => voteQueryFeedback(query.id, true)}
                  className="btn btn-secondary btn-sm"
                  style={{
                    background: feedback.userVoted === 'helpful' ? 'var(--success-light)' : 'var(--bg-card)',
                    color: feedback.userVoted === 'helpful' ? 'var(--success)' : 'var(--text-secondary)',
                    borderColor: feedback.userVoted === 'helpful' ? 'var(--success)' : 'var(--border)',
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
                    background: feedback.userVoted === 'notHelpful' ? 'var(--danger-light)' : 'var(--bg-card)',
                    color: feedback.userVoted === 'notHelpful' ? 'var(--danger)' : 'var(--text-secondary)',
                    borderColor: feedback.userVoted === 'notHelpful' ? 'var(--danger)' : 'var(--border)',
                  }}
                >
                  <ThumbsDown size={14} />
                  <span>Not Helpful ({feedback.notHelpful})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Lifecycle Audit History */}
        {query.statusHistory && query.statusHistory.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.65rem' }}>
              <History size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Query Lifecycle & Status Audit Trail
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {query.statusHistory.map(h => (
                <div
                  key={h.id}
                  style={{
                    padding: '0.5rem 0.75rem',
                    background: 'var(--bg-subtle)',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Status transition: </span>
                    <strong>{h.oldStatus || 'Created'}</strong> ➔ <strong style={{ color: 'var(--primary)' }}>{h.newStatus}</strong>
                    {h.remarks && <span style={{ color: 'var(--text-secondary)', marginLeft: '6px' }}>({h.remarks})</span>}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    by {h.changedByName || 'System'} • {new Date(h.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conversation & Official Faculty Resolution Thread */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <MessageSquare size={17} color="var(--primary)" />
            <h5 style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              Official Responses & Resolution Thread ({query.replies ? query.replies.length : 0})
            </h5>
          </div>

          {(!query.replies || query.replies.length === 0) ? (
            <div
              style={{
                background: 'var(--bg-subtle)',
                border: '1px dashed var(--border)',
                borderRadius: '10px',
                padding: '1.5rem',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
              }}
            >
              <Clock size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.6 }} />
              <p>No faculty replies posted yet. Your query is currently under review by {query.assignedTo}.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {query.replies.map((reply) => (
                <div
                  key={reply.id}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <UserAvatar name={reply.author} size="xs" />
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                        {reply.author}
                      </span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          background: 'var(--primary-light)',
                          color: 'var(--primary)',
                          padding: '1px 7px',
                          borderRadius: '999px',
                          fontWeight: 600,
                        }}
                      >
                        {reply.role || 'Official Resolution'}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {new Date(reply.timestamp).toLocaleDateString()} {new Date(reply.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                    {reply.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reply Box */}
        <form onSubmit={handleSendReply} style={{ marginTop: '1rem' }}>
          <div className="form-group" style={{ marginBottom: '0.65rem' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>
              {role === 'student' ? 'Post Follow-up Question or Acknowledgment' : 'Add Official Response to Query'}
            </label>
            <textarea
              className="form-textarea"
              placeholder={role === 'student' ? "Type follow-up inquiry or confirm resolution..." : "Write institutional instructions, policy updates or meeting schedule..."}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={3}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!replyText.trim()}
              style={{ gap: '0.4rem' }}
            >
              <Send size={15} />
              <span>Send Message</span>
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
