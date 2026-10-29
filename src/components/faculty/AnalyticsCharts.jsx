import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { BarChart3, PieChart as PieIcon, TrendingUp, CheckCircle } from 'lucide-react';

export function AnalyticsCharts() {
  const { queries } = useApp();

  // Category Aggregation
  const categoryData = useMemo(() => {
    const counts = {};
    queries.forEach(q => {
      counts[q.category] = (counts[q.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [queries]);

  // Status Aggregation
  const statusData = useMemo(() => {
    const counts = { Pending: 0, Answered: 0, Resolved: 0 };
    queries.forEach(q => {
      counts[q.status] = (counts[q.status] || 0) + 1;
    });
    return [
      { name: 'Pending', value: counts.Pending, color: '#f59e0b' },
      { name: 'Answered', value: counts.Answered, color: '#2563eb' },
      { name: 'Resolved', value: counts.Resolved, color: '#10b981' }
    ];
  }, [queries]);

  // Priority Aggregation
  const priorityData = useMemo(() => {
    const counts = { Urgent: 0, High: 0, Medium: 0, Low: 0 };
    queries.forEach(q => {
      counts[q.priority] = (counts[q.priority] || 0) + 1;
    });
    return [
      { priority: 'Urgent', count: counts.Urgent, fill: '#ef4444' },
      { priority: 'High', count: counts.High, fill: '#f97316' },
      { priority: 'Medium', count: counts.Medium, fill: '#eab308' },
      { priority: 'Low', count: counts.Low, fill: '#64748b' }
    ];
  }, [queries]);

  const resolutionRate = useMemo(() => {
    if (!queries.length) return 0;
    const resolved = queries.filter(q => q.status === 'Resolved' || q.status === 'Answered').length;
    return Math.round((resolved / queries.length) * 100);
  }, [queries]);

  return (
    <div style={{ marginTop: '2rem' }}>
      {/* Metrics Row */}
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Total Query Volume</span>
            <TrendingUp size={18} color="#2563eb" />
          </div>
          <h3 style={{ fontSize: '1.85rem', color: '#0f172a', marginTop: '0.4rem' }}>{queries.length}</h3>
          <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '2px' }}>Active student tickets logged</p>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Resolution Efficiency</span>
            <CheckCircle size={18} color="#10b981" />
          </div>
          <h3 style={{ fontSize: '1.85rem', color: '#0f172a', marginTop: '0.4rem' }}>{resolutionRate}%</h3>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Answered or closed tickets</p>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>AI Suggestions Fired</span>
            <span style={{ fontSize: '0.75rem', background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>100%</span>
          </div>
          <h3 style={{ fontSize: '1.85rem', color: '#7c3aed', marginTop: '0.4rem' }}>{queries.filter(q => q.suggestedAnswer).length}</h3>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Expert rules & Bayesian matches</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid-2">
        {/* Queries by Category */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '1rem' }}>
            <BarChart3 size={18} color="#2563eb" />
            <h4 style={{ fontSize: '1rem', color: '#0f172a' }}>Queries by Academic Category</h4>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Queries by Status (Pie) */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '1rem' }}>
            <PieIcon size={18} color="#7c3aed" />
            <h4 style={{ fontSize: '1rem', color: '#0f172a' }}>Query Resolution Status</h4>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
