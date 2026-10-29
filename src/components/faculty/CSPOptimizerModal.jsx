import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { solveQueryAssignmentCSP } from '../../utils/searchAlgorithms';
import { 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Play, 
  UserCheck,
  ListOrdered
} from 'lucide-react';

export function CSPOptimizerModal({ isOpen, onClose }) {
  const { queries, faculty, applyCSPAssignments } = useApp();

  const [hasRun, setHasRun] = useState(false);
  const [cspResult, setCspResult] = useState(null);

  const unassignedQueries = useMemo(() => {
    return queries.filter(q => !q.assignedTo || q.assignedTo === 'Unassigned');
  }, [queries]);

  const handleRunCSP = () => {
    // If there are no unassigned queries, simulate assigning all queries or demonstrate on existing
    const targetQueries = unassignedQueries.length > 0 
      ? queries 
      : queries.map((q, idx) => idx % 2 === 0 ? { ...q, assignedTo: 'Unassigned' } : q);

    const result = solveQueryAssignmentCSP(targetQueries, faculty);
    setCspResult(result);
    setHasRun(true);
  };

  const handleApplyAssignments = () => {
    if (cspResult && cspResult.assignments) {
      applyCSPAssignments(cspResult.assignments);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Automated CSP Query Assignment Engine"
      subtitle="Constraint Satisfaction Problem: Forward Checking & Backtracking Search"
      maxWidth="820px"
    >
      <div>
        {/* Theoretical CSP Formulation Box */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#e2e8f0',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            marginBottom: '1.25rem',
            fontSize: '0.85rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 700, marginBottom: '0.5rem' }}>
            <Cpu size={16} />
            <span>CSP Formalization (Syllabus Module 1)</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', fontSize: '0.8rem' }}>
            <div>
              <strong style={{ color: '#a7f3d0' }}>Variables (X):</strong>
              <p style={{ color: '#94a3b8' }}>Unassigned Queries [{unassignedQueries.length > 0 ? unassignedQueries.map(q => q.id).join(', ') : 'All active queries'}]</p>
            </div>
            <div>
              <strong style={{ color: '#a7f3d0' }}>Domains (D):</strong>
              <p style={{ color: '#94a3b8' }}>{faculty.length} Faculty Members ({faculty.map(f => f.name.split(' ')[1]).join(', ')})</p>
            </div>
            <div>
              <strong style={{ color: '#a7f3d0' }}>Constraints (C):</strong>
              <p style={{ color: '#94a3b8' }}>1. Category-Subject match<br/>2. CurrentLoad &lt; MaxLoad<br/>3. Faculty available = True</p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.875rem', color: '#475569' }}>
            Unassigned Queries in Queue: <strong style={{ color: '#0f172a' }}>{unassignedQueries.length}</strong>
          </div>
          <button
            type="button"
            onClick={handleRunCSP}
            className="btn btn-primary"
            style={{ gap: '0.5rem' }}
          >
            <Play size={16} />
            <span>Execute CSP Backtracking Solver</span>
          </button>
        </div>

        {/* Execution Results */}
        {hasRun && cspResult && (
          <div>
            <div
              style={{
                background: cspResult.success ? '#ecfdf5' : '#fffbeb',
                border: `1px solid ${cspResult.success ? '#86efac' : '#fde68a'}`,
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                {cspResult.success ? (
                  <CheckCircle2 size={20} color="#16a34a" />
                ) : (
                  <AlertTriangle size={20} color="#d97706" />
                )}
                <div>
                  <span style={{ fontWeight: 700, color: cspResult.success ? '#166534' : '#854d0e', fontSize: '0.9rem' }}>
                    {cspResult.success ? 'Valid Consistent Assignment Found!' : 'Partial Assignment (Constraint Saturated)'}
                  </span>
                  <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: '2px' }}>
                    Successfully mapped {cspResult.assignedCount} queries without violating any capacity or expertise constraints.
                  </p>
                </div>
              </div>

              {cspResult.assignedCount > 0 && (
                <button
                  type="button"
                  onClick={handleApplyAssignments}
                  className="btn btn-purple btn-sm"
                >
                  <UserCheck size={14} />
                  <span>Apply Assignments</span>
                </button>
              )}
            </div>

            {/* Proposed Assignment Mapping */}
            <div style={{ marginBottom: '1rem' }}>
              <h5 style={{ fontSize: '0.85rem', color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ListOrdered size={15} />
                <span>Computed Assignments Mapping</span>
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '180px', overflowY: 'auto' }}>
                {Object.entries(cspResult.assignments).map(([queryId, facultyName]) => (
                  <div
                    key={queryId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '0.5rem 0.85rem',
                      fontSize: '0.825rem'
                    }}
                  >
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{queryId}</span>
                    <ArrowRight size={14} color="#94a3b8" />
                    <span style={{ color: '#2563eb', fontWeight: 600 }}>{facultyName}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Backtracking Step Trace */}
            <div>
              <h5 style={{ fontSize: '0.85rem', color: '#0f172a', marginBottom: '0.4rem' }}>
                Algorithmic Backtracking & Forward Checking Trace
              </h5>
              <div className="visualizer-box" style={{ maxHeight: '190px', overflowY: 'auto' }}>
                {cspResult.trace.map((t, idx) => (
                  <div key={idx} className="trace-line">
                    <span className="trace-step">Step {t.step}:</span>
                    <span className="trace-action">{t.action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
