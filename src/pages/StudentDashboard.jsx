import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { SubmitQueryModal } from '../components/student/SubmitQueryModal';
import { QueryDetailModal } from '../components/student/QueryDetailModal';
import { UserAvatar } from '../components/common/UserAvatar';
import {
  PlusCircle,
  Search,
  Filter,
  ArrowUpDown,
  MessageSquare,
  Eye,
  Sparkles,
  GraduationCap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  TrendingUp,
  Bell,
  HelpCircle,
  ChevronRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ArrowUpRight
} from 'lucide-react';

export function StudentDashboard() {
  const navigate = useNavigate();
  const { queries, studentUser, role, currentUser, notifications } = useApp();

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

  // Mini FAQ accordion state for right panel
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Enforce Student Privacy: Student sees only their own queries
  const studentSpecificQueries = useMemo(() => {
    if (role === 'student') {
      const activeId = currentUser?.uid || currentUser?.id;
      const activeEmail = currentUser?.email?.toLowerCase();
      const activeName = studentUser?.name?.toLowerCase();
      const activeRoll = studentUser?.roll?.toLowerCase();

      return queries.filter(q => {
        if (activeId && q.studentId === activeId) return true;
        if (activeEmail && q.email?.toLowerCase() === activeEmail) return true;
        if (!currentUser && activeName && q.studentName?.toLowerCase() === activeName) return true;
        if (!currentUser && activeRoll && q.studentRoll?.toLowerCase() === activeRoll) return true;
        return false;
      });
    }
    return queries;
  }, [queries, role, studentUser, currentUser]);

  // Metrics
  const pendingCount = studentSpecificQueries.filter(q => q.status === 'Pending').length;
  const inProgressCount = studentSpecificQueries.filter(q => q.status === 'In Progress' || q.status === 'Answered').length;
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

  const firstName = (studentUser?.name || 'Rahul').split(' ')[0];

  // Weekly activity mock distribution for chart
  const weeklyData = [
    { day: 'Mon', count: 4, height: 60 },
    { day: 'Tue', count: 7, height: 95 },
    { day: 'Wed', count: 5, height: 75 },
    { day: 'Thu', count: 8, height: 100 },
    { day: 'Fri', count: 3, height: 45 },
    { day: 'Sat', count: 2, height: 30 },
    { day: 'Sun', count: 1, height: 18 }
  ];

  const quickFaqs = [
    {
      q: "How fast will my query be answered?",
      a: "Urgent tickets are acknowledged within 4 hours. Regular inquiries are answered within 24–48 hours."
    },
    {
      q: "Can I submit medical certificates?",
      a: "Yes! Choose Attendance category and attach your medical documents as a PDF in the Ask Query form."
    },
    {
      q: "Is anonymous mode really confidential?",
      a: "Yes. Your student name and roll number are obscured from faculty viewers."
    }
  ];

  return (
    <div className="page-wrapper">
      {/* 1. SolveHub Student Welcome Banner */}
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
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', zIndex: 1 }}>
          <UserAvatar
            user={currentUser}
            name={studentUser?.name}
            photoUrl={studentUser?.photoURL}
            size="lg"
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                Hello, {firstName} 👋
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
                {studentUser.roll || '23AI-104'}
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Track your queries in real-time or ask an AI-assisted question to your faculty.
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {studentUser.branch} • {studentUser.year}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 1 }}>
          <button
            onClick={() => navigate('/ask')}
            className="btn btn-primary btn-lg"
            style={{ gap: '0.5rem', borderRadius: '9999px', boxShadow: '0 8px 24px var(--primary-glow)' }}
          >
            <PlusCircle size={18} />
            <span>Ask Query</span>
          </button>
        </div>
      </div>

      {/* 2. 4 Stat Cards */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {/* Total Inquiries */}
        <div
          className="glass-card"
          style={{
            padding: '1.5rem',
            borderRadius: '24px',
            border: '1px solid var(--border)',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Asked</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={18} color="var(--primary)" />
            </div>
          </div>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            {studentSpecificQueries.length}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <TrendingUp size={13} color="var(--primary)" />
            <span>All student inquiries</span>
          </div>
        </div>

        {/* Pending Review */}
        <div
          className="glass-card"
          style={{
            padding: '1.5rem',
            borderRadius: '24px',
            border: '1px solid rgba(245, 158, 11, 0.25)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={18} color="var(--warning)" />
            </div>
          </div>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--warning)', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            {pendingCount}
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Awaiting mentor response
          </p>
        </div>

        {/* In Progress */}
        <div
          className="glass-card"
          style={{
            padding: '1.5rem',
            borderRadius: '24px',
            border: '1px solid rgba(139, 92, 246, 0.25)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>In Progress</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle size={18} color="var(--accent-purple)" />
            </div>
          </div>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--accent-purple)', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            {inProgressCount}
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Assigned & answering
          </p>
        </div>

        {/* Resolved */}
        <div
          className="glass-card"
          style={{
            padding: '1.5rem',
            borderRadius: '24px',
            border: '1px solid rgba(16, 185, 129, 0.25)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Resolved</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={18} color="var(--success)" />
            </div>
          </div>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            {resolvedCount}
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Successfully closed
          </p>
        </div>
      </div>

      {/* Main Grid: Left Queries & Chart, Right Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.75rem', alignItems: 'start' }}>
        {/* Left Column (8 of 12) */}
        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Weekly Query Activity Chart Card */}
          <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                  Weekly Resolution Activity
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Inquiries answered and resolved across days
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }} />
                  Resolution Rate 94%
                </span>
              </div>
            </div>

            {/* Stylized Bar Chart */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', padding: '10px 1rem 0' }}>
              {weeklyData.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {item.count}
                  </span>
                  <div
                    style={{
                      width: '28px',
                      height: `${item.height}px`,
                      borderRadius: '8px',
                      background: idx === 3 ? 'var(--primary)' : 'var(--bg-glass-heavy)',
                      border: '1px solid var(--border)',
                      transition: 'all 0.3s ease',
                      position: 'relative'
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Queries Filter & Table */}
          <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                  Recent Inquiries
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Your live questions and resolution progress
                </p>
              </div>

              <button
                onClick={() => navigate('/queries')}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.8rem' }}
              >
                <span>View All Queries</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Filter bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Filter inquiries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '34px', fontSize: '0.825rem', height: '38px', borderRadius: '9999px' }}
                />
              </div>

              <select
                className="form-select"
                style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: '9999px' }}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Attendance">Attendance</option>
                <option value="Exams">Exams</option>
                <option value="Fees">Fees</option>
                <option value="Timetable">Timetable</option>
                <option value="Hostel">Hostel</option>
              </select>

              <select
                className="form-select"
                style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: '9999px' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Answered">Answered</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {/* Table */}
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Subject</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Mentor</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQueries.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                        <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>No inquiries found</p>
                        <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Click "Ask Query" above to start a new question.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredQueries.slice(0, 5).map(q => (
                      <tr key={q.id}>
                        <td>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                            {q.id}
                          </span>
                        </td>
                        <td style={{ maxWidth: '280px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {q.subject}
                          </div>
                          {q.suggestedAnswer && (
                            <div style={{ fontSize: '0.72rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                              <Sparkles size={11} />
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                AI: {q.suggestedAnswer}
                              </span>
                            </div>
                          )}
                        </td>
                        <td>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', background: 'var(--primary-glow)', padding: '2px 8px', borderRadius: '6px' }}>
                            {q.category}
                          </span>
                        </td>
                        <td>
                          <StatusBadge status={q.status} />
                        </td>
                        <td>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {q.assignedTo !== 'Unassigned' ? q.assignedTo : 'Auto-Routing'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => setSelectedQuery(q)}
                            className="btn btn-secondary btn-sm"
                            style={{ gap: '0.35rem', borderRadius: '9999px', fontSize: '0.78rem' }}
                          >
                            <Eye size={13} />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (4 of 12) - Side Panel */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Quick Notifications Widget */}
          <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bell size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                  Live Updates
                </h3>
              </div>
              <button
                onClick={() => navigate('/notifications')}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
              >
                View all
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ padding: '0.85rem 1rem', borderRadius: '16px', background: 'var(--bg-glass-heavy)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--success)' }}>RESOLVED</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>10m ago</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: '3px' }}>
                  QRY-1001 Attendance shortage verified
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Prof. Rajesh Sharma granted lab condonation.
                </p>
              </div>

              <div style={{ padding: '0.85rem 1rem', borderRadius: '16px', background: 'var(--bg-glass-heavy)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)' }}>MENTOR REPLY</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>2h ago</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: '3px' }}>
                  QRY-1002 Hall Ticket Error
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Accounts office reviewed payment gateway logs.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Mini Accordion */}
          <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HelpCircle size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                  Quick Help
                </h3>
              </div>
              <button
                onClick={() => navigate('/faq')}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Browse FAQ
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {quickFaqs.map((faq, idx) => (
                <div
                  key={idx}
                  style={{
                    borderRadius: '16px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-glass-heavy)',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? -1 : idx)}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {faq.q}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {openFaqIndex === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </button>

                  {openFaqIndex === idx && (
                    <div style={{ padding: '0 1rem 0.85rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Tip / Prompt */}
          <div
            className="glass-card"
            style={{
              padding: '1.5rem',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--primary-glow) 100%)',
              border: '1px solid var(--primary-glow)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <Sparkles size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>Smart AI Routing</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              SolveHub uses Bayesian categorization and automated expert rules to route your query directly to the responsible mentor.
            </p>
          </div>

        </div>
      </div>

      {/* Modals */}
      <SubmitQueryModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />

      <QueryDetailModal
        query={activeSelectedQuery}
        isOpen={Boolean(activeSelectedQuery)}
        onClose={() => setSelectedQuery(null)}
      />
    </div>
  );
}
