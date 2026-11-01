import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { FacultyReplyModal } from '../components/faculty/FacultyReplyModal';
import { CSPOptimizerModal } from '../components/faculty/CSPOptimizerModal';
import { QueryDetailModal } from '../components/student/QueryDetailModal';
import { UserAvatar } from '../components/common/UserAvatar';
import {
  Users,
  Cpu,
  MessageSquare,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Briefcase,
  Paperclip,
  Eye,
  Star,
  Zap,
  Kanban,
  Table as TableIcon,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export function FacultyDashboard() {
  const { queries, facultyUser, role, currentUser, faculty, showToast } = useApp();

  const [selectedQueryForReply, setSelectedQueryForReply] = useState(null);
  const [selectedQueryForDetail, setSelectedQueryForDetail] = useState(null);
  const [isCSPOpen, setIsCSPOpen] = useState(false);

  // View state: 'kanban' | 'table'
  const [viewMode, setViewMode] = useState('kanban');

  // Availability state
  const [isOnline, setIsOnline] = useState(true);

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
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [scopeFilter, setScopeFilter] = useState('All'); // 'All' | 'MyAssigned'

  // Metrics
  const myAssignedQueries = queries.filter(q => q.assignedTo === facultyUser.name || q.assignedFacultyId === currentUser?.id);
  const pendingQueries = queries.filter(q => q.status === 'Pending');
  const inProgressQueries = queries.filter(q => q.status === 'In Progress' || q.status === 'Answered');
  const resolvedQueries = queries.filter(q => q.status === 'Resolved');

  const filteredQueries = useMemo(() => {
    return queries.filter(q => {
      const matchCat = categoryFilter === 'All' || q.category === categoryFilter;
      const matchPriority = priorityFilter === 'All' || q.priority === priorityFilter;

      const matchScope = scopeFilter === 'All' ? true :
        (q.assignedTo === facultyUser.name || q.assignedFacultyId === currentUser?.id);

      const term = searchTerm.toLowerCase();
      const matchSearch = !searchTerm ||
        q.subject.toLowerCase().includes(term) ||
        q.studentName.toLowerCase().includes(term) ||
        (q.studentRoll && q.studentRoll.toLowerCase().includes(term)) ||
        q.id.toLowerCase().includes(term);

      return matchCat && matchPriority && matchScope && matchSearch;
    });
  }, [queries, categoryFilter, priorityFilter, scopeFilter, searchTerm, facultyUser, currentUser]);

  // Group into Kanban columns
  const kanbanColumns = useMemo(() => {
    return {
      pending: filteredQueries.filter(q => q.status === 'Pending'),
      inProgress: filteredQueries.filter(q => q.status === 'In Progress' || q.status === 'Answered'),
      resolved: filteredQueries.filter(q => q.status === 'Resolved')
    };
  }, [filteredQueries]);

  const handleToggleAvailability = () => {
    const next = !isOnline;
    setIsOnline(next);
    showToast(next ? 'Status set to Online / Taking Queries' : 'Status set to Offline / Away', 'info');
  };

  const getSLABadge = (q) => {
    if (q.status === 'Resolved') {
      return (
        <span style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
          <CheckCircle size={12} /> Resolved
        </span>
      );
    }
    if (q.priority === 'Urgent') {
      return (
        <span style={{ fontSize: '0.72rem', color: 'var(--danger)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px', background: 'rgba(239, 68, 68, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
          <Clock size={12} /> SLA: 2h left
        </span>
      );
    }
    if (q.priority === 'High') {
      return (
        <span style={{ fontSize: '0.72rem', color: 'var(--warning)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px', background: 'rgba(245, 158, 11, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
          <Clock size={12} /> SLA: 6h left
        </span>
      );
    }
    return (
      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
        <Clock size={12} /> SLA: 24h left
      </span>
    );
  };

  return (
    <div className="page-wrapper">
      {/* 1. Mentor Profile Banner & Availability Toggle */}
      <div
        className="glass-card"
        style={{
          padding: '2rem 2.25rem',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--primary-glow) 100%)',
          border: '1px solid var(--primary-glow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <UserAvatar
            user={currentUser}
            name={facultyUser?.name}
            photoUrl={facultyUser?.photoURL}
            size="lg"
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                {facultyUser.name}
              </h1>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  background: 'var(--primary-glow)',
                  color: 'var(--primary)',
                  border: '1px solid var(--border)'
                }}
              >
                {facultyUser.role || 'Senior Mentor'}
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {facultyUser.department} {facultyUser.email ? `• ${facultyUser.email}` : ''}
            </p>
          </div>
        </div>

        {/* Action Controls & Availability Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Availability Toggle */}
          <button
            onClick={handleToggleAvailability}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '9999px',
              border: '1px solid var(--border)',
              background: isOnline ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-glass-heavy)',
              color: isOnline ? 'var(--success)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.85rem',
              transition: 'all 0.2s ease'
            }}
          >
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: isOnline ? 'var(--success)' : 'var(--text-muted)'
              }}
            />
            <span>{isOnline ? 'Online / Taking queries' : 'Offline / Away'}</span>
          </button>

          {/* CSP Auto-Balancer Modal Trigger */}
          <button
            onClick={() => setIsCSPOpen(true)}
            className="btn btn-primary"
            style={{ borderRadius: '9999px', gap: '6px' }}
          >
            <Cpu size={16} />
            <span>CSP Auto-Balancer</span>
          </button>
        </div>
      </div>

      {/* 2. Stats Strip */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {/* Pending */}
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Review</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={18} color="var(--warning)" />
            </div>
          </div>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--warning)', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            {pendingQueries.length}
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Awaiting initial evaluation
          </p>
        </div>

        {/* Avg Response Time */}
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Avg Response Time</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} color="var(--primary)" />
            </div>
          </div>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            1.8h
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Fast resolution SLA target
          </p>
        </div>

        {/* Rating */}
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Student Rating</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(234, 179, 8, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star size={18} color="#EAB308" />
            </div>
          </div>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#EAB308', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            4.9 ⭐
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Based on 98 verified ratings
          </p>
        </div>

        {/* Resolved This Week */}
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Resolved This Week</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={18} color="var(--success)" />
            </div>
          </div>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            14
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Tickets cleared in last 7 days
          </p>
        </div>
      </div>

      {/* 3. Filter Bar & View Toggle */}
      <div
        className="glass-card"
        style={{
          padding: '1.25rem 1.5rem',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '260px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search student, roll, or inquiry title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '34px', fontSize: '0.825rem', height: '38px', borderRadius: '9999px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Scope Filter */}
          <select
            className="form-select"
            value={scopeFilter}
            onChange={(e) => setScopeFilter(e.target.value)}
            style={{ width: 'auto', padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderRadius: '9999px' }}
          >
            <option value="All">All Inquiries ({queries.length})</option>
            <option value="MyAssigned">My Assigned ({myAssignedQueries.length})</option>
          </select>

          {/* Category Filter */}
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ width: 'auto', padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderRadius: '9999px' }}
          >
            <option value="All">All Categories</option>
            <option value="Attendance">Attendance</option>
            <option value="Exams">Exams</option>
            <option value="Fees">Fees</option>
            <option value="Timetable">Timetable</option>
            <option value="Hostel">Hostel</option>
          </select>

          {/* Priority Filter */}
          <select
            className="form-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{ width: 'auto', padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderRadius: '9999px' }}
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent Only</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* View Toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-glass-heavy)', borderRadius: '9999px', padding: '3px', border: '1px solid var(--border)' }}>
            <button
              onClick={() => setViewMode('kanban')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '9999px',
                border: 'none',
                background: viewMode === 'kanban' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'kanban' ? 'var(--bg-main)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              <Kanban size={14} />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '9999px',
                border: 'none',
                background: viewMode === 'table' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'table' ? 'var(--bg-main)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              <TableIcon size={14} />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Kanban Board Layout */}
      {viewMode === 'kanban' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* Column 1: New / Pending */}
          <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '24px', background: 'var(--bg-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--warning)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>New / Pending</h3>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'var(--bg-glass-heavy)', padding: '2px 8px', borderRadius: '999px', border: '1px solid var(--border)' }}>
                {kanbanColumns.pending.length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '320px' }}>
              {kanbanColumns.pending.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No pending queries in this category.
                </div>
              ) : (
                kanbanColumns.pending.map(q => (
                  <div
                    key={q.id}
                    className="glass-card"
                    style={{
                      padding: '1.15rem',
                      borderRadius: '18px',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                        {q.id}
                      </span>
                      {getSLABadge(q)}
                    </div>

                    <div>
                      <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                        {q.subject}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {q.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border)', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {q.studentName} ({q.studentRoll})
                      </span>
                      <PriorityBadge priority={q.priority} />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <button
                        onClick={() => setSelectedQueryForReply(q)}
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1, borderRadius: '9999px', fontSize: '0.75rem', padding: '4px 10px' }}
                      >
                        Reply & Resolve
                      </button>
                      <button
                        onClick={() => setSelectedQueryForDetail(q)}
                        className="btn btn-secondary btn-sm"
                        style={{ borderRadius: '9999px', fontSize: '0.75rem', padding: '4px 10px' }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 2: In Progress */}
          <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '24px', background: 'var(--bg-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-purple)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>In Progress</h3>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'var(--bg-glass-heavy)', padding: '2px 8px', borderRadius: '999px', border: '1px solid var(--border)' }}>
                {kanbanColumns.inProgress.length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '320px' }}>
              {kanbanColumns.inProgress.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No queries currently in progress.
                </div>
              ) : (
                kanbanColumns.inProgress.map(q => (
                  <div
                    key={q.id}
                    className="glass-card"
                    style={{
                      padding: '1.15rem',
                      borderRadius: '18px',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                        {q.id}
                      </span>
                      {getSLABadge(q)}
                    </div>

                    <div>
                      <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                        {q.subject}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {q.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border)', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {q.studentName} ({q.studentRoll})
                      </span>
                      <PriorityBadge priority={q.priority} />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <button
                        onClick={() => setSelectedQueryForReply(q)}
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1, borderRadius: '9999px', fontSize: '0.75rem', padding: '4px 10px' }}
                      >
                        Update Directive
                      </button>
                      <button
                        onClick={() => setSelectedQueryForDetail(q)}
                        className="btn btn-secondary btn-sm"
                        style={{ borderRadius: '9999px', fontSize: '0.75rem', padding: '4px 10px' }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 3: Resolved */}
          <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '24px', background: 'var(--bg-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Resolved</h3>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'var(--bg-glass-heavy)', padding: '2px 8px', borderRadius: '999px', border: '1px solid var(--border)' }}>
                {kanbanColumns.resolved.length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '320px' }}>
              {kanbanColumns.resolved.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No resolved inquiries yet.
                </div>
              ) : (
                kanbanColumns.resolved.map(q => (
                  <div
                    key={q.id}
                    className="glass-card"
                    style={{
                      padding: '1.15rem',
                      borderRadius: '18px',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      opacity: 0.9
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                        {q.id}
                      </span>
                      {getSLABadge(q)}
                    </div>

                    <div>
                      <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                        {q.subject}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {q.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border)', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {q.studentName} ({q.studentRoll})
                      </span>
                      <PriorityBadge priority={q.priority} />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <button
                        onClick={() => setSelectedQueryForDetail(q)}
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%', borderRadius: '9999px', fontSize: '0.75rem', padding: '4px 10px' }}
                      >
                        Inspect Thread
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      ) : (
        /* Table View */
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Student</th>
                <th>Subject</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>SLA</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueries.map(q => (
                <tr key={q.id}>
                  <td>
                    <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                      {q.id}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{q.studentName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{q.studentRoll}</div>
                  </td>
                  <td style={{ maxWidth: '300px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{q.subject}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', background: 'var(--primary-glow)', padding: '2px 8px', borderRadius: '6px' }}>
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
                    {getSLABadge(q)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        onClick={() => setSelectedQueryForReply(q)}
                        className="btn btn-primary btn-sm"
                        style={{ borderRadius: '9999px', fontSize: '0.78rem' }}
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => setSelectedQueryForDetail(q)}
                        className="btn btn-secondary btn-sm"
                        style={{ borderRadius: '9999px', fontSize: '0.78rem' }}
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
