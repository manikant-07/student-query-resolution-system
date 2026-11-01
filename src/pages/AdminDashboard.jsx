import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { CSPOptimizerModal } from '../components/faculty/CSPOptimizerModal';
import { Modal } from '../components/common/Modal';
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  Sliders, 
  BookOpen, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  PlusCircle, 
  UserCheck, 
  UserX, 
  RefreshCw,
  Search,
  Filter,
  Trash2,
  Edit3,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export function AdminDashboard() {
  const { 
    queries, 
    faculty, 
    knowledgeRules, 
    registeredStudents, 
    assignQuery, 
    updateQueryStatus,
    updateFacultyMember,
    addFacultyMember,
    updateRule,
    addRule,
    deleteRule,
    refreshAllData
  } = useApp();

  const [activeTab, setActiveTab] = useState('queries'); // 'queries' | 'faculty' | 'rules' | 'students' | 'analytics'
  const [isCSPOpen, setIsCSPOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [assignModalQuery, setAssignModalQuery] = useState(null);
  const [selectedFacultyForQuery, setSelectedFacultyForQuery] = useState('');
  const [isAddFacultyModalOpen, setIsAddFacultyModalOpen] = useState(false);
  const [isAddRuleModalOpen, setIsAddRuleModalOpen] = useState(false);

  // New Faculty Form state
  const [newFacultyData, setNewFacultyData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Assistant Professor',
    department: 'Artificial Intelligence & Data Science',
    subjects: '',
    maxLoad: 5,
  });

  // New Rule Form state
  const [newRuleData, setNewRuleData] = useState({
    rule_code: '',
    category: 'Attendance',
    condition: '',
    suggestion: '',
    description: '',
    confidence_score: 0.90,
  });

  // Analytics Metrics
  const totalQueries = queries.length;
  const pendingQueries = queries.filter(q => q.status === 'Pending').length;
  const answeredQueries = queries.filter(q => q.status === 'Answered').length;
  const resolvedQueries = queries.filter(q => q.status === 'Resolved').length;
  const urgentQueries = queries.filter(q => q.priority === 'Urgent').length;
  const activeFacultyCount = faculty.filter(f => f.available).length;

  // Filtered queries for queries tab
  const filteredQueries = useMemo(() => {
    return queries.filter(q => {
      const matchCat = categoryFilter === 'All' || q.category === categoryFilter;
      const matchStatus = statusFilter === 'All' || q.status === statusFilter;
      const term = searchTerm.toLowerCase();
      const matchSearch = !searchTerm ||
        q.subject.toLowerCase().includes(term) ||
        q.studentName.toLowerCase().includes(term) ||
        (q.studentRoll && q.studentRoll.toLowerCase().includes(term)) ||
        q.id.toLowerCase().includes(term);

      return matchCat && matchStatus && matchSearch;
    });
  }, [queries, categoryFilter, statusFilter, searchTerm]);

  // Handle Manual Assignment
  const handleConfirmAssignment = (e) => {
    e.preventDefault();
    if (!assignModalQuery || !selectedFacultyForQuery) return;

    const facObj = faculty.find(f => f.name === selectedFacultyForQuery);
    assignQuery(assignModalQuery.id, selectedFacultyForQuery, facObj ? facObj.department : assignModalQuery.assignedDept);
    setAssignModalQuery(null);
    setSelectedFacultyForQuery('');
  };

  // Handle Add Faculty
  const handleCreateFaculty = async (e) => {
    e.preventDefault();
    if (!newFacultyData.name || !newFacultyData.email) return;

    await addFacultyMember({
      ...newFacultyData,
      password: newFacultyData.password || 'FacultyPass@123',
      subjects: newFacultyData.subjects ? newFacultyData.subjects.split(',').map(s => s.trim()) : [],
      available: true,
    });

    setIsAddFacultyModalOpen(false);
    setNewFacultyData({
      name: '',
      email: '',
      password: '',
      role: 'Assistant Professor',
      department: 'Artificial Intelligence & Data Science',
      subjects: '',
      maxLoad: 5,
    });
  };

  // Handle Add Rule
  const handleCreateRule = async (e) => {
    e.preventDefault();
    if (!newRuleData.rule_code || !newRuleData.condition || !newRuleData.suggestion) return;

    await addRule(newRuleData);
    setIsAddRuleModalOpen(false);
    setNewRuleData({
      rule_code: '',
      category: 'Attendance',
      condition: '',
      suggestion: '',
      description: '',
      confidence_score: 0.90,
    });
  };

  return (
    <div className="page-wrapper">
      {/* Admin Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
          borderRadius: '20px',
          padding: '2rem',
          color: '#ffffff',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            <ShieldCheck size={32} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h2 style={{ fontSize: '1.6rem', color: '#ffffff', margin: 0 }}>
                Administration & Governance Portal
              </h2>
              <span style={{ fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.2)', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                Super Admin Access
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#cbd5e1', marginTop: '4px' }}>
              Institutional control desk: Manage all queries, faculty dispatch, academic expert rules, and system analytics.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button
            onClick={() => setIsCSPOpen(true)}
            className="btn btn-secondary"
            style={{ background: 'rgba(255, 255, 255, 0.9)', color: '#1e1b4b', fontWeight: 700 }}
          >
            <Sparkles size={16} color="#4338ca" />
            <span>Batch CSP Optimizer</span>
          </button>
          <button
            onClick={refreshAllData}
            title="Refresh database records"
            className="btn btn-secondary"
            style={{ background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', color: '#ffffff' }}
          >
            <RefreshCw size={15} />
            <span>Sync DB</span>
          </button>
        </div>
      </div>

      {/* Quick KPI Cards */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Inquiries</span>
            <FileText size={18} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: '1.85rem', color: 'var(--text-primary)', marginTop: '0.35rem' }}>{totalQueries}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registered across all students</p>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Review</span>
            <Clock size={18} color="#f59e0b" />
          </div>
          <h3 style={{ fontSize: '1.85rem', color: '#f59e0b', marginTop: '0.35rem' }}>{pendingQueries}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Awaiting faculty response</p>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Urgent Priority</span>
            <AlertTriangle size={18} color="#ef4444" />
          </div>
          <h3 style={{ fontSize: '1.85rem', color: '#ef4444', marginTop: '0.35rem' }}>{urgentQueries}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Critical time-bound tickets</p>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Faculty</span>
            <Users size={18} color="#10b981" />
          </div>
          <h3 style={{ fontSize: '1.85rem', color: '#10b981', marginTop: '0.35rem' }}>
            {activeFacultyCount} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {faculty.length}</span>
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Available for CSP auto-dispatch</p>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border)',
          marginBottom: '1.5rem',
          gap: '0.5rem',
          overflowX: 'auto',
        }}
      >
        {[
          { key: 'queries', label: `All Queries (${queries.length})`, icon: <FileText size={17} /> },
          { key: 'faculty', label: `Faculty Directory (${faculty.length})`, icon: <Users size={17} /> },
          { key: 'rules', label: `Knowledge Rules (${knowledgeRules.length})`, icon: <Sliders size={17} /> },
          { key: 'students', label: `Enrolled Students (${registeredStudents.length || 6})`, icon: <UserCheck size={17} /> },
          { key: 'analytics', label: 'Workload & Analytics', icon: <TrendingUp size={17} /> },
        ].map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '0.75rem 1.25rem',
              border: 'none',
              background: 'transparent',
              color: activeTab === tab.key ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.925rem',
              borderBottom: `2px solid ${activeTab === tab.key ? 'var(--primary)' : 'transparent'}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
              transition: 'all 150ms',
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: ALL QUERIES MANAGEMENT */}
      {activeTab === 'queries' && (
        <div>
          {/* Filters Bar */}
          <div
            className="glass-card"
            style={{
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: '260px' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search by student, ID, subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2rem' }}
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="form-select"
                style={{ width: 'auto' }}
              >
                <option value="All">All Categories</option>
                <option value="Attendance">Attendance</option>
                <option value="Exams">Exams</option>
                <option value="Fees">Fees</option>
                <option value="Timetable">Timetable</option>
                <option value="Technical">Technical</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-select"
                style={{ width: 'auto' }}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Answered">Answered</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing <strong>{filteredQueries.length}</strong> of {queries.length} queries
            </div>
          </div>

          {/* Queries Table */}
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Query ID</th>
                  <th>Student Info</th>
                  <th>Subject & Category</th>
                  <th>Priority</th>
                  <th>Assigned Faculty</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQueries.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No matching queries found.
                    </td>
                  </tr>
                ) : (
                  filteredQueries.map(q => (
                    <tr key={q.id}>
                      <td>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>
                          {q.id}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{q.studentName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{q.studentRoll}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {q.subject}
                        </div>
                        <span style={{ fontSize: '0.72rem', background: 'var(--bg-subtle)', color: 'var(--text-secondary)', padding: '2px 6px', borderRadius: '4px' }}>
                          {q.category}
                        </span>
                      </td>
                      <td>
                        <PriorityBadge priority={q.priority} />
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem', color: q.assignedTo === 'Unassigned' ? '#ef4444' : 'var(--text-primary)', fontWeight: 500 }}>
                          {q.assignedTo}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{q.assignedDept}</div>
                      </td>
                      <td>
                        <StatusBadge status={q.status} />
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setAssignModalQuery(q);
                              setSelectedFacultyForQuery(q.assignedTo !== 'Unassigned' ? q.assignedTo : '');
                            }}
                            className="btn btn-secondary btn-sm"
                            title="Reassign or Assign Faculty"
                          >
                            <UserCheck size={14} />
                            <span>Assign</span>
                          </button>
                          {q.status !== 'Resolved' && (
                            <button
                              type="button"
                              onClick={() => updateQueryStatus(q.id, 'Resolved')}
                              className="btn btn-sm"
                              style={{ background: 'var(--success-light)', color: 'var(--success)', border: '1px solid var(--success)' }}
                              title="Mark as Resolved"
                            >
                              <CheckCircle2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: FACULTY DIRECTORY & WORKLOAD */}
      {activeTab === 'faculty' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Faculty & Academic Resolvers</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Configure department assignment, maximum workload capacities for CSP balancing, and active availability.
              </p>
            </div>
            <button
              onClick={() => setIsAddFacultyModalOpen(true)}
              className="btn btn-primary"
            >
              <PlusCircle size={16} />
              <span>Add Faculty Member</span>
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Faculty Name</th>
                  <th>Department</th>
                  <th>Specialization & Subjects</th>
                  <th>Workload Capacity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {faculty.map(f => {
                  const loadPercent = Math.min(100, Math.round(((f.currentLoad || 0) / (f.maxLoad || 5)) * 100));
                  return (
                    <tr key={f.id || f.name}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{f.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{f.email}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{f.department}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {(f.subjects || []).map(s => (
                            <span key={s} style={{ fontSize: '0.72rem', background: 'var(--bg-subtle)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ minWidth: '160px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                          <span>{f.currentLoad || 0} / {f.maxLoad || 5} active</span>
                          <span style={{ fontWeight: 700 }}>{loadPercent}%</span>
                        </div>
                        <div style={{ height: '6px', background: 'var(--border)', borderRadius: '999px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${loadPercent}%`,
                              height: '100%',
                              background: loadPercent > 80 ? '#ef4444' : loadPercent > 50 ? '#f59e0b' : '#10b981',
                              borderRadius: '999px',
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '999px',
                            background: f.available ? 'var(--success-light)' : 'var(--danger-light)',
                            color: f.available ? 'var(--success)' : 'var(--danger)',
                          }}
                        >
                          {f.available ? 'Active / Available' : 'On Leave'}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => updateFacultyMember(f.id, { available: !f.available })}
                          className="btn btn-secondary btn-sm"
                        >
                          {f.available ? 'Mark On Leave' : 'Set Available'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: KNOWLEDGE RULES ENGINE */}
      {activeTab === 'rules' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Expert System Academic Knowledge Rules</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Production rules evaluated by the AI Inference Engine when students submit inquiries.
              </p>
            </div>
            <button
              onClick={() => setIsAddRuleModalOpen(true)}
              className="btn btn-primary"
            >
              <PlusCircle size={16} />
              <span>Add Knowledge Rule</span>
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Rule Code</th>
                  <th>Category</th>
                  <th>Premise / Condition</th>
                  <th>Automated Policy Suggestion</th>
                  <th>Certainty</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {knowledgeRules.map(r => (
                  <tr key={r.id || r.rule_code || r.code}>
                    <td>
                      <code style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>
                        {r.rule_code || r.code}
                      </code>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{r.category}</span>
                    </td>
                    <td>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', maxWidth: '240px', lineHeight: 1.4 }}>
                        {r.condition}
                      </p>
                    </td>
                    <td>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-primary)', maxWidth: '320px', lineHeight: 1.4 }}>
                        {r.suggestion || r.conclusion}
                      </p>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {Math.round((r.confidence_score || r.certainty || 0.90) * 100)}%
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '999px',
                          background: r.is_active !== false ? 'var(--success-light)' : 'var(--danger-light)',
                          color: r.is_active !== false ? 'var(--success)' : 'var(--danger)',
                        }}
                      >
                        {r.is_active !== false ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button
                          type="button"
                          onClick={() => updateRule(r.id, { is_active: !r.is_active })}
                          className="btn btn-secondary btn-sm"
                        >
                          {r.is_active !== false ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteRule(r.id)}
                          className="btn btn-sm btn-ghost"
                          style={{ color: 'var(--danger)' }}
                          title="Delete rule"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: REGISTERED STUDENTS */}
      {activeTab === 'students' && (
        <div>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Registered Student Directory</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Live student profiles stored in the PostgreSQL database.
            </p>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Enrollment Roll</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Semester</th>
                  <th>Queries Submitted</th>
                </tr>
              </thead>
              <tbody>
                {registeredStudents.map((st, idx) => {
                  const studentQueryCount = queries.filter(q => q.studentName === st.full_name || q.studentRoll === st.enrollment_number).length;
                  return (
                    <tr key={st.id || idx}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{st.full_name}</div>
                      </td>
                      <td>
                        <code style={{ fontSize: '0.8rem', fontWeight: 600 }}>{st.enrollment_number}</code>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{st.email}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem' }}>{st.department}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', background: 'var(--bg-subtle)', padding: '2px 6px', borderRadius: '4px' }}>
                          {st.semester}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{studentQueryCount}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: WORKLOAD & ANALYTICS */}
      {activeTab === 'analytics' && (
        <div>
          <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                Department Resolution Performance
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { dept: 'Artificial Intelligence & Data Science', total: 6, resolved: 4 },
                  { dept: 'Examination Branch', total: 4, resolved: 3 },
                  { dept: 'Academic Scheduling Committee', total: 3, resolved: 3 },
                  { dept: 'Accounts & Finance Office', total: 2, resolved: 1 },
                  { dept: 'IT & Campus Infrastructure', total: 2, resolved: 2 },
                ].map(d => {
                  const percent = Math.round((d.resolved / d.total) * 100);
                  return (
                    <div key={d.dept}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600 }}>{d.dept}</span>
                        <span>{d.resolved}/{d.total} ({percent}%)</span>
                      </div>
                      <div style={{ height: '8px', background: 'var(--border)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: `${percent}%`, height: '100%', background: 'var(--primary)', borderRadius: '999px' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                CSP Workload Balancing Matrix
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {faculty.map(f => {
                  const percent = Math.min(100, Math.round(((f.currentLoad || 0) / (f.maxLoad || 5)) * 100));
                  return (
                    <div key={f.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{f.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{f.department}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: percent > 80 ? '#ef4444' : 'var(--primary)' }}>
                          {f.currentLoad || 0} / {f.maxLoad || 5} Slots
                        </div>
                        <span style={{ fontSize: '0.7rem', color: f.available ? 'var(--success)' : 'var(--danger)' }}>
                          {f.available ? 'Accepting CSP Tickets' : 'On Leave'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: MANUAL ASSIGNMENT */}
      <Modal
        isOpen={Boolean(assignModalQuery)}
        onClose={() => setAssignModalQuery(null)}
        title={`Assign Faculty: ${assignModalQuery?.id}`}
        subtitle="Manually route student query to eligible academic advisor"
        maxWidth="500px"
      >
        {assignModalQuery && (
          <form onSubmit={handleConfirmAssignment}>
            <div style={{ marginBottom: '1.25rem', padding: '0.85rem', background: 'var(--bg-subtle)', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{assignModalQuery.subject}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Category: {assignModalQuery.category} • Current: {assignModalQuery.assignedTo}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Select Faculty Member</label>
              <select
                className="form-select"
                value={selectedFacultyForQuery}
                onChange={(e) => setSelectedFacultyForQuery(e.target.value)}
                required
              >
                <option value="">-- Choose Faculty --</option>
                {faculty.map(f => (
                  <option key={f.name} value={f.name} disabled={!f.available}>
                    {f.name} ({f.department}) {!f.available ? '[ON LEAVE]' : `[Load: ${f.currentLoad || 0}/${f.maxLoad || 5}]`}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setAssignModalQuery(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Confirm Assignment
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* MODAL 2: ADD FACULTY */}
      <Modal
        isOpen={isAddFacultyModalOpen}
        onClose={() => setIsAddFacultyModalOpen(false)}
        title="Add Faculty Member"
        subtitle="Register academic advisor for inquiry resolution & CSP dispatch"
        maxWidth="520px"
      >
        <form onSubmit={handleCreateFaculty}>
          <div className="form-group">
            <label className="form-label">Full Name & Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Dr. Ramesh Gupta"
              value={newFacultyData.name}
              onChange={(e) => setNewFacultyData({ ...newFacultyData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Official Email *</label>
            <input
              type="email"
              className="form-input"
              placeholder="ramesh.gupta@college.edu"
              value={newFacultyData.email}
              onChange={(e) => setNewFacultyData({ ...newFacultyData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Temporary / Initial Password (Optional)</label>
            <input
              type="password"
              className="form-input"
              placeholder="Defaults to FacultyPass@123"
              value={newFacultyData.password}
              onChange={(e) => setNewFacultyData({ ...newFacultyData, password: e.target.value })}
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Faculty member will use this password to sign in to their resolution desk.
            </span>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                className="form-select"
                value={newFacultyData.department}
                onChange={(e) => setNewFacultyData({ ...newFacultyData, department: e.target.value })}
              >
                <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                <option value="Examination Branch">Examination Branch</option>
                <option value="Academic Scheduling Committee">Scheduling Committee</option>
                <option value="Accounts & Finance Office">Accounts & Finance</option>
                <option value="IT & Campus Infrastructure">IT Infrastructure</option>
                <option value="Hostel & Welfare Administration">Hostel & Welfare</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Maximum Workload</label>
              <input
                type="number"
                min="1"
                max="15"
                className="form-input"
                value={newFacultyData.maxLoad}
                onChange={(e) => setNewFacultyData({ ...newFacultyData, maxLoad: parseInt(e.target.value) || 5 })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Specializations / Subjects</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Machine Learning, Neural Networks (comma-separated)"
              value={newFacultyData.subjects}
              onChange={(e) => setNewFacultyData({ ...newFacultyData, subjects: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button
              type="button"
              onClick={() => setIsAddFacultyModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Save Faculty
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: ADD KNOWLEDGE RULE */}
      <Modal
        isOpen={isAddRuleModalOpen}
        onClose={() => setIsAddRuleModalOpen(false)}
        title="Add Expert Knowledge Rule"
        subtitle="Define production rule (IF condition THEN policy resolution)"
        maxWidth="540px"
      >
        <form onSubmit={handleCreateRule}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Rule Identifier Code *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. RULE_HOSTEL_CURFEW_PASS"
                value={newRuleData.rule_code}
                onChange={(e) => setNewRuleData({ ...newRuleData, rule_code: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={newRuleData.category}
                onChange={(e) => setNewRuleData({ ...newRuleData, category: e.target.value })}
              >
                <option value="Attendance">Attendance</option>
                <option value="Exams">Exams</option>
                <option value="Fees">Fees</option>
                <option value="Timetable">Timetable</option>
                <option value="Technical">Technical</option>
                <option value="Hostel">Hostel</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Premise / Condition *</label>
            <textarea
              className="form-textarea"
              placeholder="e.g. Late night entry permit requested for hackathon participation"
              value={newRuleData.condition}
              onChange={(e) => setNewRuleData({ ...newRuleData, condition: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Official Advisory Suggestion *</label>
            <textarea
              className="form-textarea"
              placeholder="e.g. Submit Form HP-2 countersigned by Department Mentor to Chief Warden 24 hours in advance."
              value={newRuleData.suggestion}
              onChange={(e) => setNewRuleData({ ...newRuleData, suggestion: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Certainty Factor (0.0 to 1.0)</label>
            <input
              type="number"
              step="0.05"
              min="0.1"
              max="1.0"
              className="form-input"
              value={newRuleData.confidence_score}
              onChange={(e) => setNewRuleData({ ...newRuleData, confidence_score: parseFloat(e.target.value) || 0.90 })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button
              type="button"
              onClick={() => setIsAddRuleModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Add Rule
            </button>
          </div>
        </form>
      </Modal>

      {/* CSP Batch Assignment Modal */}
      <CSPOptimizerModal
        isOpen={isCSPOpen}
        onClose={() => setIsCSPOpen(false)}
      />
    </div>
  );
}

