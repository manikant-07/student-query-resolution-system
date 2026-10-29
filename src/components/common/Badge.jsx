import React from 'react';

export function StatusBadge({ status }) {
  const s = (status || 'Pending').toLowerCase();
  let badgeClass = 'badge-pending';
  if (s === 'answered') badgeClass = 'badge-answered';
  if (s === 'resolved') badgeClass = 'badge-resolved';

  return (
    <span className={`badge ${badgeClass}`}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor' }}></span>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const p = (priority || 'Medium').toLowerCase();
  let badgeClass = 'badge-medium';
  if (p === 'urgent') badgeClass = 'badge-urgent';
  if (p === 'high') badgeClass = 'badge-high';
  if (p === 'low') badgeClass = 'badge-low';

  return (
    <span className={`badge ${badgeClass}`}>
      {priority}
    </span>
  );
}

export function AlgorithmBadge({ type }) {
  const t = (type || 'Implemented').toLowerCase();
  let badgeClass = 'badge-implemented';
  let label = 'Implemented';

  if (t === 'simulation') {
    badgeClass = 'badge-simulation';
    label = 'Simulation';
  } else if (t === 'concept' || t === 'concept demonstration') {
    badgeClass = 'badge-concept';
    label = 'Concept Demo';
  }

  return (
    <span className={`badge ${badgeClass}`} title={`Status: ${label}`}>
      {label}
    </span>
  );
}
