import React, { useState, useMemo } from 'react';
import { vivaQuestions } from '../data/vivaQuestions';
import { 
  BookOpen, 
  CheckSquare, 
  Square, 
  HelpCircle, 
  Search, 
  Layers, 
  Cpu, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export function ArchitectureVivaPage() {
  const [activeTab, setActiveTab] = useState('viva'); // 'architecture', 'checklist', 'viva'
  const [selectedModuleFilter, setSelectedModuleFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedVivaId, setExpandedVivaId] = useState('VIVA-01');

  // Interactive Checklist State (persisted in session)
  const [checklist, setChecklist] = useState({
    // Module 1
    m1_search: true,
    m1_bfs: true,
    m1_dfs: true,
    m1_ids: true,
    m1_bidirectional: true,
    m1_heuristic: true,
    m1_greedy: true,
    m1_astar: true,
    m1_aostar: true,
    m1_csp: true,
    // Module 2
    m2_minimax: true,
    m2_alphabeta: true,
    m2_waterjug: true,
    m2_nqueens: true,
    m2_tsp: true,
    m2_missionaries: true,
    m2_tiles: true,
    // Module 3
    m3_kb: true,
    m3_prop_logic: true,
    m3_fol: true,
    m3_semantic_net: true,
    m3_frames: true,
    m3_expert_system: true,
    m3_architecture: true,
    // Module 4
    m4_probability: true,
    m4_bayes: true,
    m4_cf: true,
    m4_rules_vs_stats: true,
    m4_bayesian_net: true,
    m4_dempster: true,
    m4_fuzzy: true
  });

  const toggleCheck = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalChecks = Object.keys(checklist).length;
  const completedChecks = Object.values(checklist).filter(Boolean).length;
  const completionPercentage = Math.round((completedChecks / totalChecks) * 100);

  const filteredViva = useMemo(() => {
    return vivaQuestions.filter(item => {
      const matchMod = selectedModuleFilter === 'All' || item.module.toLowerCase().includes(selectedModuleFilter.toLowerCase());
      const term = searchQuery.toLowerCase();
      const matchSearch = !searchQuery ||
        item.question.toLowerCase().includes(term) ||
        item.answer.toLowerCase().includes(term) ||
        (item.keyPoints && item.keyPoints.some(k => k.toLowerCase().includes(term)));
      return matchMod && matchSearch;
    });
  }, [selectedModuleFilter, searchQuery]);

  return (
    <div className="page-wrapper">
      {/* Page Header */}
      <div
        style={{
          background: 'var(--primary)',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '2.5rem 2rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
          <BookOpen size={24} />
          <h2 style={{ fontSize: '1.75rem', color: '#ffffff' }}>
            Project Architecture & Viva Voce Guide
          </h2>
        </div>
        <p style={{ fontSize: '0.95rem', color: '#e0e7ff', maxWidth: '780px', lineHeight: 1.6 }}>
          Comprehensive documentation for project defense: system architecture diagrams, data flow lifecycles, full syllabus checklist, implementation disclosures, and curated viva voce questions with model answers.
        </p>

        {/* Completion Bar */}
        <div style={{ marginTop: '1.5rem', background: 'rgba(255, 255, 255, 0.15)', borderRadius: '12px', padding: '0.85rem 1.25rem', backdropFilter: 'blur(8px)', maxWidth: '520px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '6px' }}>
            <span>Syllabus Verification Progress</span>
            <strong>{completedChecks} / {totalChecks} Topics Covered ({completionPercentage}%)</strong>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.25)', height: '8px', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ background: '#4ade80', height: '100%', width: `${completionPercentage}%`, transition: 'width 300ms' }}></div>
          </div>
        </div>
      </div>

      {/* Primary Sub Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`btn btn-sm ${activeTab === 'architecture' ? 'btn-primary' : 'btn-secondary'}`}
        >
          System Architecture & Data Flow
        </button>
        <button
          onClick={() => setActiveTab('checklist')}
          className={`btn btn-sm ${activeTab === 'checklist' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Interactive Syllabus Checklist ({completedChecks}/{totalChecks})
        </button>
        <button
          onClick={() => setActiveTab('viva')}
          className={`btn btn-sm ${activeTab === 'viva' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Viva Voce Defense Questions & Answers
        </button>
        <button
          onClick={() => setActiveTab('transparency')}
          className={`btn btn-sm ${activeTab === 'transparency' ? 'btn-primary' : 'btn-secondary'}`}
        >
          AI Implementation vs Simulation Matrix
        </button>
      </div>

      {/* =========================================================================
          TAB 1: ARCHITECTURE & DATA FLOW
          ========================================================================= */}
      {activeTab === 'architecture' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Problem Statement Card */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '0.75rem' }}>
              1. Problem Statement & Objectives
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, marginBottom: '1rem' }}>
              College students frequently experience communication delays regarding academic regulations, attendance shortages, exam hall ticket clearance, and fee installment approvals. Traditional manual grievance ticketing lacks immediate intelligent diagnosis, resulting in redundant inquiries and faculty overload.
            </p>
            <div className="grid-3" style={{ gap: '1rem' }}>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#2563eb', fontSize: '0.85rem' }}>Objective 1: Immediate AI Suggestions</strong>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                  Evaluate input premises in real time against institutional ordinances using Bayesian probability and production rules.
                </p>
              </div>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#7c3aed', fontSize: '0.85rem' }}>Objective 2: CSP Automated Assignment</strong>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                  Assign unresolved tickets to eligible faculty members using Constraint Satisfaction Backtracking with Forward Checking.
                </p>
              </div>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#059669', fontSize: '0.85rem' }}>Objective 3: Syllabus Demonstration</strong>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                  Provide executable demonstrations of all 4 AI modules for academic viva evaluation.
                </p>
              </div>
            </div>
          </div>

          {/* Architecture Diagram Box */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '0.75rem' }}>
              2. System Architecture & Component Interaction
            </h3>

            <div
              style={{
                background: '#0f172a',
                color: '#f8fafc',
                padding: '1.75rem',
                borderRadius: '16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.825rem',
                lineHeight: 1.7,
                overflowX: 'auto'
              }}
            >
              <div style={{ color: '#38bdf8' }}>┌────────────────────────────────────────────────────────────────────────┐</div>
              <div style={{ color: '#38bdf8' }}>│                      STUDENT CLIENT / FACULTY PORTAL                   │</div>
              <div style={{ color: '#38bdf8' }}>│          (React.js + Vite UI • LocalStorage Persistent DB)             │</div>
              <div style={{ color: '#38bdf8' }}>└───────────────────────────────────┬────────────────────────────────────┘</div>
              <div style={{ paddingLeft: '350px', color: '#94a3b8' }}>│ HTTP / Event Dispatch</div>
              <div style={{ paddingLeft: '350px', color: '#a7f3d0' }}>▼</div>
              <div style={{ color: '#a7f3d0' }}>┌────────────────────────────────────────────────────────────────────────┐</div>
              <div style={{ color: '#a7f3d0' }}>│                 AI DIAGNOSTICS & RELEVANCE PIPELINE                   │</div>
              <div style={{ color: '#a7f3d0' }}>│  ┌───────────────────────┐ ┌──────────────────────┐ ┌───────────────┐  │</div>
              <div style={{ color: '#a7f3d0' }}>│  │ Tokenizer & Stopwords │ │ Bayes Classifer P(C) │ │ Heuristic h(n)│  │</div>
              <div style={{ color: '#a7f3d0' }}>│  └───────────────────────┘ └──────────────────────┘ └───────────────┘  │</div>
              <div style={{ color: '#a7f3d0' }}>└───────────────────────────────────┬────────────────────────────────────┘</div>
              <div style={{ paddingLeft: '350px', color: '#94a3b8' }}>│ Working Memory Premises</div>
              <div style={{ paddingLeft: '350px', color: '#fde047' }}>▼</div>
              <div style={{ color: '#fde047' }}>┌────────────────────────────────────────────────────────────────────────┐</div>
              <div style={{ color: '#fde047' }}>│               EXPERT SYSTEM & INFERENCE REASONING ENGINE               │</div>
              <div style={{ color: '#fde047' }}>│  ┌────────────────────────┐ ┌──────────────────────┐ ┌───────────────┐ │</div>
              <div style={{ color: '#fde047' }}>│  │ Academic Knowledge Base│ │ Forward Chaining Rules││Certainty Factor││</div>
              <div style={{ color: '#fde047' }}>│  │ (Clause 7.2, 7.5, AC-4)│ │ (IF premises THEN)   ││ CF = MB - MD  ││</div>
              <div style={{ color: '#fde047' }}>│  └────────────────────────┘ └──────────────────────┘ └───────────────┘ │</div>
              <div style={{ color: '#fde047' }}>└───────────────────────────────────┬────────────────────────────────────┘</div>
              <div style={{ paddingLeft: '350px', color: '#94a3b8' }}>│ If Unresolved / Escalation</div>
              <div style={{ paddingLeft: '350px', color: '#f43f5e' }}>▼</div>
              <div style={{ color: '#f43f5e' }}>┌────────────────────────────────────────────────────────────────────────┐</div>
              <div style={{ color: '#f43f5e' }}>│           CONSTRAINT SATISFACTION PROBLEM (CSP) ASSIGNER               │</div>
              <div style={{ color: '#f43f5e' }}>│  Variables: Queries  •  Domains: Faculty  •  Constraints: Workload/Dept│</div>
              <div style={{ color: '#f43f5e' }}>└───────────────────────────────────┬────────────────────────────────────┘</div>
              <div style={{ paddingLeft: '350px', color: '#94a3b8' }}>│ Official Faculty Resolution</div>
              <div style={{ paddingLeft: '350px', color: '#4ade80' }}>▼</div>
              <div style={{ color: '#4ade80' }}>┌────────────────────────────────────────────────────────────────────────┐</div>
              <div style={{ color: '#4ade80' }}>│                 RESOLUTION, FEEDBACK & KNOWLEDGE ACQUISITION           │</div>
              <div style={{ color: '#4ade80' }}>│  Student Notification • Helpful/Not-Helpful Feedback • Closed Ticket   │</div>
              <div style={{ color: '#4ade80' }}>└────────────────────────────────────────────────────────────────────────┘</div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: SYLLABUS CHECKLIST
          ========================================================================= */}
      {activeTab === 'checklist' && (
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a' }}>
                Artificial Intelligence Syllabus Verification Checklist
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Every required topic from Modules 1 through 4 is implemented with an interactive demonstration in the AI Lab. Click checkboxes to verify.
              </p>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '4px 12px', borderRadius: '999px' }}>
              {completedChecks} of {totalChecks} Verified
            </span>
          </div>

          <div className="grid-2" style={{ gap: '1.5rem' }}>
            {/* Module 1 Checklist */}
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#2563eb', fontWeight: 700, fontSize: '0.95rem' }}>
                <Cpu size={18} />
                <span>Module 1: Problem Solving Methodologies</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem' }}>
                {[
                  ['m1_search', '1. Solving Problems by Searching (State Space)'],
                  ['m1_bfs', '2. Breadth-First Search (BFS) Tree Exploration'],
                  ['m1_dfs', '3. Depth-First Search (DFS) Traversal'],
                  ['m1_ids', '4. Iterative Deepening Search (IDS) DLS'],
                  ['m1_bidirectional', '5. Bidirectional Search (Frontier Meeting)'],
                  ['m1_heuristic', '6. Heuristic Relevance Function h(n)'],
                  ['m1_greedy', '7. Greedy Best-First Search f(n) = h(n)'],
                  ['m1_astar', '8. A* Search Algorithm f(n) = g(n) + h(n)'],
                  ['m1_aostar', '9. AO* Search (AND-OR Graph Decomposition)'],
                  ['m1_csp', '10. Constraint Satisfaction Problem (CSP) Solver']
                ].map(([key, label]) => (
                  <div
                    key={key}
                    onClick={() => toggleCheck(key)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', userSelect: 'none' }}
                  >
                    {checklist[key] ? <CheckSquare size={16} color="#16a34a" /> : <Square size={16} color="#94a3b8" />}
                    <span style={{ color: checklist[key] ? '#0f172a' : '#64748b', textDecoration: checklist[key] ? 'none' : 'line-through' }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Module 2 Checklist */}
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#7c3aed', fontWeight: 700, fontSize: '0.95rem' }}>
                <Cpu size={18} />
                <span>Module 2: Adversarial Search & Classic AI</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem' }}>
                {[
                  ['m2_minimax', '1. Minimax Decision-Making Algorithm'],
                  ['m2_alphabeta', '2. Alpha-Beta Pruning (α & β Bounds)'],
                  ['m2_waterjug', '3. Water-Jug Problem (BFS Operations)'],
                  ['m2_nqueens', '4. N-Queens Problem (Row/Diagonal Constraints)'],
                  ['m2_tsp', '5. Travelling Salesperson Problem (Campus Tour)'],
                  ['m2_missionaries', '6. Missionaries & Cannibals River Crossing'],
                  ['m2_tiles', '7. 8-Tiles Sliding Puzzle (Manhattan Heuristic)']
                ].map(([key, label]) => (
                  <div
                    key={key}
                    onClick={() => toggleCheck(key)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', userSelect: 'none' }}
                  >
                    {checklist[key] ? <CheckSquare size={16} color="#16a34a" /> : <Square size={16} color="#94a3b8" />}
                    <span style={{ color: checklist[key] ? '#0f172a' : '#64748b' }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Module 3 Checklist */}
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#059669', fontWeight: 700, fontSize: '0.95rem' }}>
                <Cpu size={18} />
                <span>Module 3: Knowledge Representation & Reasoning</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem' }}>
                {[
                  ['m3_kb', '1. College Knowledge Base & Rules'],
                  ['m3_prop_logic', '2. Propositional Logic & Truth Table Generator'],
                  ['m3_fol', '3. First-Order Logic (FOL) Predicates & Quantifiers'],
                  ['m3_semantic_net', '4. Semantic Networks (Entity-Relation Graph)'],
                  ['m3_frames', '5. Structured Minsky Frames (Slots & Facets)'],
                  ['m3_expert_system', '6. Rule-Based Academic Expert System Prototype'],
                  ['m3_architecture', '7. Architecture of an Expert System (6 Components)']
                ].map(([key, label]) => (
                  <div
                    key={key}
                    onClick={() => toggleCheck(key)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', userSelect: 'none' }}
                  >
                    {checklist[key] ? <CheckSquare size={16} color="#16a34a" /> : <Square size={16} color="#94a3b8" />}
                    <span style={{ color: checklist[key] ? '#0f172a' : '#64748b' }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Module 4 Checklist */}
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#d97706', fontWeight: 700, fontSize: '0.95rem' }}>
                <Cpu size={18} />
                <span>Module 4: Statistical Reasoning & Uncertainty</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem' }}>
                {[
                  ['m4_probability', '1. Probability & Prior Ticket Frequencies'],
                  ['m4_bayes', '2. Bayes Theorem Posterior Updater P(C|E)'],
                  ['m4_cf', '3. Certainty Factors (CF = MB - MD)'],
                  ['m4_rules_vs_stats', '4. Rule-Based Systems vs Statistical Inference'],
                  ['m4_bayesian_net', '5. Bayesian Network (DAG Dependency Graph)'],
                  ['m4_dempster', '6. Dempster-Shafer Theory [Bel(A), Pl(A)]'],
                  ['m4_fuzzy', '7. Fuzzy Logic Priority & Centroid Defuzzification']
                ].map(([key, label]) => (
                  <div
                    key={key}
                    onClick={() => toggleCheck(key)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', userSelect: 'none' }}
                  >
                    {checklist[key] ? <CheckSquare size={16} color="#16a34a" /> : <Square size={16} color="#94a3b8" />}
                    <span style={{ color: checklist[key] ? '#0f172a' : '#64748b' }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: VIVA VOCE QUESTIONS & MODEL ANSWERS
          ========================================================================= */}
      {activeTab === 'viva' && (
        <div>
          {/* Controls */}
          <div
            className="glass-card"
            style={{
              padding: '1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
                placeholder="Search viva questions by topic, algorithm, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.45rem', overflowX: 'auto' }}>
              {['All', 'Module 1', 'Module 2', 'Module 3', 'Module 4', 'Project Defense'].map(mod => (
                <button
                  key={mod}
                  onClick={() => setSelectedModuleFilter(mod)}
                  className={`btn btn-sm ${selectedModuleFilter === mod ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {mod}
                </button>
              ))}
            </div>
          </div>

          {/* Q&A Accordion */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredViva.map(viva => {
              const isExpanded = expandedVivaId === viva.id;
              return (
                <div
                  key={viva.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-xs)'
                  }}
                >
                  <div
                    onClick={() => setExpandedVivaId(isExpanded ? null : viva.id)}
                    style={{
                      padding: '1.15rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      gap: '1rem',
                      background: isExpanded ? '#f8fafc' : '#ffffff'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span
                        style={{
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          background: '#eff6ff',
                          color: '#2563eb',
                          padding: '2px 8px',
                          borderRadius: '6px'
                        }}
                      >
                        {viva.id}
                      </span>
                      <span style={{ fontSize: '0.975rem', fontWeight: 700, color: '#0f172a' }}>
                        {viva.question}
                      </span>
                    </div>
                    <div style={{ color: '#94a3b8' }}>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', borderTop: '1px solid #edf2f7', paddingTop: '1rem' }}>
                      <p style={{ fontSize: '0.9rem', color: '#1e293b', lineHeight: 1.6, marginBottom: '0.85rem' }}>
                        <strong>Answer:</strong> {viva.answer}
                      </p>

                      {/* Key Points */}
                      {viva.keyPoints && (
                        <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
                          <strong style={{ fontSize: '0.8rem', color: '#334155', display: 'block', marginBottom: '4px' }}>
                            Key Takeaways for Viva:
                          </strong>
                          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.825rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {viva.keyPoints.map((kp, idx) => <li key={idx}>{kp}</li>)}
                          </ul>
                        </div>
                      )}

                      {/* Project Context */}
                      <div style={{ background: '#eff6ff', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #bfdbfe', fontSize: '0.825rem', color: '#1e40af' }}>
                        <strong>How this applies in our Project:</strong> {viva.projectContext}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: TRANSPARENCY MATRIX
          ========================================================================= */}
      {activeTab === 'transparency' && (
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '0.5rem' }}>
            Academic AI Disclosure Matrix
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
            Complete transparency distinguishing genuinely implemented algorithms from illustrative simulations, in full compliance with college evaluation ethics.
          </p>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Topic / Technique</th>
                  <th>Module</th>
                  <th>Implementation Status</th>
                  <th>Actual Mechanism</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>BFS, DFS, IDS, Bidirectional</strong></td>
                  <td>Module 1</td>
                  <td><span className="badge badge-implemented">Implemented</span></td>
                  <td>Executed in pure JavaScript queue/stack traversals over category graphs.</td>
                </tr>
                <tr>
                  <td><strong>A* Search (g + h) & Heuristics</strong></td>
                  <td>Module 1</td>
                  <td><span className="badge badge-implemented">Implemented</span></td>
                  <td>Real path cost g(n) + admissible heuristic h(n) priority queue evaluation.</td>
                </tr>
                <tr>
                  <td><strong>CSP Query Assigner</strong></td>
                  <td>Module 1</td>
                  <td><span className="badge badge-implemented">Implemented</span></td>
                  <td>Backtracking search with Forward Checking matching queries to faculty.</td>
                </tr>
                <tr>
                  <td><strong>Water-Jug BFS Solver</strong></td>
                  <td>Module 2</td>
                  <td><span className="badge badge-implemented">Implemented</span></td>
                  <td>BFS on transition states (Fill, Empty, Pour) with animated liquid visualizer.</td>
                </tr>
                <tr>
                  <td><strong>N-Queens Backtracking</strong></td>
                  <td>Module 2</td>
                  <td><span className="badge badge-implemented">Implemented</span></td>
                  <td>Row/column/diagonal conflict verification on 4x4, 5x5, 8x8 boards.</td>
                </tr>
                <tr>
                  <td><strong>8-Tiles Puzzle A*</strong></td>
                  <td>Module 2</td>
                  <td><span className="badge badge-implemented">Implemented</span></td>
                  <td>Interactive 3x3 board computing live Manhattan Distance and misplaced tiles.</td>
                </tr>
                <tr>
                  <td><strong>Propositional Truth Tables</strong></td>
                  <td>Module 3</td>
                  <td><span className="badge badge-implemented">Implemented</span></td>
                  <td>Boolean truth evaluator for AND, OR, NOT, IMPLIES, BICONDITIONAL.</td>
                </tr>
                <tr>
                  <td><strong>First-Order Logic (FOL)</strong></td>
                  <td>Module 3</td>
                  <td><span className="badge badge-implemented">Implemented</span></td>
                  <td>Relational predicate database with universal/existential rule checking.</td>
                </tr>
                <tr>
                  <td><strong>Expert System Forward Chaining</strong></td>
                  <td>Module 3</td>
                  <td><span className="badge badge-implemented">Implemented</span></td>
                  <td>Rule base matching student premises to generate official policy guidance.</td>
                </tr>
                <tr>
                  <td><strong>Bayes Theorem Posterior</strong></td>
                  <td>Module 4</td>
                  <td><span className="badge badge-implemented">Implemented</span></td>
                  <td>Calculates P(C|Keywords) using Laplace-smoothed likelihoods and priors.</td>
                </tr>
                <tr>
                  <td><strong>Certainty Factors (MYCIN)</strong></td>
                  <td>Module 4</td>
                  <td><span className="badge badge-implemented">Implemented</span></td>
                  <td>Computes CF = MB - MD and displays confidence meters on every ticket.</td>
                </tr>
                <tr>
                  <td><strong>Fuzzy Logic Priority Defuzzification</strong></td>
                  <td>Module 4</td>
                  <td><span className="badge badge-implemented">Implemented</span></td>
                  <td>Triangular/Trapezoidal membership curves with Centroid defuzzification.</td>
                </tr>
                <tr>
                  <td><strong>Large Language Models (LLM)</strong></td>
                  <td>General</td>
                  <td><span className="badge badge-concept">Not Claimed</span></td>
                  <td>Transparently disclosed: System uses deterministic rules & classical AI, not LLM hallucinations.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
