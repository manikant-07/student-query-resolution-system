import React, { useState } from 'react';
import { 
  academicCategoryTree, 
  runBFS, 
  runDFS, 
  runIDS, 
  runBidirectional, 
  runAStar, 
  runGreedyBestFirst, 
  runAOStarDemo,
  solveQueryAssignmentCSP
} from '../../utils/searchAlgorithms';
import { facultyList } from '../../data/facultyList';
import { initialQueries } from '../../data/initialQueries';
import { AlgorithmBadge } from '../common/Badge';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Search, 
  GitBranch, 
  Layers, 
  Cpu, 
  Zap, 
  GitFork
} from 'lucide-react';

export function Module1Search() {
  const [activeTab, setActiveTab] = useState('uninformed');

  // BFS State
  const [bfsTarget, setBfsTarget] = useState('MedCond');
  const [bfsOutput, setBfsOutput] = useState(null);

  // DFS State
  const [dfsTarget, setDfsTarget] = useState('Reval');
  const [dfsOutput, setDfsOutput] = useState(null);

  // IDS State
  const [idsTarget, setIdsTarget] = useState('Installment');
  const [idsDepth, setIdsDepth] = useState(3);
  const [idsOutput, setIdsOutput] = useState(null);

  // Bidirectional State
  const [bidiOutput, setBidiOutput] = useState(null);

  // A* State
  const [astarOutput, setAstarOutput] = useState(null);

  // Greedy State
  const [greedyOutput, setGreedyOutput] = useState(null);

  // AO* State
  const [aoOutput, setAoOutput] = useState(null);

  // CSP State
  const [cspOutput, setCspOutput] = useState(null);

  return (
    <div>
      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('uninformed')}
          className={`btn btn-sm ${activeTab === 'uninformed' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Uninformed Search (BFS, DFS, IDS, Bidirectional)
        </button>
        <button
          onClick={() => setActiveTab('informed')}
          className={`btn btn-sm ${activeTab === 'informed' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Informed Search (Heuristics, Greedy, A*, AO*)
        </button>
        <button
          onClick={() => setActiveTab('csp')}
          className={`btn btn-sm ${activeTab === 'csp' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Constraint Satisfaction Problem (CSP)
        </button>
      </div>

      {/* =========================================================================
          SECTION 1: UNINFORMED SEARCH
          ========================================================================= */}
      {activeTab === 'uninformed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* BFS Card */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Search size={20} color="#2563eb" />
                <h4 style={{ fontSize: '1.15rem', color: '#0f172a' }}>1. Breadth-First Search (BFS)</h4>
              </div>
              <AlgorithmBadge type="Implemented" />
            </div>

            <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.75rem' }}>
              <strong>Concept:</strong> Explores tree level by level using a FIFO queue. Guarantees finding the shallowest goal node.
              <br />
              <strong>Application to Portal:</strong> Traverses academic hierarchy (Root → Directorate → Branch → FAQ) to locate policy answers.
            </p>

            <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#334155' }}>Target Policy Node:</label>
                <select
                  className="form-select"
                  style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.825rem' }}
                  value={bfsTarget}
                  onChange={(e) => setBfsTarget(e.target.value)}
                >
                  <option value="MedCond">Medical Condonation Policy (Attendance Branch)</option>
                  <option value="Reval">Re-evaluation Regulations (Exam Branch)</option>
                  <option value="Installment">Fee Installment Policy (Finance Branch)</option>
                  <option value="DownloadCard">Admit Card Generation (Exam Branch)</option>
                </select>
              </div>

              <button
                onClick={() => setBfsOutput(runBFS(academicCategoryTree, bfsTarget))}
                className="btn btn-primary btn-sm"
              >
                <Play size={14} />
                <span>Run BFS Traversal</span>
              </button>
            </div>

            {bfsOutput && (
              <div style={{ animation: 'fadeIn 200ms ease-out' }}>
                <div style={{ background: '#ecfdf5', border: '1px solid #86efac', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '0.75rem', fontSize: '0.85rem', color: '#166534' }}>
                  <strong>Goal Found:</strong> {bfsOutput.targetNode?.name} • <strong>Path:</strong> {bfsOutput.path.join(' → ')}
                  <br />
                  <strong>Policy Output:</strong> {bfsOutput.targetNode?.answer}
                </div>
                <div className="visualizer-box" style={{ maxHeight: '160px', overflowY: 'auto' }}>
                  {bfsOutput.trace.map((t, idx) => (
                    <div key={idx} className="trace-line">
                      <span className="trace-step">Step {t.step}:</span>
                      <span className="trace-action">{t.action}</span>
                      {t.queueState && <span className="trace-eval">[Queue: {t.queueState}]</span>}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.65rem', fontSize: '0.775rem', color: '#64748b' }}>
                  <span>Time Complexity: <strong>O(b^d)</strong></span>
                  <span>Space Complexity: <strong>O(b^d)</strong></span>
                  <span>Completeness: <strong>Yes (if b is finite)</strong></span>
                  <span>Optimality: <strong>Yes (for uniform step costs)</strong></span>
                </div>
              </div>
            )}
          </div>

          {/* DFS Card */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <GitBranch size={20} color="#7c3aed" />
                <h4 style={{ fontSize: '1.15rem', color: '#0f172a' }}>2. Depth-First Search (DFS)</h4>
              </div>
              <AlgorithmBadge type="Implemented" />
            </div>

            <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.75rem' }}>
              <strong>Concept:</strong> Explores as deep as possible along each branch before backtracking using a LIFO stack.
              <br />
              <strong>Application to Portal:</strong> Deeply inspects subcategories of specialized grievance departments.
            </p>

            <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#334155' }}>Target Policy Node:</label>
                <select
                  className="form-select"
                  style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.825rem' }}
                  value={dfsTarget}
                  onChange={(e) => setDfsTarget(e.target.value)}
                >
                  <option value="Reval">Re-evaluation Regulations (Exam Branch)</option>
                  <option value="MedCond">Medical Condonation Policy (Attendance Branch)</option>
                  <option value="Installment">Fee Installment Policy (Finance Branch)</option>
                </select>
              </div>

              <button
                onClick={() => setDfsOutput(runDFS(academicCategoryTree, dfsTarget))}
                className="btn btn-purple btn-sm"
              >
                <Play size={14} />
                <span>Run DFS Traversal</span>
              </button>
            </div>

            {dfsOutput && (
              <div style={{ animation: 'fadeIn 200ms ease-out' }}>
                <div style={{ background: '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '0.75rem', fontSize: '0.85rem', color: '#5b21b6' }}>
                  <strong>Goal Found:</strong> {dfsOutput.targetNode?.name} • <strong>Path:</strong> {dfsOutput.path.join(' → ')}
                </div>
                <div className="visualizer-box" style={{ maxHeight: '160px', overflowY: 'auto' }}>
                  {dfsOutput.trace.map((t, idx) => (
                    <div key={idx} className="trace-line">
                      <span className="trace-step">Step {t.step}:</span>
                      <span className="trace-action">{t.action}</span>
                      {t.stackState && <span className="trace-eval">[Stack: {t.stackState}]</span>}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.65rem', fontSize: '0.775rem', color: '#64748b' }}>
                  <span>Time Complexity: <strong>O(b^m)</strong></span>
                  <span>Space Complexity: <strong>O(b·m) (Linear space advantage!)</strong></span>
                </div>
              </div>
            )}
          </div>

          {/* IDS Card */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Layers size={20} color="#059669" />
                <h4 style={{ fontSize: '1.15rem', color: '#0f172a' }}>3. Iterative Deepening Search (IDS)</h4>
              </div>
              <AlgorithmBadge type="Implemented" />
            </div>

            <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.75rem' }}>
              <strong>Concept:</strong> Combines BFS optimality with DFS linear space efficiency by progressively executing Depth-Limited Search (DLS) with limit = 0, 1, 2, ...
              <br />
              <strong>Application to Portal:</strong> Progressively expands inquiry scope without exploding memory.
            </p>

            <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>Max Depth Limit: {idsDepth}</span>
                <input
                  type="range"
                  min="1"
                  max="4"
                  value={idsDepth}
                  onChange={(e) => setIdsDepth(Number(e.target.value))}
                />
              </div>

              <button
                onClick={() => setIdsOutput(runIDS(academicCategoryTree, idsTarget, idsDepth))}
                className="btn btn-secondary btn-sm"
              >
                <Play size={14} />
                <span>Run IDS Progression</span>
              </button>
            </div>

            {idsOutput && (
              <div style={{ animation: 'fadeIn 200ms ease-out' }}>
                <div style={{ background: idsOutput.found ? '#ecfdf5' : '#fffbeb', border: `1px solid ${idsOutput.found ? '#86efac' : '#fde68a'}`, borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '0.75rem', fontSize: '0.85rem', color: idsOutput.found ? '#166534' : '#854d0e' }}>
                  {idsOutput.found ? (
                    <>Goal Found at Depth Limit {idsOutput.limitReached}! Path: {idsOutput.path.join(' → ')}</>
                  ) : (
                    <>Target not reachable within depth limit {idsDepth}. Increment depth limit.</>
                  )}
                </div>
                <div className="visualizer-box" style={{ maxHeight: '160px', overflowY: 'auto' }}>
                  {idsOutput.trace.map((t, idx) => (
                    <div key={idx} className="trace-line">
                      <span className="trace-step">Step {t.step}:</span>
                      <span className="trace-action">{t.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bidirectional Search Card */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <GitFork size={20} color="#0284c7" />
                <h4 style={{ fontSize: '1.15rem', color: '#0f172a' }}>4. Bidirectional Search</h4>
              </div>
              <AlgorithmBadge type="Implemented" />
            </div>

            <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.75rem' }}>
              <strong>Concept:</strong> Runs two simultaneous searches: one forward from the initial student query, and one backward from candidate answers, stopping when frontiers intersect.
              <br />
              <strong>Application to Portal:</strong> Halves search depth from O(b^d) to O(2·b^(d/2)), drastically speeding up FAQ lookup.
            </p>

            <button
              onClick={() => setBidiOutput(runBidirectional(academicCategoryTree, 'MedCond'))}
              className="btn btn-primary btn-sm"
              style={{ marginBottom: '1rem' }}
            >
              <Play size={14} />
              <span>Run Bidirectional Search Demo</span>
            </button>

            {bidiOutput && (
              <div style={{ animation: 'fadeIn 200ms ease-out' }}>
                <div style={{ background: '#f0f9ff', border: '1px solid #7dd3fc', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '0.75rem', fontSize: '0.85rem', color: '#0369a1' }}>
                  Frontiers Intersected at Node: <strong>"{bidiOutput.intersectionNode}"</strong> in {bidiOutput.steps} total steps!
                </div>
                <div className="visualizer-box" style={{ maxHeight: '160px', overflowY: 'auto' }}>
                  {bidiOutput.trace.map((t, idx) => (
                    <div key={idx} className="trace-line">
                      <span className="trace-step">Step {t.step}:</span>
                      <span className="trace-action">{t.action}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '0.65rem', fontSize: '0.775rem', color: '#64748b' }}>
                  Time & Space Complexity: <strong>O(b^(d/2))</strong> vs standard BFS <strong>O(b^d)</strong>.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 2: INFORMED SEARCH (A*, Greedy, Heuristics, AO*)
          ========================================================================= */}
      {activeTab === 'informed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* A* Search Card */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Zap size={20} color="#eab308" />
                <h4 style={{ fontSize: '1.15rem', color: '#0f172a' }}>1. A* Search Algorithm: f(n) = g(n) + h(n)</h4>
              </div>
              <AlgorithmBadge type="Implemented" />
            </div>

            <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.75rem' }}>
              <strong>Evaluation Function:</strong> <code>f(n) = g(n) + h(n)</code>
              <br />
              • <code>g(n)</code> = Path cost from initial query node to current node.
              <br />
              • <code>h(n)</code> = Admissible heuristic estimate of remaining cost to resolution.
              <br />
              <strong>Application to Portal:</strong> Selects the optimal dispatch routing path with minimum total processing and communication cost.
            </p>

            <button
              onClick={() => setAstarOutput(runAStar())}
              className="btn btn-primary btn-sm"
              style={{ marginBottom: '1rem' }}
            >
              <Play size={14} />
              <span>Run A* Search on Academic Graph</span>
            </button>

            {astarOutput && (
              <div style={{ animation: 'fadeIn 200ms ease-out' }}>
                <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '0.75rem', fontSize: '0.85rem', color: '#854d0e' }}>
                  <strong>Optimal Solution Found!</strong> Path: {astarOutput.path.join(' → ')} • <strong>Total Path Cost g(n):</strong> {astarOutput.totalCost}
                </div>
                <div className="visualizer-box" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                  {astarOutput.trace.map((t, idx) => (
                    <div key={idx} className="trace-line">
                      <span className="trace-step">Step {t.step}:</span>
                      <span className="trace-action">{t.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Greedy Best-First Search Card */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Search size={20} color="#f97316" />
                <h4 style={{ fontSize: '1.15rem', color: '#0f172a' }}>2. Greedy Best-First Search: f(n) = h(n)</h4>
              </div>
              <AlgorithmBadge type="Implemented" />
            </div>

            <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.75rem' }}>
              <strong>Concept:</strong> Selects next node solely minimizing the heuristic <code>h(n)</code> without factoring path cost <code>g(n)</code>. Fast, but not guaranteed to be optimal.
            </p>

            <button
              onClick={() => setGreedyOutput(runGreedyBestFirst())}
              className="btn btn-secondary btn-sm"
              style={{ marginBottom: '1rem' }}
            >
              <Play size={14} />
              <span>Run Greedy Best-First Traversal</span>
            </button>

            {greedyOutput && (
              <div style={{ animation: 'fadeIn 200ms ease-out' }}>
                <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '0.75rem', fontSize: '0.85rem', color: '#9a3412' }}>
                  Path Selected: {greedyOutput.path.join(' → ')}
                </div>
                <div className="visualizer-box" style={{ maxHeight: '160px', overflowY: 'auto' }}>
                  {greedyOutput.trace.map((t, idx) => (
                    <div key={idx} className="trace-line">
                      <span className="trace-step">Step {t.step}:</span>
                      <span className="trace-action">{t.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AO* Search Card */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <GitBranch size={20} color="#7c3aed" />
                <h4 style={{ fontSize: '1.15rem', color: '#0f172a' }}>3. AO* Search (AND-OR Graph)</h4>
              </div>
              <AlgorithmBadge type="Implemented" />
            </div>

            <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.75rem' }}>
              <strong>Concept:</strong> Searches decomposition trees with AND branches (all subproblems must be solved) and OR branches (any one alternative solves it).
              <br />
              <strong>Application to Portal:</strong> Exam Eligibility = (Attendance &gt;= 75%) AND (Accounts Fee Clearance) AND (Admit Card Generated).
            </p>

            <button
              onClick={() => setAoOutput(runAOStarDemo())}
              className="btn btn-purple btn-sm"
              style={{ marginBottom: '1rem' }}
            >
              <Play size={14} />
              <span>Execute AO* Decomposition</span>
            </button>

            {aoOutput && (
              <div style={{ animation: 'fadeIn 200ms ease-out' }}>
                <div style={{ background: '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '0.75rem', fontSize: '0.85rem', color: '#5b21b6' }}>
                  <strong>Optimal AND-Branch Selected:</strong> "{aoOutput.optimalBranch}" with composite cost = {aoOutput.finalCost}.
                </div>
                <div className="visualizer-box" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                  {aoOutput.steps.map((s, idx) => (
                    <div key={idx} className="trace-line">
                      <span className="trace-step">Step {s.step}:</span>
                      <span className="trace-action">[{s.type}] {s.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 3: CONSTRAINT SATISFACTION PROBLEM (CSP)
          ========================================================================= */}
      {activeTab === 'csp' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Cpu size={20} color="#2563eb" />
              <h4 style={{ fontSize: '1.15rem', color: '#0f172a' }}>Constraint Satisfaction Problem (CSP): Faculty Assignment</h4>
            </div>
            <AlgorithmBadge type="Implemented" />
          </div>

          <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1rem' }}>
            <strong>CSP Formalization:</strong>
            <br />
            • <strong>Variables (X):</strong> Queries requiring faculty assignment.
            <br />
            • <strong>Domains (D):</strong> Eligible faculty members with department specializations.
            <br />
            • <strong>Constraints (C):</strong> Department match, maximum workload capacity, and active availability.
          </p>

          <button
            onClick={() => setCspOutput(solveQueryAssignmentCSP(initialQueries, facultyList))}
            className="btn btn-primary btn-sm"
            style={{ marginBottom: '1rem' }}
          >
            <Play size={14} />
            <span>Run CSP Forward Checking & Backtracking</span>
          </button>

          {cspOutput && (
            <div style={{ animation: 'fadeIn 200ms ease-out' }}>
              <div style={{ background: '#ecfdf5', border: '1px solid #86efac', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '0.75rem', fontSize: '0.85rem', color: '#166534' }}>
                Valid Solution Found: Assigned {cspOutput.assignedCount} queries without constraint violations!
              </div>
              <div className="visualizer-box" style={{ maxHeight: '190px', overflowY: 'auto' }}>
                {cspOutput.trace.map((t, idx) => (
                  <div key={idx} className="trace-line">
                    <span className="trace-step">Step {t.step}:</span>
                    <span className="trace-action">{t.action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
