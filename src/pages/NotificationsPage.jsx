import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Bell,
  CheckCircle2,
  Clock,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  Trash2,
  CheckCheck,
  Sparkles
} from 'lucide-react';

export function NotificationsPage() {
  const navigate = useNavigate();
  const { notifications, markNotificationAsRead, queries, showToast } = useApp();
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  // Mock initial notifications if empty to showcase SolveHub functionality
  const displayNotifications = notifications && notifications.length > 0 ? notifications : [
    {
      id: 'n1',
      title: 'Query Resolved',
      message: 'Your query QRY-1001 regarding "Attendance Shortage in AI Lab" has been reviewed and resolved by Prof. Rajesh Sharma.',
      time: '10 minutes ago',
      isToday: true,
      read: false,
      type: 'resolved',
      queryId: 'QRY-1001'
    },
    {
      id: 'n2',
      title: 'Faculty Response Received',
      message: 'Dr. Vikram Seth added a new remark on QRY-1002 ("Exam Hall Ticket Download Error").',
      time: '2 hours ago',
      isToday: true,
      read: false,
      type: 'response',
      queryId: 'QRY-1002'
    },
    {
      id: 'n3',
      title: 'Query Auto-Assigned',
      message: 'QRY-1003 ("Clash in Mid-Term Timetable") was auto-routed to Academic Scheduling Committee.',
      time: 'Yesterday',
      isToday: false,
      read: true,
      type: 'assigned',
      queryId: 'QRY-1003'
    },
    {
      id: 'n4',
      title: 'Campus Announcement',
      message: 'End-term practical examinations scheduled to begin from Nov 24. Submit all condonation requests prior to Nov 15.',
      time: '3 days ago',
      isToday: false,
      read: true,
      type: 'announcement'
    }
  ];

  const filteredNotifs = displayNotifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const todayNotifs = filteredNotifs.filter(n => n.isToday || n.created_at?.includes(new Date().toISOString().slice(0, 10)));
  const earlierNotifs = filteredNotifs.filter(n => !n.isToday && !n.created_at?.includes(new Date().toISOString().slice(0, 10)));

  const handleMarkAllRead = () => {
    filteredNotifs.forEach(n => {
      if (!n.read && markNotificationAsRead) {
        markNotificationAsRead(n.id);
      }
    });
    showToast('All notifications marked as read', 'success');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'resolved':
        return <CheckCircle2 size={18} color="var(--success)" />;
      case 'response':
        return <MessageSquare size={18} color="var(--primary)" />;
      case 'announcement':
        return <Sparkles size={18} color="var(--warning)" />;
      default:
        return <Clock size={18} color="var(--accent-purple)" />;
    }
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Page Header */}
      <div 
        className="glass-card" 
        style={{ 
          padding: '2rem', 
          marginBottom: '2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1.25rem' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div 
            style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '16px', 
              background: 'var(--primary-glow)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <Bell size={24} color="var(--primary)" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
              Notifications Center
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Stay updated with ticket assignments, mentor answers, and status updates.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', background: 'var(--bg-glass-heavy)', borderRadius: '9999px', padding: '3px', border: '1px solid var(--border)' }}>
            <button
              onClick={() => setFilter('all')}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                border: 'none',
                background: filter === 'all' ? 'var(--primary)' : 'transparent',
                color: filter === 'all' ? 'var(--bg-main)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              All ({displayNotifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                border: 'none',
                background: filter === 'unread' ? 'var(--primary)' : 'transparent',
                color: filter === 'unread' ? 'var(--bg-main)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Unread ({displayNotifications.filter(n => !n.read).length})
            </button>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="btn btn-outline"
            style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
          >
            <CheckCheck size={16} />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Today Section */}
        {todayNotifs.length > 0 && (
          <div>
            <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 700 }}>
              Today
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {todayNotifs.map((n) => (
                <div
                  key={n.id}
                  className="glass-card"
                  style={{
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1.25rem',
                    borderLeft: !n.read ? '4px solid var(--primary)' : '1px solid var(--border)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ marginTop: '3px' }}>
                    {getIcon(n.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {n.title || 'System Notification'}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {n.time || 'Recently'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                      {n.message}
                    </p>
                    {n.queryId && (
                      <button
                        onClick={() => navigate('/queries')}
                        style={{
                          marginTop: '0.75rem',
                          background: 'none',
                          border: 'none',
                          color: 'var(--primary)',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        <span>View Ticket ({n.queryId})</span>
                        <ExternalLink size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Earlier Section */}
        {earlierNotifs.length > 0 && (
          <div>
            <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 700 }}>
              Earlier
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {earlierNotifs.map((n) => (
                <div
                  key={n.id}
                  className="glass-card"
                  style={{
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1.25rem',
                    opacity: 0.9,
                    borderLeft: !n.read ? '4px solid var(--primary)' : '1px solid var(--border)'
                  }}
                >
                  <div style={{ marginTop: '3px' }}>
                    {getIcon(n.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {n.title || 'System Alert'}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {n.time || 'A while ago'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                      {n.message}
                    </p>
                    {n.queryId && (
                      <button
                        onClick={() => navigate('/queries')}
                        style={{
                          marginTop: '0.75rem',
                          background: 'none',
                          border: 'none',
                          color: 'var(--primary)',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        <span>View Ticket</span>
                        <ExternalLink size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {filteredNotifs.length === 0 && (
          <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-glass-heavy)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <CheckCircle2 size={32} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>All Caught Up!</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem', maxWidth: '400px', margin: '0.5rem auto 0' }}>
              You don't have any unread notifications right now. Any updates to your queries or campus announcements will show up here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
