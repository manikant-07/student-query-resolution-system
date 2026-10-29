import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { FacultyReplyModal } from '../components/faculty/FacultyReplyModal';
import { CSPOptimizerModal } from '../components/faculty/CSPOptimizerModal';
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
  Briefcase
} from 'lucide-react';

export function FacultyDashboard() {
  const { queries, facultyUser, updateQueryStatus, faculty } = useApp();

  const [selectedQueryForReply, setSelectedQueryForReply] = useState(null);
  const [isCSPOpen, setIsCSPOpen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Metrics
  const pendingQueries = queries.filter(q => q.status === 'Pending');
  const answeredQueries = queries.filter(q => q.status === 'Answered');
  const resolvedQueries = queries.filter(q => q.status === 'Resolved');
  const myAssignedQueries = queries.filter(q => q.assignedTo === facultyUser.name);

  const filteredQueries = useMemo(() => {
    return queries.filter(q => {
      const matchCat = categoryFilter === 'All' || q.category === categoryFilter;
      const matchStatus = statusFilter === 'All' || q.status === statusFilter;
      const matchPriority = priorityFilter === 'All' || q.priority === priorityFilter;
      const term = searchTerm.toLowerCase();
      const matchSearch = !searchTerm ||
        q.subject.toLowerCase().includes(term) ||
        q.studentName.toLowerCase().includes(term) ||
        q.studentRoll.toLowerCase().includes(term) ||
        q.id.toLowerCase().includes(term);

      return matchCat && matchStatus && matchPriority && matchSearch;
    });
  }, [queries, categoryFilter, statusFilter, priorityFilter, searchTerm]);

  return (
    <div className="page-wrapper">
      {/* Faculty Profile Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f5f3ff 50%, #eff6ff 100%)',
          border: '1px solid #c7d2fe',
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
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
            }}
          >
            <Users size={30} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h2 style={{ fontSize: '1.45rem', color: '#0f172a' }}>
                {facultyUser.name}
              </h2>
              <span style={{ fontSize: '0.75rem', background: '#ede9fe', color: '#6d28d9', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                HOD • Faculty Portal
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
              {facultyUser.role} • {facultyUser.department}
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
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Awaiting Reply</span>
            <Clock size={18} color="#d97706" />
          </div>
          <h3 style={{ fontSize: '1.85rem', color: '#d97706', marginTop: '0.35rem' }}>{pendingQueries.length}</h3>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Requires investigation</p>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Assigned Directly to Me</span>
            <Briefcase size={18} color="#7c3aed" />
          </div>
          <h3 style={{ fontSize: '1.85rem', color: '#7c3aed', marginTop: '0.35rem' }}>{myAssignedQueries.length}</h3>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Active faculty caseload</p>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Answered / Open</span>
            <MessageSquare size={18} color="#2563eb" />
          </div>
          <h3 style={{ fontSize: '1.85rem', color: '#2563eb', marginTop: '0.35rem' }}>{answeredQueries.length}</h3>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Replies delivered</p>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Fully Resolved</span>
            <CheckCircle size={18} color="#10b981" />
          </div>
          <h3 style={{ fontSize: '1.85rem', color: '#10b981', marginTop: '0.35rem' }}>{resolvedQueries.length}</h3>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Successfully closed</p>
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
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
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
          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Category:</span>
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
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Status:</span>
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
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Priority:</span>
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
                <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                  No queries match the selected filters.
                </td>
              </tr>
            ) : (
              filteredQueries.map(q => (
                <tr key={q.id}>
                  <td>
                    <span style={{ fontWeight: 700, color: '#1e293b' }}>{q.id}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{q.studentName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{q.studentRoll}</div>
                  </td>
                  <td style={{ maxWidth: '300px' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '2px' }}>
                      {q.subject}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {q.description}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.775rem', fontWeight: 600, color: '#0369a1', background: '#e0f2fe', padding: '2px 8px', borderRadius: '6px' }}>
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
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: q.assignedTo === 'Unassigned' ? '#d97706' : '#2563eb' }}>
                      {q.assignedTo}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedQueryForReply(q)}
                      className="btn btn-purple btn-sm"
                      style={{ gap: '0.35rem' }}
                    >
                      <Send size={13} />
                      <span>Resolve ({q.replies ? q.replies.length : 0})</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Analytics Visualizations */}
      <AnalyticsCharts />

      {/* Modals */}
      <FacultyReplyModal
        query={selectedQueryForReply}
        isOpen={Boolean(selectedQueryForReply)}
        onClose={() => setSelectedQueryForReply(null)}
      />

      <CSPOptimizerModal
        isOpen={isCSPOpen}
        onClose={() => setIsCSPOpen(false)}
      />
    </div>
  );
}
