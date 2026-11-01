import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { CSPOptimizerModal } from '../components/faculty/CSPOptimizerModal';
import { Modal } from '../components/common/Modal';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  ShieldCheck,
  Users,
  FileText,
  Sliders,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PlusCircle,
  UserCheck,
  UserX,
  Search,
  Filter,
  Trash2,
  Sparkles,
  Download,
  Megaphone,
  Star,
  ToggleLeft,
  ToggleRight,
  Send,
  Zap,
  BarChart3,
  Award,
  BookOpen
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
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'users' | 'rules' | 'queries'
  const [isCSPOpen, setIsCSPOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Broadcast announcement state
  const [announcementText, setAnnouncementText] = useState('Exam portal scheduled maintenance tonight from 10:00 PM to 12:00 AM.');
  const [activeAnnouncement, setActiveAnnouncement] = useState('Exam portal scheduled maintenance tonight from 10:00 PM to 12:00 AM.');
  const [isPostingAnnouncement, setIsPostingAnnouncement] = useState(false);

  // Auto-assignment toggle
  const [autoAssignmentEnabled, setAutoAssignmentEnabled] = useState(true);

  // Modals
  const [assignModalQuery, setAssignModalQuery] = useState(null);
  const [selectedFacultyForQuery, setSelectedFacultyForQuery] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddRuleModalOpen, setIsAddRuleModalOpen] = useState(false);

  // New User modal form state
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'student', // 'student' | 'faculty'
    department: 'Artificial Intelligence & Data Science',
    roll: '',
    specialization: 'Assistant Professor'
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

  // User management state (with simulated suspend/activate)
  const [userStatusMap, setUserStatusMap] = useState({
    '1': 'Active',
    '2': 'Active',
    '3': 'Active',
    '4': 'Active',
    '5': 'Active'
  });

  // Metrics
  const totalQueries = queries.length;
  const pendingQueries = queries.filter(q => q.status === 'Pending').length;
  const inProgressQueries = queries.filter(q => q.status === 'In Progress' || q.status === 'Answered').length;
  const resolvedQueries = queries.filter(q => q.status === 'Resolved').length;

  // Filtered queries
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

  // Analytics Chart Data
  const weeklyTrendData = [
    { day: 'Mon', queries: 8, resolved: 7 },
    { day: 'Tue', queries: 14, resolved: 12 },
    { day: 'Wed', queries: 11, resolved: 10 },
    { day: 'Thu', queries: 18, resolved: 16 },
    { day: 'Fri', queries: 12, resolved: 11 },
    { day: 'Sat', queries: 6, resolved: 5 },
    { day: 'Sun', queries: 4, resolved: 4 }
  ];

  const categoryDonutData = useMemo(() => {
    const counts = {};
    queries.forEach(q => {
      counts[q.category] = (counts[q.category] || 0) + 1;
    });
    const colors = ['#B6F36B', '#8B5CF6', '#EC4899', '#38BDF8', '#F59E0B', '#10B981'];
    return Object.entries(counts).map(([name, value], idx) => ({
      name,
      value,
      color: colors[idx % colors.length]
    }));
  }, [queries]);

  const departmentResolutionData = [
    { dept: 'AI & Data Science', avgHours: 1.6 },
    { dept: 'Computer Science', avgHours: 2.1 },
    { dept: 'Information Tech', avgHours: 1.9 },
    { dept: 'Exam Branch', avgHours: 3.4 },
    { dept: 'Accounts & Fees', avgHours: 2.8 }
  ];

  // Faculty leaderboard
  const facultyLeaderboard = useMemo(() => {
    return faculty.map((f, idx) => {
      const assigned = queries.filter(q => q.assignedTo === f.name).length;
      const resolved = queries.filter(q => q.assignedTo === f.name && q.status === 'Resolved').length;
      return {
        name: f.name,
        department: f.department,
        assigned: assigned || (idx === 0 ? 8 : 4),
        resolved: resolved || (idx === 0 ? 7 : 3),
        rating: (4.7 + (idx * 0.08) % 0.3).toFixed(1),
        avgTime: `${1.2 + (idx * 0.4)}h`
      };
    });
  }, [faculty, queries]);

  // Handle Export CSV
  const handleExportCSV = () => {
    const headers = ['Query ID', 'Student Name', 'Roll Number', 'Category', 'Priority', 'Status', 'Assigned Mentor', 'Created At'];
    const rows = queries.map(q => [
      `"${q.id}"`,
      `"${q.studentName}"`,
      `"${q.studentRoll || 'N/A'}"`,
      `"${q.category}"`,
      `"${q.priority}"`,
      `"${q.status}"`,
      `"${q.assignedTo || 'Unassigned'}"`,
      `"${new Date(q.createdAt).toLocaleDateString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SolveHub_Queries_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Query report downloaded as CSV', 'success');
  };

  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    setIsPostingAnnouncement(true);
    setTimeout(() => {
      setActiveAnnouncement(announcementText);
      setIsPostingAnnouncement(false);
      showToast('Live campus announcement broadcasted to all student portals!', 'success');
    }, 600);
  };

  const toggleUserStatus = (id) => {
    setUserStatusMap(prev => ({
      ...prev,
      [id]: prev[id] === 'Suspended' ? 'Active' : 'Suspended'
    }));
    showToast(`User status updated to ${userStatusMap[id] === 'Suspended' ? 'Active' : 'Suspended'}`, 'info');
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserData.name || !newUserData.email) return;

    if (newUserData.role === 'faculty') {
      addFacultyMember({
        name: newUserData.name,
        email: newUserData.email,
        department: newUserData.department,
        role: newUserData.specialization,
        available: true,
        maxLoad: 6
      });
    }

    setIsAddUserModalOpen(false);
    showToast(`New ${newUserData.role} (${newUserData.name}) registered successfully!`, 'success');
    setNewUserData({
      name: '',
      email: '',
      role: 'student',
      department: 'Artificial Intelligence & Data Science',
      roll: '',
      specialization: 'Assistant Professor'
    });
  };

  const handleCreateRule = async (e) => {
    e.preventDefault();
    if (!newRuleData.rule_code || !newRuleData.condition || !newRuleData.suggestion) return;

    await addRule(newRuleData);
    setIsAddRuleModalOpen(false);
    showToast(`Rule ${newRuleData.rule_code} added to AI Knowledge Engine`, 'success');
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
      {/* 1. Admin Header Banner */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '16px',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 20px var(--primary-glow)'
            }}
          >
            <ShieldCheck size={28} color="var(--bg-main)" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                SolveHub Governance Panel
              </h1>
              <span style={{ fontSize: '0.75rem', background: 'var(--primary-glow)', color: 'var(--primary)', border: '1px solid var(--border)', padding: '3px 10px', borderRadius: '999px', fontWeight: 700 }}>
                Super Admin Desk
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Institutional control: query routing, faculty assignment, user accounts, and resolution metrics.
            </p>
          </div>
        </div>

        {/* Action Buttons: Export & CSP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportCSV}
            className="btn btn-outline"
            style={{ borderRadius: '9999px', gap: '6px' }}
          >
            <Download size={16} />
            <span>Export CSV Report</span>
          </button>

          <button
            onClick={() => setIsCSPOpen(true)}
            className="btn btn-primary"
            style={{ borderRadius: '9999px', gap: '6px' }}
          >
            <Zap size={16} />
            <span>CSP Auto-Balancer</span>
          </button>
        </div>
      </div>

      {/* 2. Broadcast Announcement Banner Card */}
      <div
        className="glass-card"
        style={{
          padding: '1.5rem 1.75rem',
          borderRadius: '24px',
          marginBottom: '2rem',
          border: '1px solid var(--border)',
          background: 'var(--bg-glass-heavy)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
          <Megaphone size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Broadcast Campus Announcement
          </h3>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            (Visible on all student and faculty dashboards)
          </span>
        </div>

        <form onSubmit={handlePostAnnouncement} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-input"
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            placeholder="e.g. Exam portal maintenance tonight 10 PM..."
            style={{ flex: 1, minWidth: '280px', borderRadius: '9999px', height: '42px', paddingLeft: '1rem' }}
          />
          <button
            type="submit"
            disabled={isPostingAnnouncement}
            className="btn btn-primary"
            style={{ borderRadius: '9999px', gap: '6px' }}
          >
            <Send size={15} />
            <span>{isPostingAnnouncement ? 'Broadcasting...' : 'Broadcast Alert'}</span>
          </button>
        </form>

        {activeAnnouncement && (
          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Currently Live:</span>
            <span>"{activeAnnouncement}"</span>
          </div>
        )}
      </div>

      {/* 3. Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border)',
          marginBottom: '2rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem'
        }}
      >
        {[
          { id: 'analytics', label: 'Overview Analytics', icon: <BarChart3 size={16} /> },
          { id: 'users', label: 'User Management', icon: <Users size={16} /> },
          { id: 'rules', label: 'Assignment Rules', icon: <Sliders size={16} /> },
          { id: 'queries', label: `All Queries (${totalQueries})`, icon: <FileText size={16} /> }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '9999px',
                border: 'none',
                background: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? 'var(--bg-main)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                marginBottom: '6px'
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Tab Contents */}

      {/* TAB A: OVERVIEW ANALYTICS */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Top 4 Metric Cards */}
          <div className="grid-4">
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '24px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Queries</span>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.4rem', fontFamily: 'var(--font-heading)' }}>
                {totalQueries}
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '4px' }}>Logged in academic year</p>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '24px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Resolution Efficiency</span>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.4rem', fontFamily: 'var(--font-heading)' }}>
                {Math.round(((resolvedQueries + inProgressQueries) / (totalQueries || 1)) * 100)}%
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Answered / Closed queries</p>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '24px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Mentors</span>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.4rem', fontFamily: 'var(--font-heading)' }}>
                {faculty.filter(f => f.available).length} / {faculty.length}
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Ready for dispatch</p>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '24px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Review</span>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--warning)', marginTop: '0.4rem', fontFamily: 'var(--font-heading)' }}>
                {pendingQueries}
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Awaiting mentor response</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid-2" style={{ gap: '1.75rem' }}>
            {/* Total Queries Line Chart (Weekly Trend) */}
            <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem', fontFamily: 'var(--font-heading)' }}>
                Weekly Inflow & Resolution Trend
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Total student queries vs tickets resolved daily
              </p>

              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyTrendData}>
                    <XAxis dataKey="day" stroke="var(--text-muted)" />
                    <YAxis stroke="var(--text-muted)" />
                    <Tooltip contentStyle={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)' }} />
                    <Legend />
                    <Line type="monotone" dataKey="queries" stroke="var(--primary)" strokeWidth={3} name="Inbound Queries" />
                    <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={3} name="Resolved" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Distribution Donut Chart */}
            <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem', fontFamily: 'var(--font-heading)' }}>
                Category Distribution
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Query distribution across academic and administrative branches
              </p>

              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDonutData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                    >
                      {categoryDonutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Avg Resolution Time per Department Bar Chart */}
          <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem', fontFamily: 'var(--font-heading)' }}>
              Avg Resolution Time by Department (Hours)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Target turnaround time is under 4.0 hours for all faculties
            </p>

            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentResolutionData}>
                  <XAxis dataKey="dept" stroke="var(--text-muted)" />
                  <YAxis stroke="var(--text-muted)" />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)' }} />
                  <Bar dataKey="avgHours" fill="var(--primary)" radius={[8, 8, 0, 0]} name="Avg Hours to Resolve" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Teacher Performance Leaderboard Table */}
          <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                  Mentor Performance Leaderboard
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Resolution velocity, workload, and student satisfaction ratings
                </p>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--primary-glow)', padding: '4px 12px', borderRadius: '999px' }}>
                <Award size={14} color="var(--primary)" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>Top Mentors</span>
              </div>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Mentor Name</th>
                    <th>Department</th>
                    <th>Assigned Tickets</th>
                    <th>Resolved</th>
                    <th>Avg Rating</th>
                    <th>Avg Response Time</th>
                  </tr>
                </thead>
                <tbody>
                  {facultyLeaderboard.map((f, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {f.name}
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {f.department}
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{f.assigned}</span>
                      </td>
                      <td>
                        <span style={{ color: 'var(--success)', fontWeight: 700 }}>{f.resolved}</span>
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#EAB308', fontWeight: 700 }}>
                          <Star size={13} fill="#EAB308" /> {f.rating}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--primary)' }}>
                        {f.avgTime}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB B: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                User Accounts Management
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                View and manage registered students, mentors, and administrators
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ position: 'relative', width: '260px' }}>
                <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search user or email..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  style={{ paddingLeft: '34px', fontSize: '0.825rem', borderRadius: '9999px', height: '38px' }}
                />
              </div>

              <button
                onClick={() => setIsAddUserModalOpen(true)}
                className="btn btn-primary"
                style={{ borderRadius: '9999px', gap: '6px' }}
              >
                <PlusCircle size={16} />
                <span>Add User</span>
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Name & Enrollment</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Account Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Students list */}
                {registeredStudents
                  .filter(s => !userSearchTerm || s.full_name?.toLowerCase().includes(userSearchTerm.toLowerCase()) || s.email?.toLowerCase().includes(userSearchTerm.toLowerCase()))
                  .map(s => (
                    <tr key={s.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{s.full_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.enrollment_number}</div>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{s.email}</td>
                      <td>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '999px', background: 'var(--primary-glow)', color: 'var(--primary)' }}>
                          Student
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{s.department}</td>
                      <td>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: userStatusMap[s.id] === 'Suspended' ? 'var(--danger)' : 'var(--success)' }}>
                          {userStatusMap[s.id] || 'Active'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => toggleUserStatus(s.id)}
                            className="btn btn-secondary btn-sm"
                            style={{ borderRadius: '9999px', fontSize: '0.75rem' }}
                          >
                            {userStatusMap[s.id] === 'Suspended' ? 'Activate' : 'Suspend'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                {/* Faculty list */}
                {faculty
                  .filter(f => !userSearchTerm || f.name.toLowerCase().includes(userSearchTerm.toLowerCase()) || f.email?.toLowerCase().includes(userSearchTerm.toLowerCase()))
                  .map(f => (
                    <tr key={f.id || f.name}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{f.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{f.role}</div>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{f.email || 'faculty@university.edu'}</td>
                      <td>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '999px', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)' }}>
                          Faculty
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{f.department}</td>
                      <td>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: f.available ? 'var(--success)' : 'var(--warning)' }}>
                          {f.available ? 'Active (Ready)' : 'On Leave'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => updateFacultyMember(f.id, { available: !f.available })}
                          className="btn btn-secondary btn-sm"
                          style={{ borderRadius: '9999px', fontSize: '0.75rem' }}
                        >
                          {f.available ? 'Set Away' : 'Set Available'}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB C: ASSIGNMENT RULES */}
      {activeTab === 'rules' && (
        <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                Query Auto-Assignment & Expert Rules
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Routing rules evaluated in real-time when students submit tickets
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* Toggle auto-assignment */}
              <button
                onClick={() => {
                  setAutoAssignmentEnabled(!autoAssignmentEnabled);
                  showToast(!autoAssignmentEnabled ? 'Auto-assignment enabled' : 'Auto-assignment disabled', 'info');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  border: '1px solid var(--border)',
                  background: autoAssignmentEnabled ? 'var(--primary-glow)' : 'var(--bg-glass-heavy)',
                  color: autoAssignmentEnabled ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.8rem'
                }}
              >
                <span>{autoAssignmentEnabled ? 'Auto-Routing: Active' : 'Auto-Routing: Paused'}</span>
              </button>

              <button
                onClick={() => setIsAddRuleModalOpen(true)}
                className="btn btn-primary"
                style={{ borderRadius: '9999px', gap: '6px' }}
              >
                <PlusCircle size={16} />
                <span>Add Rule</span>
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Rule Code</th>
                  <th>Category</th>
                  <th>Condition (Trigger)</th>
                  <th>Automated Directive / Answer</th>
                  <th>Confidence</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {knowledgeRules.map(rule => (
                  <tr key={rule.rule_code || rule.id}>
                    <td>
                      <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                        {rule.rule_code}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', background: 'var(--primary-glow)', padding: '2px 8px', borderRadius: '6px' }}>
                        {rule.category}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', maxWidth: '240px' }}>
                      {rule.condition}
                    </td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)', maxWidth: '300px' }}>
                      {rule.suggestion}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)' }}>
                        {Math.round((rule.confidence_score || 0.9) * 100)}%
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => deleteRule(rule.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--danger)', borderRadius: '9999px' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB D: ALL QUERIES */}
      {activeTab === 'queries' && (
        <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
              All System Inquiries
            </h3>

            {/* Filter controls */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search ticket, student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '220px', fontSize: '0.8rem', borderRadius: '9999px', height: '36px' }}
              />

              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ width: 'auto', fontSize: '0.8rem', borderRadius: '9999px' }}
              >
                <option value="All">All Categories</option>
                <option value="Attendance">Attendance</option>
                <option value="Exams">Exams</option>
                <option value="Fees">Fees</option>
                <option value="Timetable">Timetable</option>
              </select>

              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ width: 'auto', fontSize: '0.8rem', borderRadius: '9999px' }}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Answered">Answered</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

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
                  <th>Assigned Mentor</th>
                  <th style={{ textAlign: 'right' }}>Reassign</th>
                </tr>
              </thead>
              <tbody>
                {filteredQueries.map(q => (
                  <tr key={q.id}>
                    <td>
                      <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>{q.id}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{q.studentName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{q.studentRoll}</div>
                    </td>
                    <td style={{ maxWidth: '280px' }}>
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
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                      {q.assignedTo !== 'Unassigned' ? q.assignedTo : 'Unassigned'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          setAssignModalQuery(q);
                          setSelectedFacultyForQuery(q.assignedTo !== 'Unassigned' ? q.assignedTo : '');
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ borderRadius: '9999px', fontSize: '0.75rem' }}
                      >
                        Reassign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manual Assignment Modal */}
      <Modal
        isOpen={Boolean(assignModalQuery)}
        onClose={() => setAssignModalQuery(null)}
        title={`Reassign Query: ${assignModalQuery?.id}`}
        subtitle={`Student: ${assignModalQuery?.studentName} • Category: ${assignModalQuery?.category}`}
        maxWidth="500px"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          if (!selectedFacultyForQuery) return;
          const facObj = faculty.find(f => f.name === selectedFacultyForQuery);
          assignQuery(assignModalQuery.id, selectedFacultyForQuery, facObj ? facObj.department : assignModalQuery.assignedDept);
          setAssignModalQuery(null);
        }}>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Select Mentor / Faculty Member</label>
            <select
              className="form-select"
              value={selectedFacultyForQuery}
              onChange={(e) => setSelectedFacultyForQuery(e.target.value)}
              required
            >
              <option value="" disabled>-- Select Faculty --</option>
              {faculty.map(f => (
                <option key={f.id || f.name} value={f.name}>
                  {f.name} ({f.department}) {!f.available ? '[Away]' : `[Load: ${f.currentLoad}/${f.maxLoad}]`}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setAssignModalQuery(null)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Confirm Assignment
            </button>
          </div>
        </form>
      </Modal>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title="Add New User Account"
        subtitle="Provision access for new students, mentors, or academic advisors."
        maxWidth="520px"
      >
        <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Account Role</label>
            <select
              className="form-select"
              value={newUserData.role}
              onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty / Mentor</option>
            </select>
          </div>

          <div>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={newUserData.name}
              onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={newUserData.email}
              onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="form-label">Department</label>
            <input
              type="text"
              className="form-input"
              value={newUserData.department}
              onChange={(e) => setNewUserData({ ...newUserData, department: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddUserModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Account
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Rule Modal */}
      <Modal
        isOpen={isAddRuleModalOpen}
        onClose={() => setIsAddRuleModalOpen(false)}
        title="Add AI Knowledge Rule"
        subtitle="Define an expert rule for automated query categorization and resolution."
        maxWidth="520px"
      >
        <form onSubmit={handleCreateRule} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Rule Code (e.g. RULE-ATT-05)</label>
            <input
              type="text"
              className="form-input"
              value={newRuleData.rule_code}
              onChange={(e) => setNewRuleData({ ...newRuleData, rule_code: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={newRuleData.category}
              onChange={(e) => setNewRuleData({ ...newRuleData, category: e.target.value })}
            >
              <option value="Attendance">Attendance</option>
              <option value="Exams">Exams</option>
              <option value="Fees">Fees</option>
              <option value="Hostel">Hostel</option>
            </select>
          </div>

          <div>
            <label className="form-label">Trigger Condition</label>
            <input
              type="text"
              className="form-input"
              value={newRuleData.condition}
              onChange={(e) => setNewRuleData({ ...newRuleData, condition: e.target.value })}
              placeholder="e.g. attendance < 75% AND hospitalized"
              required
            />
          </div>

          <div>
            <label className="form-label">Automated Directive / Recommendation</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={newRuleData.suggestion}
              onChange={(e) => setNewRuleData({ ...newRuleData, suggestion: e.target.value })}
              placeholder="e.g. Apply for condonation with doctor certificate..."
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddRuleModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Rule
            </button>
          </div>
        </form>
      </Modal>

      {/* CSP Optimizer Modal */}
      <CSPOptimizerModal
        isOpen={isCSPOpen}
        onClose={() => setIsCSPOpen(false)}
      />
    </div>
  );
}
