import React, { useState } from 'react';
import { 
  runMinimaxDemo, 
  runAlphaBetaDemo, 
  solveWaterJug, 
  solveNQueens, 
  solveCampusTSP, 
  solveMissionariesAndCannibals,
  PUZZLE_GOAL,
  getManhattanDistance,
  getMisplacedTilesCount,
  getPossibleTileMoves
} from '../../utils/classicProblems';
import { AlgorithmBadge } from '../common/Badge';
import { 
  Gamepad2, 
  Scissors, 
  Droplet, 
  Crown, 
  MapPin, 
  Ship, 
  Grid3X3, 
  Play, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

export function Module2Adversarial() {
  const [activeTab, setActiveTab] = useState('minimax');

  // Minimax & Alpha-Beta
  const [minimaxData, setMinimaxData] = useState(null);
  const [alphaBetaData, setAlphaBetaData] = useState(null);

  // Water Jug
  const [jugA, setJugA] = useState(4);
  const [jugB, setJugB] = useState(3);
  const [jugTarget, setJugTarget] = useState(2);
  const [waterJugResult, setWaterJugResult] = useState(null);
  const [activeJugStep, setActiveJugStep] = useState(0);

  // N-Queens
  const [queenN, setQueenN] = useState(4);
  const [queensResult, setQueensResult] = useState(null);

  // TSP
  const [tspResult, setTspResult] = useState(null);

  // Missionaries
  const [missResult, setMissResult] = useState(null);

  // 8-Tiles
  const [puzzleBoard, setPuzzleBoard] = useState([1, 2, 3, 4, 0, 5, 7, 8, 6]);

  const handleTileClick = (index) => {
    const emptyIdx = puzzleBoard.indexOf(0);
    const r1 = Math.floor(index / 3), c1 = index % 3;
    const r0 = Math.floor(emptyIdx / 3), c0 = emptyIdx % 3;

    // Check adjacent
    if (Math.abs(r1 - r0) + Math.abs(c1 - c0) === 1) {
      const newBoard = [...puzzleBoard];
      newBoard[emptyIdx] = newBoard[index];
      newBoard[index] = 0;
      setPuzzleBoard(newBoard);
    }
  };

  const resetPuzzle = () => {
    setPuzzleBoard([1, 2, 3, 4, 0, 5, 7, 8, 6]);
  };

  const solveSamplePuzzle = () => {
    setPuzzleBoard(PUZZLE_GOAL);
  };

  return (
    <div>
      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('minimax')}
          className={`btn btn-sm ${activeTab === 'minimax' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Minimax & Alpha-Beta
        </button>
        <button
          onClick={() => setActiveTab('waterjug')}
          className={`btn btn-sm ${activeTab === 'waterjug' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Water Jug Problem
        </button>
        <button
          onClick={() => setActiveTab('nqueens')}
          className={`btn btn-sm ${activeTab === 'nqueens' ? 'btn-primary' : 'btn-secondary'}`}
        >
          N-Queens Problem
        </button>
        <button
          onClick={() => setActiveTab('tsp')}
          className={`btn btn-sm ${activeTab === 'tsp' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Travelling Salesperson (TSP)
        </button>
        <button
          onClick={() => setActiveTab('missionaries')}
          className={`btn btn-sm ${activeTab === 'missionaries' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Missionaries & Cannibals
        </button>
        <button
          onClick={() => setActiveTab('tiles')}
          className={`btn btn-sm ${activeTab === 'tiles' ? 'btn-primary' : 'btn-secondary'}`}
        >
          8-Tiles Sliding Puzzle
        </button>
      </div>

      {/* =========================================================================
          TAB 1: MINIMAX & ALPHA-BETA
          ========================================================================= */}
      {activeTab === 'minimax' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Minimax Card */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Gamepad2 size={20} color="#2563eb" />
                <h4 style={{ fontSize: '1.15rem', color: '#0f172a' }}>1. Minimax Decision Algorithm</h4>
              </div>
              <AlgorithmBadge type="Implemented" />
            </div>

            <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.75rem' }}>
              <strong>Adversarial Search:</strong> Evaluates game states in zero-sum settings where MAX aims to maximize payoff and MIN aims to minimize it.
              <br />
              <strong>Application Context:</strong> Simulates optimal resource allocation where the Student Service maximizes resolution speed against system latency/bottlenecks.
            </p>

            <button
              onClick={() => setMinimaxData(runMinimaxDemo())}
              className="btn btn-primary btn-sm"
              style={{ marginBottom: '1rem' }}
            >
              <Play size={14} />
              <span>Evaluate Game Tree (Depth 3)</span>
            </button>

            {minimaxData && (
              <div style={{ animation: 'fadeIn 200ms ease-out' }}>
                <div style={{ background: '#ecfdf5', border: '1px solid #86efac', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '0.75rem', fontSize: '0.85rem', color: '#166534' }}>
                  <strong>Optimal Root Payoff Value:</strong> {minimaxData.rootValue} (MAX chooses Left Branch)
                </div>
                <div className="visualizer-box" style={{ maxHeight: '160px', overflowY: 'auto' }}>
                  {minimaxData.steps.map((s, idx) => (
                    <div key={idx} className="trace-line">
                      <span className="trace-step">[{s.level}]</span>
                      <span className="trace-action">{s.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Alpha-Beta Pruning Card */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Scissors size={20} color="#dc2626" />
                <h4 style={{ fontSize: '1.15rem', color: '#0f172a' }}>2. Alpha-Beta Pruning</h4>
              </div>
              <AlgorithmBadge type="Implemented" />
            </div>

            <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.75rem' }}>
              <strong>Pruning Principle:</strong> Maintains bounds <code>α</code> (best choice for MAX so far) and <code>β</code> (best choice for MIN). If <code>β ≤ α</code>, remaining branches are pruned immediately without affecting the minimax value.
            </p>

            <button
              onClick={() => setAlphaBetaData(runAlphaBetaDemo())}
              className="btn btn-purple btn-sm"
              style={{ marginBottom: '1rem' }}
            >
              <Play size={14} />
              <span>Run Alpha-Beta Pruning Analysis</span>
            </button>

            {alphaBetaData && (
              <div style={{ animation: 'fadeIn 200ms ease-out' }}>
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '0.75rem', fontSize: '0.85rem', color: '#991b1b' }}>
                  <strong>Pruned Subtree:</strong> {alphaBetaData.pruned[0]?.node} • <strong>Reason:</strong> {alphaBetaData.pruned[0]?.reason}
                </div>
                <div className="visualizer-box" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                  {alphaBetaData.trace.map((t, idx) => (
                    <div key={idx} className="trace-line">
                      <span className="trace-step">Step {t.step}:</span>
                      <span className="trace-action">[{t.node}] {t.action}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '0.65rem', fontSize: '0.775rem', color: '#64748b' }}>
                  Effective Branching Factor reduced from <code>b</code> to <code>b^(1/2)</code> in optimal move ordering.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: WATER JUG PROBLEM
          ========================================================================= */}
      {activeTab === 'waterjug' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Droplet size={20} color="#0284c7" />
              <h4 style={{ fontSize: '1.15rem', color: '#0f172a' }}>Water-Jug Problem (BFS State Space Search)</h4>
            </div>
            <AlgorithmBadge type="Implemented" />
          </div>

          <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1rem' }}>
            <strong>State Representation:</strong> (x, y) where x is amount in Jug A and y in Jug B.
            <br />
            <strong>Operators:</strong> Fill, Empty, Pour A→B, Pour B→A. Solved via Breadth-First Search to find the minimal sequence of pouring steps.
          </p>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Jug A Capacity (L):</label>
              <input
                type="number"
                min="1"
                max="10"
                className="form-input"
                style={{ width: '80px', padding: '0.35rem 0.6rem' }}
                value={jugA}
                onChange={(e) => setJugA(Number(e.target.value))}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Jug B Capacity (L):</label>
              <input
                type="number"
                min="1"
                max="10"
                className="form-input"
                style={{ width: '80px', padding: '0.35rem 0.6rem' }}
                value={jugB}
                onChange={(e) => setJugB(Number(e.target.value))}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Target Amount (L):</label>
              <input
                type="number"
                min="1"
                max="10"
                className="form-input"
                style={{ width: '80px', padding: '0.35rem 0.6rem' }}
                value={jugTarget}
                onChange={(e) => setJugTarget(Number(e.target.value))}
              />
            </div>

            <button
              onClick={() => {
                const res = solveWaterJug(jugA, jugB, jugTarget);
                setWaterJugResult(res);
                setActiveJugStep(0);
              }}
              className="btn btn-primary btn-sm"
              style={{ marginTop: '1rem' }}
            >
              <Play size={14} />
              <span>Solve with BFS</span>
            </button>
          </div>

          {waterJugResult && waterJugResult.solvable && (
            <div style={{ animation: 'fadeIn 200ms ease-out' }}>
              {/* Animated Jugs Visualizer */}
              <div className="jug-container">
                {/* Jug A */}
                <div style={{ textAlign: 'center' }}>
                  <div className="water-jug" style={{ height: `${jugA * 35}px` }}>
                    <div
                      className="water-fill"
                      style={{
                        height: `${((waterJugResult.path[activeJugStep]?.a || 0) / jugA) * 100}%`
                      }}
                    >
                      {waterJugResult.path[activeJugStep]?.a || 0}L
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e3a8a', marginTop: '6px', display: 'block' }}>
                    Jug A (Max {jugA}L)
                  </span>
                </div>

                {/* Jug B */}
                <div style={{ textAlign: 'center' }}>
                  <div className="water-jug" style={{ height: `${jugB * 35}px` }}>
                    <div
                      className="water-fill"
                      style={{
                        height: `${((waterJugResult.path[activeJugStep]?.b || 0) / jugB) * 100}%`
                      }}
                    >
                      {waterJugResult.path[activeJugStep]?.b || 0}L
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e3a8a', marginTop: '6px', display: 'block' }}>
                    Jug B (Max {jugB}L)
                  </span>
                </div>
              </div>

              {/* Step Navigation Slider */}
              <div style={{ background: '#f0f9ff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #bae6fd', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0369a1' }}>
                  Step {activeJugStep + 1} of {waterJugResult.path.length}: {waterJugResult.path[activeJugStep]?.action}
                </span>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    disabled={activeJugStep === 0}
                    onClick={() => setActiveJugStep(prev => Math.max(0, prev - 1))}
                    className="btn btn-secondary btn-sm"
                  >
                    Previous
                  </button>
                  <button
                    disabled={activeJugStep === waterJugResult.path.length - 1}
                    onClick={() => setActiveJugStep(prev => Math.min(waterJugResult.path.length - 1, prev + 1))}
                    className="btn btn-primary btn-sm"
                  >
                    Next Step
                  </button>
                </div>
              </div>

              {/* Full Step Table */}
              <div className="table-container" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Step</th>
                      <th>Operation</th>
                      <th>Jug A Level</th>
                      <th>Jug B Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {waterJugResult.path.map((p, idx) => (
                      <tr
                        key={idx}
                        style={{ background: activeJugStep === idx ? '#e0f2fe' : 'transparent', cursor: 'pointer' }}
                        onClick={() => setActiveJugStep(idx)}
                      >
                        <td><strong>#{idx + 1}</strong></td>
                        <td>{p.action}</td>
                        <td>{p.a}L</td>
                        <td>{p.b}L</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {waterJugResult && !waterJugResult.solvable && (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '1rem', color: '#991b1b', fontSize: '0.875rem' }}>
              {waterJugResult.message}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: N-QUEENS PROBLEM
          ========================================================================= */}
      {activeTab === 'nqueens' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Crown size={20} color="#eab308" />
              <h4 style={{ fontSize: '1.15rem', color: '#0f172a' }}>N-Queens Problem (Backtracking Search)</h4>
            </div>
            <AlgorithmBadge type="Implemented" />
          </div>

          <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1rem' }}>
            <strong>Constraints:</strong> Place N non-attacking Queens on an N×N board such that no two queens share the same row, column, or diagonal (|row[i] - row[j]| == |i - j|).
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Select Board Size:</span>
            {[4, 5, 8].map(size => (
              <button
                key={size}
                onClick={() => {
                  setQueenN(size);
                  setQueensResult(solveNQueens(size));
                }}
                className={`btn btn-sm ${queenN === size ? 'btn-primary' : 'btn-secondary'}`}
              >
                {size} × {size}
              </button>
            ))}
          </div>

          {queensResult && queensResult.firstSolution && (
            <div style={{ textAlign: 'center', animation: 'fadeIn 200ms ease-out' }}>
              <div style={{ marginBottom: '0.5rem', fontSize: '0.85rem', color: '#166534', background: '#ecfdf5', padding: '0.5rem', borderRadius: '8px', display: 'inline-block' }}>
                Total Valid Solutions for {queenN}×{queenN}: <strong>{queensResult.totalSolutions}</strong>
              </div>

              {/* Chessboard */}
              <div
                className="chessboard"
                style={{
                  gridTemplateColumns: `repeat(${queenN}, 44px)`,
                  gridTemplateRows: `repeat(${queenN}, 44px)`
                }}
              >
                {Array(queenN).fill(null).map((_, row) =>
                  Array(queenN).fill(null).map((_, col) => {
                    const isQueen = queensResult.firstSolution[col] === row;
                    const isDark = (row + col) % 2 === 1;
                    return (
                      <div
                        key={`${row}-${col}`}
                        className={`chess-cell ${isDark ? 'dark' : 'light'} ${isQueen ? 'queen' : ''}`}
                      >
                        {isQueen ? '👑' : ''}
                      </div>
                    );
                  })
                )}
              </div>

              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.75rem' }}>
                Queen Placements (Row per Column): [{queensResult.firstSolution.join(', ')}]
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 4: TRAVELLING SALESPERSON (CAMPUS ROUTE)
          ========================================================================= */}
      {activeTab === 'tsp' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <MapPin size={20} color="#2563eb" />
              <h4 style={{ fontSize: '1.15rem', color: '#0f172a' }}>Travelling Salesperson Problem (Campus Query Route)</h4>
            </div>
            <AlgorithmBadge type="Implemented" />
          </div>

          <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1rem' }}>
            <strong>Problem Formulation:</strong> An academic inspection officer must visit all campus administrative nodes (Admin Block, CS Department, Library, Examination Cell) and return to origin minimizing total walking transit distance.
          </p>

          <button
            onClick={() => setTspResult(solveCampusTSP())}
            className="btn btn-primary btn-sm"
            style={{ marginBottom: '1rem' }}
          >
            <Play size={14} />
            <span>Calculate Shortest Campus Tour</span>
          </button>

          {tspResult && (
            <div style={{ animation: 'fadeIn 200ms ease-out' }}>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.85rem', marginBottom: '1rem', color: '#1e40af', fontSize: '0.9rem' }}>
                <strong>Optimal Tour Route:</strong> {tspResult.optimalTour.join(' → ')}
                <br />
                <strong>Minimum Total Distance:</strong> {tspResult.optimalDistance} meters
              </div>

              <h5 style={{ fontSize: '0.85rem', color: '#0f172a', marginBottom: '0.4rem' }}>All Permuted Tours Evaluation Breakdown:</h5>
              <div className="visualizer-box" style={{ maxHeight: '160px', overflowY: 'auto' }}>
                {tspResult.breakdown.map((b, idx) => (
                  <div key={idx} className="trace-line">
                    <span className="trace-step">Tour #{idx + 1}:</span>
                    <span className="trace-action">{b.tour}</span>
                    <span className="trace-eval">[Total: {b.distance}m]</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 5: MISSIONARIES & CANNIBALS
          ========================================================================= */}
      {activeTab === 'missionaries' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Ship size={20} color="#059669" />
              <h4 style={{ fontSize: '1.15rem', color: '#0f172a' }}>Missionaries and Cannibals Problem (BFS)</h4>
            </div>
            <AlgorithmBadge type="Implemented" />
          </div>

          <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1rem' }}>
            <strong>Safety Constraint:</strong> At no time may the number of cannibals outnumber missionaries on either bank (unless missionaries = 0). Boat holds maximum 2 people. Solved via Breadth-First Search.
          </p>

          <button
            onClick={() => setMissResult(solveMissionariesAndCannibals())}
            className="btn btn-primary btn-sm"
            style={{ marginBottom: '1rem' }}
          >
            <Play size={14} />
            <span>Find Safe River Crossing Path</span>
          </button>

          {missResult && missResult.solved && (
            <div style={{ animation: 'fadeIn 200ms ease-out' }}>
              <div style={{ background: '#ecfdf5', border: '1px solid #86efac', borderRadius: '8px', padding: '0.85rem', marginBottom: '1rem', color: '#166534', fontSize: '0.9rem' }}>
                Safe Transit Plan Discovered! Completed in {missResult.steps.length} sequential crossings without any constraint violations.
              </div>

              <div className="table-container" style={{ maxHeight: '220px', overflowY: 'auto' }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Step</th>
                      <th>Action</th>
                      <th>Left Bank (M, C)</th>
                      <th>Right Bank (M, C)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {missResult.steps.map((s, idx) => {
                      const mLeft = s.state[0], cLeft = s.state[1];
                      return (
                        <tr key={idx}>
                          <td><strong>#{idx + 1}</strong></td>
                          <td>{s.action}</td>
                          <td>{mLeft} Missionaries, {cLeft} Cannibals</td>
                          <td>{3 - mLeft} Missionaries, {3 - cLeft} Cannibals</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 6: 8-TILES SLIDING PUZZLE
          ========================================================================= */}
      {activeTab === 'tiles' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Grid3X3 size={20} color="#7c3aed" />
              <h4 style={{ fontSize: '1.15rem', color: '#0f172a' }}>8-Tiles Sliding Puzzle (Heuristic A* Solver)</h4>
            </div>
            <AlgorithmBadge type="Implemented" />
          </div>

          <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1rem' }}>
            <strong>Interactive 3×3 Grid:</strong> Click on any tile adjacent to the empty slot to slide it.
            <br />
            <strong>Heuristic Functions:</strong>
            <br />
            • <code>h1</code> = Number of misplaced tiles.
            <br />
            • <code>h2</code> = Manhattan Distance sum (admissible and monotonic).
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Interactive Board */}
            <div>
              <div className="puzzle-board">
                {puzzleBoard.map((val, idx) => (
                  <div
                    key={idx}
                    className={`puzzle-tile ${val === 0 ? 'empty' : ''}`}
                    onClick={() => handleTileClick(idx)}
                  >
                    {val !== 0 ? val : ''}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button onClick={resetPuzzle} className="btn btn-secondary btn-sm">
                  <RotateCcw size={14} />
                  <span>Reset Board</span>
                </button>
                <button onClick={solveSamplePuzzle} className="btn btn-primary btn-sm">
                  <CheckCircle2 size={14} />
                  <span>Reach Goal State</span>
                </button>
              </div>
            </div>

            {/* Heuristics Monitor Box */}
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', minWidth: '240px' }}>
              <h5 style={{ fontSize: '0.9rem', color: '#0f172a', marginBottom: '0.75rem' }}>Live Heuristic Calculations</h5>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Misplaced Tiles (h1):</span>
                  <strong style={{ color: '#0f172a' }}>{getMisplacedTilesCount(puzzleBoard)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Manhattan Distance (h2):</span>
                  <strong style={{ color: '#2563eb' }}>{getManhattanDistance(puzzleBoard)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
                  <span style={{ color: '#64748b' }}>Goal Reached:</span>
                  <span style={{ fontWeight: 700, color: getManhattanDistance(puzzleBoard) === 0 ? '#16a34a' : '#d97706' }}>
                    {getManhattanDistance(puzzleBoard) === 0 ? 'SOLVED (h = 0)' : 'In Progress'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
