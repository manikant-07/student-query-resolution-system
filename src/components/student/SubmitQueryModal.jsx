import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { 
  matchFAQs, 
  evaluateExpertRules, 
  calculateBayesianCategory 
} from '../../utils/aiEngine';
import { 
  Sparkles, 
  Send, 
  CheckCircle, 
  HelpCircle, 
  Zap, 
  AlertCircle,
  BookOpen
} from 'lucide-react';

export function SubmitQueryModal({ isOpen, onClose }) {
  const { submitQuery, faqs } = useApp();

  const [formData, setFormData] = useState({
    subject: '',
    category: 'Attendance',
    priority: 'Medium',
    description: '',
    tags: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time AI suggestions
  const aiEvaluation = useMemo(() => {
    if (!formData.subject && !formData.description) return null;
    const ruleMatch = evaluateExpertRules(formData);
    const matchedFaqs = matchFAQs(formData.subject, formData.description, formData.category, faqs);
    const bayesCategories = calculateBayesianCategory(`${formData.subject} ${formData.description}`);

    return {
      ruleMatch,
      matchedFaqs: matchedFaqs.slice(0, 2),
      topBayesCategory: bayesCategories[0]
    };
  }, [formData, faqs]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.description.trim()) {
      alert("Please provide both a subject and a description for your query.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const tagList = formData.tags
        ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        : [formData.category.toLowerCase()];

      submitQuery({
        ...formData,
        tags: tagList
      });

      setIsSubmitting(false);
      setFormData({
        subject: '',
        category: 'Attendance',
        priority: 'Medium',
        description: '',
        tags: ''
      });
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Academic Query"
      subtitle="Fill in your inquiry details. Our AI engine instantly evaluates rules and suggests relevant FAQs."
      maxWidth="720px"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid-2">
          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Attendance">Attendance & Condonation</option>
              <option value="Exams">Examinations & Hall Ticket</option>
              <option value="Fees">Tuition Fees & Accounts</option>
              <option value="Timetable">Timetable & Elective Scheduling</option>
              <option value="Technical">IT & Campus Network</option>
              <option value="Hostel">Hostel & Student Welfare</option>
            </select>
          </div>

          {/* Priority */}
          <div className="form-group">
            <label className="form-label">Priority Level</label>
            <select
              className="form-select"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="Low">Low - General Information</option>
              <option value="Medium">Medium - Regular Processing</option>
              <option value="High">High - Timely Requirement</option>
              <option value="Urgent">Urgent - Immediate Exam/Fee Deadline</option>
            </select>
          </div>
        </div>

        {/* Subject */}
        <div className="form-group">
          <label className="form-label">Subject / Issue Summary *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Attendance Shortage in AI Lab due to medical hospitalization"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">Detailed Description *</label>
          <textarea
            className="form-textarea"
            placeholder="Provide context, dates, course codes, or reference transaction numbers..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={4}
          />
        </div>

        {/* Tags */}
        <div className="form-group">
          <label className="form-label">Tags (comma-separated)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. medical-leave, cs201, hall-ticket"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          />
        </div>

        {/* Real-time AI Assistant Card */}
        {aiEvaluation && (formData.subject.length > 5 || formData.description.length > 10) && (
          <div
            style={{
              background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)',
              border: '1px solid #bfdbfe',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.25rem',
              animation: 'fadeIn 200ms ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#1e40af', fontWeight: 700, fontSize: '0.875rem' }}>
                <Sparkles size={16} />
                <span>AI Live Diagnostic & Policy Suggestion</span>
              </div>
              <span
                style={{
                  fontSize: '0.725rem',
                  fontWeight: 700,
                  background: '#dbeafe',
                  color: '#1d4ed8',
                  padding: '2px 8px',
                  borderRadius: '999px'
                }}
              >
                Certainty: {Math.round(aiEvaluation.ruleMatch.certaintyScore * 100)}%
              </span>
            </div>

            <p style={{ fontSize: '0.825rem', color: '#1e293b', marginBottom: '0.5rem', lineHeight: 1.4 }}>
              <strong>Suggested Rule:</strong> {aiEvaluation.ruleMatch.conclusion}
            </p>

            {aiEvaluation.topBayesCategory && (
              <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Bayesian Classification: <strong>{aiEvaluation.topBayesCategory.category}</strong> (P = {Math.round(aiEvaluation.topBayesCategory.probability * 100)}%)</span>
              </div>
            )}

            {/* Instant matching FAQ cards */}
            {aiEvaluation.matchedFaqs.length > 0 && (
              <div style={{ marginTop: '0.75rem', borderTop: '1px dashed #bfdbfe', paddingTop: '0.65rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>
                  Related FAQ match ({Math.round(aiEvaluation.matchedFaqs[0].relevanceScore * 100)}% relevance):
                </span>
                <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '3px', background: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <strong>Q:</strong> {aiEvaluation.matchedFaqs[0].question}
                  <div style={{ marginTop: '4px', color: '#0f172a' }}>
                    <strong>A:</strong> {aiEvaluation.matchedFaqs[0].answer}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            <Send size={16} />
            <span>{isSubmitting ? 'Analyzing & Submitting...' : 'Submit Query'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
