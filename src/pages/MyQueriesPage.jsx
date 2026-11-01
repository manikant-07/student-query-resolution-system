import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { QueryDetailModal } from '../components/student/QueryDetailModal';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  MessageSquare, 
  Paperclip, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Star, 
  PlusCircle, 
  Eye, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function MyQueriesPage() {
  const { queries, role, currentUser, studentUser } = useApp();

  const [selectedQuery, setSelectedQuery] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Active query derived from live queries array
  const activeSelectedQuery = useMemo(() => {
    if (!selectedQuery) return null;
    return queries.find(q => q.id === selectedQuery.id || (q.dbId && q.dbId === selectedQuery.dbId)) || selectedQuery;
  }, [queries, selectedQuery]);

  // Student specific queries
  const myQueries = useMemo(() => {
    if (role === 'student' && currentUser) {
      const activeId = currentUser.id || currentUser.uid;
      const activeEmail = currentUser.email?.toLowerCase();
      return queries.filter(q => {
        if (activeId && q.studentId === activeId) return true;
        if (activeEmail && q.email?.toLowerCase() === activeEmail) return true;
        return false;
      });
    }
    return queries;
  }, [queries, role, currentUser]);

  const filteredQueries = useMemo(() => {
    return myQueries.filter(q => {
      const matchStatus = statusFilter === 'All' || q.status === statusFilter;
      const matchCat = categoryFilter === 'All' || q.category === categoryFilter;
      const term = searchTerm.toLowerCase();
      const matchSearch = !searchTerm ||
        q.subject.toLowerCase().includes(term) ||
        q.description.toLowerCase().includes(term) ||
        q.id.toLowerCase().includes(term) ||
        (q.tags && q.tags.some(t => t.toLowerCase().includes(term)));

      return matchStatus && matchCat && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'priority') {
        const pOrder = { Urgent: 3, High: 2, Medium: 1, Low: 0 };
        return (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0);
      }
      return 0;
    });
  }, [myQueries, statusFilter, categoryFilter, searchTerm, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredQueries.length / ITEMS_PER_PAGE) || 1;
  const paginatedQueries = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredQueries.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredQueries, currentPage]);

  return (
    <div className="page-wrapper" style={{ paddingBottom: '3.5rem' }}>
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>
            My Query Tickets
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Track active academic inquiries, read official mentor replies, and submit ratings.
          </p>
        </div>

        <Link to="/ask" className="btn btn-primary btn-pill">
          <PlusCircle size={18} />
          <span>Ask New Query</span>
        </Link>
      </div>

      {/* Filter and View Controls Bar */}
      <div
        className="glass-card"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '38px', borderRadius: 'var(--radius-full)' }}
            placeholder="Search tickets by ID, keyword, subject..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            className="form-select"
            style={{ width: 'auto', borderRadius: 'var(--radius-full)' }}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Answered">Answered</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            className="form-select"
            style={{ width: 'auto', borderRadius: 'var(--radius-full)' }}
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="All">All Categories</option>
            <option value="Attendance">Attendance</option>
            <option value="Exams">Exams</option>
            <option value="Fees">Fees</option>
            <option value="Timetable">Timetable</option>
            <option value="Technical">Technical</option>
          </select>

          <select
            className="form-select"
            style={{ width: 'auto', borderRadius: 'var(--radius-full)' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="priority">Sort: Highest Priority</option>
          </select>

          {/* View Mode Toggle: Grid vs List */}
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-subtle)',
              padding: '3px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border)'
            }}
          >
            <button
              onClick={() => setViewMode('grid')}
              className="btn btn-sm"
              style={{
                background: viewMode === 'grid' ? 'var(--bg-card)' : 'transparent',
                color: viewMode === 'grid' ? 'var(--primary)' : 'var(--text-muted)',
                borderRadius: 'var(--radius-full)',
                padding: '0.35rem 0.65rem'
              }}
              title="Grid View"
            >
              <Grid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className="btn btn-sm"
              style={{
                background: viewMode === 'list' ? 'var(--bg-card)' : 'transparent',
                color: viewMode === 'list' ? 'var(--primary)' : 'var(--text-muted)',
                borderRadius: 'var(--radius-full)',
                padding: '0.35rem 0.65rem'
              }}
              title="List View"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Query List / Grid Display */}
      {paginatedQueries.length === 0 ? (
        <div
          className="glass-card"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            borderRadius: 'var(--radius-card)',
            color: 'var(--text-muted)'
          }}
        >
          <HelpCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
          <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            No Query Tickets Found
          </h3>
          <p style={{ maxWidth: '400px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
            {searchTerm || statusFilter !== 'All' 
              ? 'Try modifying your search keywords or status filter.'
              : 'You have not submitted any academic queries yet.'}
          </p>
          <Link to="/ask" className="btn btn-primary btn-pill">
            <PlusCircle size={16} />
            <span>Submit Your First Query</span>
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid-3" style={{ gap: '1.5rem', marginBottom: '2.5rem' }}>
          {paginatedQueries.map((q) => (
            <div
              key={q.id}
              className="glass-card glass-card-interactive"
              onClick={() => setSelectedQuery(q)}
              style={{
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: 'var(--radius-card)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {q.id}
                  </span>
                  <StatusBadge status={q.status} />
                </div>

                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.65rem', lineHeight: 1.35 }}>
                  {q.subject}
                </h3>

                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: '1.25rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {q.description}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.785rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-muted)' }}>
                    <MessageSquare size={14} />
                    <span>{q.replies?.length || 0} replies</span>
                  </div>

                  <PriorityBadge priority={q.priority} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Open Ticket →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LIST / TABLE VIEW */
        <div className="table-container" style={{ marginBottom: '2.5rem' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Subject & Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned Mentor</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedQueries.map((q) => (
                <tr key={q.id} onClick={() => setSelectedQuery(q)} style={{ cursor: 'pointer' }}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>
                    {q.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{q.subject}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{q.category}</div>
                  </td>
                  <td>
                    <PriorityBadge priority={q.priority} />
                  </td>
                  <td>
                    <StatusBadge status={q.status} />
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {q.assignedTo || 'Pending Assignment'}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {new Date(q.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button className="btn btn-secondary btn-sm btn-pill" onClick={(e) => { e.stopPropagation(); setSelectedQuery(q); }}>
                      <Eye size={14} />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="btn btn-secondary btn-sm btn-pill"
          >
            <ChevronLeft size={16} />
            <span>Prev</span>
          </button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className="btn btn-sm btn-pill"
              style={{
                width: '36px',
                height: '36px',
                padding: 0,
                background: currentPage === idx + 1 ? 'var(--primary)' : 'var(--bg-card)',
                color: currentPage === idx + 1 ? '#060D09' : 'var(--text-primary)',
                border: '1px solid var(--border)'
              }}
            >
              {idx + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="btn btn-secondary btn-sm btn-pill"
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Detail / Chat Modal */}
      {activeSelectedQuery && (
        <QueryDetailModal
          isOpen={Boolean(activeSelectedQuery)}
          onClose={() => setSelectedQuery(null)}
          query={activeSelectedQuery}
        />
      )}
    </div>
  );
}
