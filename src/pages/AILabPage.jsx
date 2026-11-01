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
          background: 'linear-gradient(135deg, #DCEEFF 0%, #F1F7FD 100%)',
          border: '1px solid #DFE8F2',
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
                  background: '#2878E5',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(40, 120, 229, 0.25)'
                }}
              >
                <Cpu size={22} />
              </div>
              <h2 style={{ fontSize: '1.65rem', color: '#142B4D', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                AI Algorithm Lab (Modules 1–4)
              </h2>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#52677F', maxWidth: '720px', lineHeight: 1.5 }}>
              Executable algorithmic demonstrations for the full Artificial Intelligence syllabus. Test inputs, inspect step-by-step traces, and understand real-world application to the Student Query Portal.
            </p>
          </div>

          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #DFE8F2',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}
          >
            <CheckCircle2 size={18} color="#16865B" />
            <div style={{ fontSize: '0.8rem', color: '#142B4D' }}>
              <strong>Pure Client-Side Math</strong>
              <div style={{ color: '#52677F', fontSize: '0.72rem' }}>No mocked API calls</div>
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
            border: activeModule === 1 ? '2px solid #2878E5' : '1px solid #DFE8F2',
            background: activeModule === 1 ? '#EBF3FD' : '#FFFFFF',
            boxShadow: activeModule === 1 ? 'var(--shadow-md)' : 'var(--shadow-xs)',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 200ms'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <Search size={18} color="#2878E5" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2878E5', textTransform: 'uppercase' }}>
              Module 1
            </span>
          </div>
          <h4 style={{ fontSize: '1rem', color: '#142B4D', marginBottom: '0.25rem' }}>Problem Solving Search</h4>
          <p style={{ fontSize: '0.775rem', color: '#52677F' }}>BFS, DFS, IDS, Bidirectional, A*, AO*, and CSP</p>
        </button>

        {/* Module 2 Tab */}
        <button
          onClick={() => setActiveModule(2)}
          style={{
            padding: '1.25rem',
            borderRadius: '14px',
            border: activeModule === 2 ? '2px solid #2878E5' : '1px solid #DFE8F2',
            background: activeModule === 2 ? '#EBF3FD' : '#FFFFFF',
            boxShadow: activeModule === 2 ? 'var(--shadow-md)' : 'var(--shadow-xs)',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 200ms'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <Gamepad2 size={18} color="#2878E5" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2878E5', textTransform: 'uppercase' }}>
              Module 2
            </span>
          </div>
          <h4 style={{ fontSize: '1rem', color: '#142B4D', marginBottom: '0.25rem' }}>Adversarial & Classic AI</h4>
          <p style={{ fontSize: '0.775rem', color: '#52677F' }}>Minimax, Alpha-Beta, Water Jug, N-Queens, TSP, 8-Puzzle</p>
        </button>

        {/* Module 3 Tab */}
        <button
          onClick={() => setActiveModule(3)}
          style={{
            padding: '1.25rem',
            borderRadius: '14px',
            border: activeModule === 3 ? '2px solid #2878E5' : '1px solid #DFE8F2',
            background: activeModule === 3 ? '#EBF3FD' : '#FFFFFF',
            boxShadow: activeModule === 3 ? 'var(--shadow-md)' : 'var(--shadow-xs)',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 200ms'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <Brain size={18} color="#2878E5" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2878E5', textTransform: 'uppercase' }}>
              Module 3
            </span>
          </div>
          <h4 style={{ fontSize: '1rem', color: '#142B4D', marginBottom: '0.25rem' }}>Knowledge & Reasoning</h4>
          <p style={{ fontSize: '0.775rem', color: '#52677F' }}>Logic, FOL, Semantic Networks, Frames, Expert Systems</p>
        </button>

        {/* Module 4 Tab */}
        <button
          onClick={() => setActiveModule(4)}
          style={{
            padding: '1.25rem',
            borderRadius: '14px',
            border: activeModule === 4 ? '2px solid #2878E5' : '1px solid #DFE8F2',
            background: activeModule === 4 ? '#EBF3FD' : '#FFFFFF',
            boxShadow: activeModule === 4 ? 'var(--shadow-md)' : 'var(--shadow-xs)',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 200ms'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <BarChart3 size={18} color="#2878E5" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2878E5', textTransform: 'uppercase' }}>
              Module 4
            </span>
          </div>
          <h4 style={{ fontSize: '1rem', color: '#142B4D', marginBottom: '0.25rem' }}>Statistical Reasoning</h4>
          <p style={{ fontSize: '0.775rem', color: '#52677F' }}>Bayes Rule, MYCIN CF, Belief Networks, Dempster-Shafer</p>
        </button>
      </div>

      {/* Active Module Demo Area */}
      <div style={{ minHeight: '600px' }}>
        {activeModule === 1 && <Module1Search />}
        {activeModule === 2 && <Module2Adversarial />}
        {activeModule === 3 && <Module3Knowledge />}
        {activeModule === 4 && <Module4Statistical />}
      </div>
    </div>
  );
}
