import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { FacultyReplyModal } from '../components/faculty/FacultyReplyModal';
import { CSPOptimizerModal } from '../components/faculty/CSPOptimizerModal';
import { QueryDetailModal } from '../components/student/QueryDetailModal';
import { AnalyticsCharts } from '../components/faculty/AnalyticsCharts';
import {
  Users,
  Cpu,
  MessageSquare,
  Search,
  Filter,
  ArrowUpDown,
  UserCheck,
  Send,
  CheckCircle,
  AlertTriangle,
  Clock,
  Briefcase,
  Paperclip,
  Eye,
  Lock
} from 'lucide-react';

export function FacultyDashboard() {
  const { queries, facultyUser, role, currentUser, faculty } = useApp();

  const [selectedQueryForReply, setSelectedQueryForReply] = useState(null);
  const [selectedQueryForDetail, setSelectedQueryForDetail] = useState(null);
  const [isCSPOpen, setIsCSPOpen] = useState(false);

  // Derive active query from live queries array
  const activeSelectedQueryForReply = useMemo(() => {
    if (!selectedQueryForReply) return null;
    return queries.find(q => q.id === selectedQueryForReply.id || (q.dbId && q.dbId === selectedQueryForReply.dbId)) || selectedQueryForReply;
  }, [queries, selectedQueryForReply]);

  const activeSelectedQueryForDetail = useMemo(() => {
    if (!selectedQueryForDetail) return null;
    return queries.find(q => q.id === selectedQueryForDetail.id || (q.dbId && q.dbId === selectedQueryForDetail.dbId)) || selectedQueryForDetail;
  }, [queries, selectedQueryForDetail]);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [scopeFilter, setScopeFilter] = useState('All'); // 'All' | 'MyAssigned' | 'Unassigned'

  // Metrics
  const pendingQueries = queries.filter(q => q.status === 'Pending');
  const answeredQueries = queries.filter(q => q.status === 'Answered');
  const resolvedQueries = queries.filter(q => q.status === 'Resolved');
  const myAssignedQueries = queries.filter(q => q.assignedTo === facultyUser.name || q.assignedFacultyId === currentUser?.id);

  const filteredQueries = useMemo(() => {
    return queries.filter(q => {
      const matchCat = categoryFilter === 'All' || q.category === categoryFilter;
      const matchStatus = statusFilter === 'All' || q.status === statusFilter;
      const matchPriority = priorityFilter === 'All' || q.priority === priorityFilter;

      const matchScope = scopeFilter === 'All' ? true :
        scopeFilter === 'MyAssigned' ? (q.assignedTo === facultyUser.name || q.assignedFacultyId === currentUser?.id) :
          q.assignedTo === 'Unassigned' || !q.assignedTo;

      const term = searchTerm.toLowerCase();
      const matchSearch = !searchTerm ||
        q.subject.toLowerCase().includes(term) ||
        q.studentName.toLowerCase().includes(term) ||
        (q.studentRoll && q.studentRoll.toLowerCase().includes(term)) ||
        q.id.toLowerCase().includes(term);

      return matchCat && matchStatus && matchPriority && matchScope && matchSearch;
    });
  }, [queries, categoryFilter, statusFilter, priorityFilter, scopeFilter, searchTerm, facultyUser, currentUser]);

  return (
    <div className="page-wrapper">
      {/* Faculty Profile Banner */}
      <div
        style={{
          background: 'var(--banner-faculty)',
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
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
              overflow: 'hidden'
            }}
          >
            {facultyUser?.photoURL ? (
              <img
                src={facultyUser.photoURL}
                alt={facultyUser.name}
                referrerPolicy="no-referrer"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Users size={30} />
            )}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h2 style={{ fontSize: '1.45rem', color: 'var(--text-primary)' }}>
                {facultyUser.name}
              </h2>
              <span style={{ fontSize: '0.75rem', background: 'var(--accent-purple-light)', color: 'var(--accent-purple)', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                HOD • Faculty Portal
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {facultyUser.role} • {facultyUser.department} • {facultyUser.email}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCSPOpen(true)}
          className="btn btn-purple btn-lg"
          style={{ gap: '0.5rem' }}
        >
          <Cpu size={18} />
          <span>Automated CSP Assignment Engine</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Awaiting Reply</span>
            <Clock size={18} color="#f59e0b" />
          </div>
          <h3 style={{ fontSize: '1.85rem', color: '#f59e0b', marginTop: '0.35rem' }}>{pendingQueries.length}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Requires investigation</p>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Assigned to Me</span>
            <Briefcase size={18} color="var(--accent-purple)" />
          </div>
          <h3 style={{ fontSize: '1.85rem', color: 'var(--accent-purple)', marginTop: '0.35rem' }}>{myAssignedQueries.length}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Active faculty caseload</p>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Answered / Open</span>
            <MessageSquare size={18} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: '1.85rem', color: 'var(--primary)', marginTop: '0.35rem' }}>{answeredQueries.length}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Replies delivered</p>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Fully Resolved</span>
            <CheckCircle size={18} color="#10b981" />
          </div>
          <h3 style={{ fontSize: '1.85rem', color: '#10b981', marginTop: '0.35rem' }}>{resolvedQueries.length}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Successfully closed</p>
        </div>
      </div>

      {/* Query Inbox Controls */}
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
              placeholder="Search student roll, name, subject, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Scope Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Scope:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.825rem' }}
              value={scopeFilter}
              onChange={(e) => setScopeFilter(e.target.value)}
            >
              <option value="All">All Inquiries</option>
              <option value="MyAssigned">Assigned to Me</option>
              <option value="Unassigned">Unassigned (Needs CSP)</option>
            </select>
          </div>

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

          {/* Priority Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Priority:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.825rem' }}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Query Inbox Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Query ID</th>
              <th>Student</th>
              <th>Subject & Preview</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned Faculty</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQueries.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  No inquiries match the selected filter criteria.
                </td>
              </tr>
            ) : (
              filteredQueries.map(q => {
                const isAssignedToCurrent = q.assignedTo === facultyUser.name || q.assignedFacultyId === currentUser?.id || q.assignedTo === 'Unassigned' || role === 'admin';
                return (
                  <tr key={q.id}>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{q.id}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{q.studentName}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{q.studentRoll}</div>
                    </td>
                    <td style={{ maxWidth: '300px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                        {q.subject}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {q.description}
                      </div>
                      {q.attachments && q.attachments.length > 0 && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '2px' }}>
                          <Paperclip size={11} />
                          <span>{q.attachments.length} verification file(s) attached</span>
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: '6px' }}>
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
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: q.assignedTo === 'Unassigned' ? '#f59e0b' : 'var(--primary)' }}>
                        {q.assignedTo}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => setSelectedQueryForDetail(q)}
                          className="btn btn-secondary btn-sm"
                          title="View Inquiry Details & Attachments"
                        >
                          <Eye size={13} />
                          <span>View</span>
                        </button>
                        {isAssignedToCurrent ? (
                          <button
                            onClick={() => setSelectedQueryForReply(q)}
                            className="btn btn-purple btn-sm"
                            style={{ gap: '0.35rem' }}
                          >
                            <Send size={13} />
                            <span>Resolve ({q.replies ? q.replies.length : 0})</span>
                          </button>
                        ) : (
                          <span
                            title="Query assigned to another faculty member"
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              padding: '0.35rem 0.65rem',
                              background: 'var(--bg-subtle)',
                              borderRadius: '6px',
                              border: '1px solid var(--border)',
                            }}
                          >
                            <Lock size={12} />
                            <span>Assigned</span>
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Analytics Visualizations */}
      <AnalyticsCharts />

      {/* Modals */}
      <FacultyReplyModal
        query={activeSelectedQueryForReply}
        isOpen={Boolean(activeSelectedQueryForReply)}
        onClose={() => setSelectedQueryForReply(null)}
      />

      <QueryDetailModal
        query={activeSelectedQueryForDetail}
        isOpen={Boolean(activeSelectedQueryForDetail)}
        onClose={() => setSelectedQueryForDetail(null)}
      />

      <CSPOptimizerModal
        isOpen={isCSPOpen}
        onClose={() => setIsCSPOpen(false)}
      />
    </div>
  );
}
