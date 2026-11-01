import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { SubmitQueryModal } from '../components/student/SubmitQueryModal';
import { QueryDetailModal } from '../components/student/QueryDetailModal';
import { FAQSection } from '../components/student/FAQSection';
import { UserAvatar } from '../components/common/UserAvatar';
import {
  PlusCircle,
  Search,
  Filter,
  ArrowUpDown,
  MessageSquare,
  Eye,
  ThumbsUp,
  Sparkles,
  GraduationCap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Paperclip
} from 'lucide-react';

export function StudentDashboard() {
  const { queries, studentUser, role, currentUser } = useApp();

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);

  // Active query derived from live queries array
  const activeSelectedQuery = useMemo(() => {
    if (!selectedQuery) return null;
    return queries.find(q => q.id === selectedQuery.id || (q.dbId && q.dbId === selectedQuery.dbId)) || selectedQuery;
  }, [queries, selectedQuery]);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Enforce Student Privacy: Student sees only their own queries
  const studentSpecificQueries = useMemo(() => {
    if (role === 'student') {
      const activeId = currentUser?.uid || currentUser?.id;
      const activeEmail = currentUser?.email?.toLowerCase();
      const activeName = studentUser?.name?.toLowerCase();
      const activeRoll = studentUser?.roll?.toLowerCase();

      return queries.filter(q => {
        // Match user's Google UID or ID
        if (activeId && q.studentId === activeId) return true;
        // Match user's email
        if (activeEmail && q.email?.toLowerCase() === activeEmail) return true;
        // In demo fallback mode without an active login
        if (!currentUser && activeName && q.studentName?.toLowerCase() === activeName) return true;
        if (!currentUser && activeRoll && q.studentRoll?.toLowerCase() === activeRoll) return true;
        return false;
      });
    }
    return queries;
  }, [queries, role, studentUser, currentUser]);

  // Metrics calculated strictly on the student's own inquiries
  const pendingCount = studentSpecificQueries.filter(q => q.status === 'Pending').length;
  const answeredCount = studentSpecificQueries.filter(q => q.status === 'Answered').length;
  const resolvedCount = studentSpecificQueries.filter(q => q.status === 'Resolved').length;

  const filteredQueries = useMemo(() => {
    return studentSpecificQueries.filter(q => {
      const matchCat = categoryFilter === 'All' || q.category === categoryFilter;
      const matchStatus = statusFilter === 'All' || q.status === statusFilter;
      const term = searchTerm.toLowerCase();
      const matchSearch = !searchTerm ||
        q.subject.toLowerCase().includes(term) ||
        q.description.toLowerCase().includes(term) ||
        q.id.toLowerCase().includes(term) ||
        (q.tags && q.tags.some(t => t.toLowerCase().includes(term)));

      return matchCat && matchStatus && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'priority') {
        const pOrder = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
        return (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0);
      }
      return 0;
    });
  }, [studentSpecificQueries, categoryFilter, statusFilter, searchTerm, sortBy]);

  return (
    <div className="page-wrapper">
      {/* Student Welcome Banner */}
      <div
        style={{
          background: 'var(--banner-student)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '1.75rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <UserAvatar
            user={currentUser}
            name={studentUser?.name}
            photoUrl={studentUser?.photoURL}
            size="lg"
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                Welcome, {studentUser.name}
              </h2>
              <span style={{ fontSize: '0.72rem', background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                {studentUser.roll}
              </span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '3px' }}>
              {studentUser.branch} • {studentUser.year} {studentUser.email ? `• ${studentUser.email}` : ''}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="btn btn-primary btn-lg"
          style={{ gap: '0.5rem' }}
        >
          <PlusCircle size={18} />
          <span>Submit New Query</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Inquiries</span>
        <MessageSquare size={18} color="var(--primary)" />
      </div>
      <h3 style={{ fontSize: '1.85rem', color: 'var(--text-primary)', marginTop: '0.35rem' }}>{studentSpecificQueries.length}</h3>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Submitted by your account</p>
    </div>

    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Review</span>
        <Clock size={18} color="#f59e0b" />
      </div>
      <h3 style={{ fontSize: '1.85rem', color: '#f59e0b', marginTop: '0.35rem' }}>{pendingCount}</h3>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Awaiting faculty response</p>
    </div>

    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Faculty Answered</span>
        <AlertCircle size={18} color="var(--primary)" />
      </div>
      <h3 style={{ fontSize: '1.85rem', color: 'var(--primary)', marginTop: '0.35rem' }}>{answeredCount}</h3>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Awaiting your acknowledgment</p>
    </div>

    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Fully Resolved</span>
        <CheckCircle2 size={18} color="#10b981" />
      </div>
      <h3 style={{ fontSize: '1.85rem', color: '#10b981', marginTop: '0.35rem' }}>{resolvedCount}</h3>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Successfully closed</p>
    </div>
  </div>

  {/* Query Filter and Search Controls */ }
  <div
    className="glass-card"
    style={{
      padding: '1.25rem',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem'
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '240px' }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
        <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          className="form-input"
          style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
          placeholder="Search by subject, description, ID, or tag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
      {/* Category Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Category:</span>
        <select
          className="form-select"
          style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.825rem' }}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Attendance">Attendance</option>
          <option value="Exams">Exams</option>
          <option value="Fees">Fees</option>
          <option value="Timetable">Timetable</option>
          <option value="Technical">Technical</option>
          <option value="Hostel">Hostel</option>
        </select>
      </div>

      {/* Status Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status:</span>
        <select
          className="form-select"
          style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.825rem' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Answered">Answered</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* Sort By */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <ArrowUpDown size={15} color="var(--text-muted)" />
        <select
          className="form-select"
          style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.825rem' }}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="priority">Highest Priority</option>
        </select>
      </div>
    </div>
  </div>

  {/* Queries Table */ }
  <div className="table-container" style={{ marginBottom: '2rem' }}>
    <table className="custom-table">
      <thead>
        <tr>
          <th>Query ID</th>
          <th>Subject & AI Suggestion</th>
          <th>Category</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Assigned Desk</th>
          <th>Created Date</th>
          <th style={{ textAlign: 'right' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredQueries.length === 0 ? (
          <tr>
            <td colSpan={8} style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={32} style={{ opacity: 0.5 }} />
                <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  No queries found
                </p>
                <p style={{ fontSize: '0.85rem' }}>
                  {searchTerm ? 'Try adjusting your search terms or filters.' : 'Submit a new inquiry to receive instant AI guidance and faculty resolution.'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: '0.5rem' }}
                  >
                    <PlusCircle size={15} />
                    <span>Submit Your First Query</span>
                  </button>
                )}
              </div>
            </td>
          </tr>
        ) : (
          filteredQueries.map(q => (
            <tr key={q.id}>
              <td>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{q.id}</span>
              </td>
              <td style={{ maxWidth: '360px' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                  {q.subject}
                </div>
                {q.suggestedAnswer && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Sparkles size={12} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '320px' }}>
                      AI: {q.suggestedAnswer}
                    </span>
                  </div>
                )}
                {q.attachments && q.attachments.length > 0 && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '2px' }}>
                    <Paperclip size={11} />
                    <span>{q.attachments.length} document(s) attached</span>
                  </div>
                )}
              </td>
              <td>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: '6px' }}>
                  {q.category}
                </span>
              </td>
              <td>
                <PriorityBadge priority={q.priority} />
              </td>
              <td>
                <StatusBadge status={q.status} />
              </td>
              <td>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {q.assignedTo !== 'Unassigned' ? q.assignedTo : q.assignedDept}
                </span>
              </td>
              <td>
                <span style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
                  {new Date(q.createdAt).toLocaleDateString()}
                </span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <button
                  onClick={() => setSelectedQuery(q)}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.35rem' }}
                >
                  <Eye size={14} />
                  <span>Details ({q.replies ? q.replies.length : 0})</span>
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>

  {/* Embedded FAQ Knowledge Base Section */ }
  <FAQSection />

  {/* Modals */ }
      <SubmitQueryModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />

      <QueryDetailModal
        query={activeSelectedQuery}
        isOpen={Boolean(activeSelectedQuery)}
        onClose={() => setSelectedQuery(null)}
      />
    </div >
  );
}
