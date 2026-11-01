import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  matchFAQs, 
  evaluateExpertRules, 
  calculateBayesianCategory 
} from '../utils/aiEngine';
import { 
  PlusCircle, 
  Send, 
  Sparkles, 
  UploadCloud, 
  Paperclip, 
  FileText, 
  X, 
  UserX, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

export function AskQueryPage() {
  const navigate = useNavigate();
  const { submitQuery, faqs, faculty, studentUser } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    subject: 'Artificial Intelligence & ML',
    category: 'Attendance',
    priority: 'Medium',
    description: '',
    isAnonymous: false,
    assignedFaculty: 'Auto-Assign via CSP',
    tags: ''
  });

  const [attachmentFile, setAttachmentFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  // Dynamic AI Suggestions while typing
  const aiEvaluation = useMemo(() => {
    if (!formData.title && !formData.description) return null;
    const ruleMatch = evaluateExpertRules({ subject: formData.title, category: formData.category, description: formData.description });
    const matchedFaqs = matchFAQs(formData.title, formData.description, formData.category, faqs);
    const bayesCategories = calculateBayesianCategory(`${formData.title} ${formData.description}`);

    return {
      ruleMatch,
      matchedFaqs: matchedFaqs.slice(0, 3),
      topBayesCategory: bayesCategories[0]
    };
  }, [formData.title, formData.description, formData.category, faqs]);

  const handleFileChange = (e) => {
    setFileError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds 10 MB limit.');
      return;
    }
    setAttachmentFile(file);
  };

  const handleRemoveFile = () => {
    setAttachmentFile(null);
    setFileError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;

    try {
      setIsSubmitting(true);
      const assignedFacObj = formData.assignedFaculty !== 'Auto-Assign via CSP' 
        ? faculty.find(f => f.name === formData.assignedFaculty) 
        : null;

      const submissionPayload = {
        subject: formData.title.trim(),
        title: formData.title.trim(),
        category: formData.category,
        priority: formData.priority,
        description: formData.description.trim(),
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [formData.category.toLowerCase()],
        isAnonymous: formData.isAnonymous,
        assignedTo: assignedFacObj ? assignedFacObj.name : 'Unassigned',
        assignedFacultyId: assignedFacObj ? assignedFacObj.id : null,
      };

      const result = await submitQuery(submissionPayload, attachmentFile);
      const ticketId = result?.id || `QRY-${Math.floor(1000 + Math.random() * 9000)}`;

      setSubmittedTicket({
        id: ticketId,
        title: formData.title,
        category: formData.category,
        priority: formData.priority
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ paddingBottom: '3.5rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--primary-light)', color: 'var(--primary)', padding: '3px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.785rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
          <Sparkles size={14} />
          <span>Intelligent Submission Portal</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em', marginBottom: '0.4rem' }}>
          Submit a New Academic Query
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Fill out the details below. Our AI expert system analyzes regulations and routes your inquiry to verified department mentors.
        </p>
      </div>

      {submittedTicket ? (
        /* Success State Card */
        <div
          className="glass-card"
          style={{
            maxWidth: '680px',
            margin: '2rem auto',
            padding: '3.5rem 2.5rem',
            textAlign: 'center',
            borderRadius: 'var(--radius-card)',
            boxShadow: 'var(--shadow-xl)'
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'var(--success-light)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '0 0 24px rgba(16, 185, 129, 0.35)'
            }}
          >
            <CheckCircle2 size={40} />
          </div>

          <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>
            Query Submitted Successfully!
          </h2>
          <div
            style={{
              display: 'inline-block',
              padding: '0.4rem 1.25rem',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: '1.25rem',
              margin: '0.85rem 0 1.25rem'
            }}
          >
            Ticket #{submittedTicket.id}
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 2rem' }}>
            Your query <strong>"{submittedTicket.title}"</strong> has been auto-logged into the SolveHub resolution queue. You will receive real-time notification once a mentor replies.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/queries" className="btn btn-primary btn-pill">
              <span>View in My Queries</span>
              <ArrowRight size={16} />
            </Link>
            <button
              onClick={() => {
                setSubmittedTicket(null);
                setFormData({
                  title: '',
                  subject: 'Artificial Intelligence & ML',
                  category: 'Attendance',
                  priority: 'Medium',
                  description: '',
                  isAnonymous: false,
                  assignedFaculty: 'Auto-Assign via CSP',
                  tags: ''
                });
                setAttachmentFile(null);
              }}
              className="btn btn-secondary btn-pill"
            >
              <span>Submit Another Query</span>
            </button>
          </div>
        </div>
      ) : (
        /* Form & AI Suggestion Grid */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '2rem',
            alignItems: 'start'
          }}
          className="ask-query-grid"
        >
          {/* Left Column: Glass Form */}
          <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2.5rem' }}>
            {/* Title */}
            <div className="form-group">
              <label className="form-label">Query Title / Headline *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Mid-term Attendance Condonation Request or Hall Ticket Block"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Subject & Category Row */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Subject / Academic Area</label>
                <select
                  className="form-select"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="Artificial Intelligence & ML">Artificial Intelligence & ML</option>
                  <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                  <option value="Cloud Computing & DevOps">Cloud Computing & DevOps</option>
                  <option value="Mathematics IV / Statistics">Mathematics IV / Statistics</option>
                  <option value="Database Management Systems">Database Management Systems</option>
                  <option value="Examination Branch Office">Examination Branch Office</option>
                  <option value="Accounts & Finance">Accounts & Finance</option>
                  <option value="Hostel & Welfare">Hostel & Welfare</option>
                  <option value="General Academic">General Academic</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Attendance">Attendance (Medical / Condonation)</option>
                  <option value="Exams">Exams & Hall Tickets</option>
                  <option value="Fees">Fee Installment & Receipts</option>
                  <option value="Timetable">Timetable & Elective Clashes</option>
                  <option value="Technical">Campus Tech & Wi-Fi</option>
                  <option value="Hostel">Hostel & Facilities</option>
                  <option value="Other">Other Inquiries</option>
                </select>
              </div>
            </div>

            {/* Priority Selector */}
            <div className="form-group">
              <label className="form-label">Priority Level</label>
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                {['Low', 'Medium', 'Urgent'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: p })}
                    className="btn btn-sm btn-pill"
                    style={{
                      flex: 1,
                      background: formData.priority === p 
                        ? (p === 'Urgent' ? 'var(--danger)' : p === 'Medium' ? 'var(--primary)' : 'var(--bg-subtle)')
                        : 'var(--bg-card)',
                      color: formData.priority === p 
                        ? (p === 'Medium' ? '#060D09' : '#ffffff') 
                        : 'var(--text-secondary)',
                      borderColor: formData.priority === p ? 'transparent' : 'var(--border)'
                    }}
                  >
                    {p === 'Urgent' && '🔥 '}
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Rich-Text Description */}
            <div className="form-group">
              <label className="form-label">Detailed Description *</label>
              <textarea
                className="form-textarea"
                placeholder="Provide complete facts, dates, transaction IDs, or medical leave details..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                style={{ minHeight: '130px' }}
              />
            </div>

            {/* Drag & Drop File Upload */}
            <div className="form-group">
              <label className="form-label">Attachments (Medical Slips, Fee Receipts, Screenshots)</label>
              {attachmentFile ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.25rem',
                    background: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FileText size={20} color="var(--primary)" />
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {attachmentFile.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {(attachmentFile.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--danger)' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="dropzone-box" onClick={() => document.getElementById('query-file-upload').click()}>
                  <input
                    id="query-file-upload"
                    type="file"
                    accept=".pdf,image/png,image/jpeg,image/jpg"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <UploadCloud size={32} color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-primary)' }}>
                    Click or drag & drop documents here
                  </div>
                  <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Supports PDF, JPG, PNG up to 10 MB
                  </div>
                </div>
              )}
              {fileError && <p style={{ color: 'var(--danger)', fontSize: '0.785rem', marginTop: '4px' }}>{fileError}</p>}
            </div>

            {/* Teacher Selection & Anonymity Controls */}
            <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Assign to Specific Mentor</label>
                <select
                  className="form-select"
                  value={formData.assignedFaculty}
                  onChange={(e) => setFormData({ ...formData, assignedFaculty: e.target.value })}
                >
                  <option value="Auto-Assign via CSP">⚡ Auto-Assign via CSP Workload Engine</option>
                  {faculty.map((f) => (
                    <option key={f.id} value={f.name}>
                      {f.name} ({f.department})
                    </option>
                  ))}
                </select>
              </div>

              {/* Anonymous Toggle */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Ask Anonymously
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Hide your name & roll number
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                  style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-pill btn-lg"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Send size={18} />
              <span>{isSubmitting ? 'Routing Ticket...' : 'Submit Query for Resolution'}</span>
            </button>
          </form>

          {/* Right Column: AI Suggestions Panel ("Similar questions already answered") */}
          <div>
            <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Sparkles size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-heading)' }}>
                  AI Suggestion Assistant
                </h3>
              </div>

              {aiEvaluation ? (
                <div>
                  {/* Expert Rule Matched */}
                  {aiEvaluation.ruleMatch?.ruleFired && (
                    <div
                      style={{
                        background: 'var(--primary-light)',
                        border: '1px solid var(--border-accent)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1rem',
                        marginBottom: '1.25rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                        <CheckCircle2 size={15} />
                        <span>Rule Fired: {aiEvaluation.ruleMatch.ruleFired}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.45, fontWeight: 600 }}>
                        {aiEvaluation.ruleMatch.conclusion}
                      </p>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Confidence Factor: {(aiEvaluation.ruleMatch.certaintyScore * 100).toFixed(0)}%
                      </div>
                    </div>
                  )}

                  {/* Similar Questions / FAQs */}
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 700 }}>
                    Similar questions already answered:
                  </h4>
                  {aiEvaluation.matchedFaqs.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {aiEvaluation.matchedFaqs.map((faq, i) => (
                        <div
                          key={i}
                          style={{
                            background: 'var(--bg-subtle)',
                            padding: '0.85rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border)'
                          }}
                        >
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                            {faq.q}
                          </div>
                          <div style={{ fontSize: '0.785rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                            {faq.a}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      Keep typing to surface matching university ordinances and past resolutions.
                    </p>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                  <HelpCircle size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
                  <p style={{ fontSize: '0.85rem' }}>
                    Start typing your title or description to see real-time AI category matching and similar answers.
                  </p>
                </div>
              )}
            </div>

            {/* Security Assurance Card */}
            <div className="glass-card" style={{ padding: '1.25rem', background: 'var(--bg-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <ShieldCheck size={16} color="var(--primary)" />
                <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Campus Ordinance SLA
                </span>
              </div>
              <p style={{ fontSize: '0.785rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                All queries logged through SolveHub are legally stamped with server timestamps for practical exam eligibility and university compliance.
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .ask-query-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
