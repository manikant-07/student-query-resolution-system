import React, { useState } from 'react';
import { Module1Search } from '../components/ai-lab/Module1Search';
import { Module2Adversarial } from '../components/ai-lab/Module2Adversarial';
import { Module3Knowledge } from '../components/ai-lab/Module3Knowledge';
import { Module4Statistical } from '../components/ai-lab/Module4Statistical';
import { 
  Cpu, 
  Search, 
  Gamepad2, 
  Brain, 
  BarChart3, 
  Sparkles, 
  Info,
  CheckCircle2
} from 'lucide-react';

export function AILabPage() {
  const [activeModule, setActiveModule] = useState(1);

  return (
    <div className="page-wrapper">
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 50%, #f5f3ff 100%)',
          border: '1px solid #bfdbfe',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  background: 'var(--primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(23, 63, 53, 0.2)'
                }}
              >
                <Cpu size={22} />
              </div>
              <h2 style={{ fontSize: '1.65rem', color: '#0f172a' }}>
                AI Algorithm Lab (Modules 1–4)
              </h2>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '720px', lineHeight: 1.5 }}>
              Executable algorithmic demonstrations for the full Artificial Intelligence syllabus. Test inputs, inspect step-by-step traces, and understand real-world application to the Student Query Portal.
            </p>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}
          >
            <CheckCircle2 size={18} color="#16a34a" />
            <div style={{ fontSize: '0.8rem', color: '#1e293b' }}>
              <strong>Pure Client-Side Math</strong>
              <div style={{ color: '#64748b', fontSize: '0.72rem' }}>No mocked API calls</div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Module Selector Tabs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        {/* Module 1 Tab */}
        <button
          onClick={() => setActiveModule(1)}
          style={{
            padding: '1.25rem',
            borderRadius: '14px',
            border: activeModule === 1 ? '2px solid #2563eb' : '1px solid #e2e8f0',
            background: activeModule === 1 ? 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%)' : '#ffffff',
            boxShadow: activeModule === 1 ? 'var(--shadow-md)' : 'var(--shadow-xs)',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 200ms'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <Search size={18} color="#2563eb" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>
              Module 1
            </span>
          </div>
          <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '0.25rem' }}>Problem Solving Search</h4>
          <p style={{ fontSize: '0.775rem', color: '#64748b' }}>BFS, DFS, IDS, Bidirectional, A*, AO*, and CSP</p>
        </button>

        {/* Module 2 Tab */}
        <button
          onClick={() => setActiveModule(2)}
          style={{
            padding: '1.25rem',
            borderRadius: '14px',
            border: activeModule === 2 ? '2px solid #7c3aed' : '1px solid #e2e8f0',
            background: activeModule === 2 ? 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)' : '#ffffff',
            boxShadow: activeModule === 2 ? 'var(--shadow-md)' : 'var(--shadow-xs)',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 200ms'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <Gamepad2 size={18} color="#7c3aed" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase' }}>
              Module 2
            </span>
          </div>
          <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '0.25rem' }}>Adversarial & Classic AI</h4>
          <p style={{ fontSize: '0.775rem', color: '#64748b' }}>Minimax, Alpha-Beta, Water Jug, N-Queens, TSP, 8-Puzzle</p>
        </button>

        {/* Module 3 Tab */}
        <button
          onClick={() => setActiveModule(3)}
          style={{
            padding: '1.25rem',
            borderRadius: '14px',
            border: activeModule === 3 ? '2px solid #059669' : '1px solid #e2e8f0',
            background: activeModule === 3 ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' : '#ffffff',
            boxShadow: activeModule === 3 ? 'var(--shadow-md)' : 'var(--shadow-xs)',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 200ms'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <Brain size={18} color="#059669" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
              Module 3
            </span>
          </div>
          <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '0.25rem' }}>Knowledge & Reasoning</h4>
          <p style={{ fontSize: '0.775rem', color: '#64748b' }}>Logic, FOL, Semantic Networks, Frames, Expert Systems</p>
        </button>

        {/* Module 4 Tab */}
        <button
          onClick={() => setActiveModule(4)}
          style={{
            padding: '1.25rem',
            borderRadius: '14px',
            border: activeModule === 4 ? '2px solid #d97706' : '1px solid #e2e8f0',
            background: activeModule === 4 ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' : '#ffffff',
            boxShadow: activeModule === 4 ? 'var(--shadow-md)' : 'var(--shadow-xs)',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 200ms'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <BarChart3 size={18} color="#d97706" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase' }}>
              Module 4
            </span>
          </div>
          <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '0.25rem' }}>Statistical Reasoning</h4>
          <p style={{ fontSize: '0.775rem', color: '#64748b' }}>Probability, Bayes, Certainty Factors, Dempster-Shafer, Fuzzy</p>
        </button>
      </div>

      {/* Render Selected Module Lab */}
      <div>
        {activeModule === 1 && <Module1Search />}
        {activeModule === 2 && <Module2Adversarial />}
        {activeModule === 3 && <Module3Knowledge />}
        {activeModule === 4 && <Module4Statistical />}
      </div>
    </div>
  );
}
