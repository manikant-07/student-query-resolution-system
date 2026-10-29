import React, { useState } from 'react';
import { 
  calculateBayesianCategory, 
  CATEGORY_PRIORS, 
  calculateCertaintyFactor 
} from '../../utils/aiEngine';
import { 
  combineDempsterShafer, 
  evaluateFuzzyPriority 
} from '../../utils/logicAndReasoning';
import { AlgorithmBadge } from '../common/Badge';
import { 
  Calculator, 
  TrendingUp, 
  Gauge, 
  Network, 
  Scale, 
  Sliders, 
  Play, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export function Module4Statistical() {
  const [activeTab, setActiveTab] = useState('probability');

  // Bayes Theorem Interactive Input
  const [bayesInput, setBayesInput] = useState('attendance shortage medical hospital');
  const [bayesResult, setBayesResult] = useState(null);

  // Certainty Factor Input
  const [cfEvidence, setCfEvidence] = useState(3);
  const [cfContradiction, setCfContradiction] = useState(0);

  // Dempster-Shafer State
  const [dsAdvisorMass, setDsAdvisorMass] = useState(0.6);
  const [dsFinanceMass, setDsFinanceMass] = useState(0.5);
  const [dsResult, setDsResult] = useState(null);

  // Fuzzy Logic State
  const [fuzzyUrgency, setFuzzyUrgency] = useState(65);

  const handleRunBayes = () => {
    setBayesResult(calculateBayesianCategory(bayesInput));
  };

  const handleRunDS = () => {
    // Advisor evidence: Attendance = mass, Exams = 0.2, Uncertainty = 1 - mass - 0.2
    const m1 = {
      Attendance: dsAdvisorMass,
      Exams: 0.15,
      Fees: 0.05,
      Theta: Math.max(0, 1 - dsAdvisorMass - 0.2)
    };
    const m2 = {
      Attendance: dsFinanceMass,
      Exams: 0.1,
      Fees: 0.2,
      Theta: Math.max(0, 1 - dsFinanceMass - 0.3)
    };
    setDsResult(combineDempsterShafer(m1, m2));
  };

  const fuzzyEval = evaluateFuzzyPriority(fuzzyUrgency);

  return (
    <div>
      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('probability')}
          className={`btn btn-sm ${activeTab === 'probability' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Probability & Prior Distribution
        </button>
        <button
          onClick={() => setActiveTab('bayes')}
          className={`btn btn-sm ${activeTab === 'bayes' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Bayes Theorem
        </button>
        <button
          onClick={() => setActiveTab('cf')}
          className={`btn btn-sm ${activeTab === 'cf' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Certainty Factors (MYCIN)
        </button>
        <button
          onClick={() => setActiveTab('bayesian-net')}
          className={`btn btn-sm ${activeTab === 'bayesian-net' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Bayesian Networks (DAG)
        </button>
        <button
          onClick={() => setActiveTab('dempster')}
          className={`btn btn-sm ${activeTab === 'dempster' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Dempster-Shafer Theory
        </button>
        <button
          onClick={() => setActiveTab('fuzzy')}
          className={`btn btn-sm ${activeTab === 'fuzzy' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Fuzzy Logic & Defuzzification
        </button>
      </div>

      {/* =========================================================================
          TAB 1: PROBABILITY DISTRIBUTION
          ========================================================================= */}
      {activeTab === 'probability' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Calculator size={20} color="#2563eb" />
              <h4 style={{ fontSize: '1.15rem', color: '#0f172a' }}>1. Historical Query Probability Distribution</h4>
            </div>
            <AlgorithmBadge type="Implemented" />
          </div>

          <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1.25rem' }}>
            Empirical baseline probabilities <code>P(Category) = n_Category / N_Total</code> calculated from 500 historical student inquiry tickets:
          </p>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Observed Tickets</th>
                  <th>Prior Probability P(C)</th>
                  <th>Probability Bar</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(CATEGORY_PRIORS).map(([cat, prior]) => {
                  const count = Math.round(prior * 500);
                  return (
                    <tr key={cat}>
                      <td><strong>{cat}</strong></td>
                      <td>{count} tickets</td>
                      <td><strong>{(prior * 100).toFixed(0)}%</strong> (P = {prior})</td>
                      <td style={{ width: '40%' }}>
                        <div style={{ background: '#f1f5f9', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
                          <div style={{ background: '#2563eb', height: '100%', width: `${prior * 100}%` }}></div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: BAYES THEOREM
          ========================================================================= */}
      {activeTab === 'bayes' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <TrendingUp size={20} color="#7c3aed" />
              <h4 style={{ fontSize: '1.15rem', color: '#0f172a' }}>2. Bayes Theorem: Evidence-Based Updating</h4>
            </div>
            <AlgorithmBadge type="Implemented" />
          </div>

          <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1rem' }}>
            Calculates Posterior Probability: <code>P(Category | Keywords) = [P(Keywords | Category) · P(Category)] / P(Keywords)</code>
          </p>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.4rem' }}>
              Input Inquiry Text / Observed Tokens:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                value={bayesInput}
                onChange={(e) => setBayesInput(e.target.value)}
                placeholder="e.g. attendance shortage medical fever"
              />
              <button onClick={handleRunBayes} className="btn btn-purple" style={{ flexShrink: 0 }}>
                <Play size={14} />
                <span>Compute Posterior</span>
              </button>
            </div>
          </div>

          {bayesResult && (
            <div style={{ animation: 'fadeIn 200ms ease-out' }}>
              <h5 style={{ fontSize: '0.85rem', color: '#0f172a', marginBottom: '0.5rem' }}>
                Posterior Probabilities P(Category | Evidence):
              </h5>
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Prior P(C)</th>
                      <th>Likelihood P(E|C)</th>
                      <th>Posterior P(C|E)</th>
                      <th>Classification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bayesResult.map((r, idx) => (
                      <tr key={r.category} style={{ background: idx === 0 ? '#f0fdf4' : 'transparent' }}>
                        <td><strong>{r.category}</strong></td>
                        <td>{r.prior}</td>
                        <td>{r.likelihood}</td>
                        <td style={{ fontWeight: 700, color: idx === 0 ? '#166534' : '#0f172a' }}>
                          {(r.probability * 100).toFixed(1)}%
                        </td>
                        <td>
                          {idx === 0 && (
                            <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                              TOP PREDICTION
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: CERTAINTY FACTORS
          ========================================================================= */}
      {activeTab === 'cf' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Gauge size={20} color="#059669" />
              <h4 style={{ fontSize: '1.15rem', color: '#0f172a' }}>3. Certainty Factors (MYCIN Model)</h4>
            </div>
            <AlgorithmBadge type="Implemented" />
          </div>

          <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1.25rem' }}>
            Formula: <code>CF = MB - MD</code>
            <br />
            • <code>MB</code> (Measure of Belief): Degree of support from positive rule evidence in [0, 1].
            <br />
            • <code>MD</code> (Measure of Disbelief): Degree of doubt from contradictory symptoms in [0, 1].
          </p>

          <div className="grid-2" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                Supporting Evidence Count (MB boost): {cfEvidence}
              </label>
              <input
                type="range"
                min="0"
                max="4"
                value={cfEvidence}
                onChange={(e) => setCfEvidence(Number(e.target.value))}
                style={{ width: '100%', marginTop: '6px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                Contradictions / Disqualification Count (MD): {cfContradiction}
              </label>
              <input
                type="range"
                min="0"
                max="3"
                value={cfContradiction}
                onChange={(e) => setCfContradiction(Number(e.target.value))}
                style={{ width: '100%', marginTop: '6px' }}
              />
            </div>
          </div>

          {(() => {
            const cf = calculateCertaintyFactor(cfEvidence, cfContradiction);
            return (
              <div style={{ background: '#ecfdf5', border: '1px solid #86efac', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#166534' }}>
                    Calculated Confidence Score:
                  </span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: cf.CF >= 0 ? '#166534' : '#dc2626' }}>
                    CF = {cf.CF}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem', fontSize: '0.8rem', color: '#14532d' }}>
                  <span>Measure of Belief (MB): <strong>{cf.MB}</strong></span>
                  <span>Measure of Disbelief (MD): <strong>{cf.MD}</strong></span>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* =========================================================================
          TAB 4: BAYESIAN NETWORKS
          ========================================================================= */}
      {activeTab === 'bayesian-net' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Network size={20} color="#0284c7" />
              <h4 style={{ fontSize: '1.15rem', color: '#0f172a' }}>4. Bayesian Network (DAG Dependency Graph)</h4>
            </div>
            <AlgorithmBadge type="Implemented" />
          </div>

          <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1.25rem' }}>
            Directed Acyclic Graph (DAG) modeling probabilistic conditional dependencies in the Student Query System:
          </p>

          <div
            style={{
              background: '#0f172a',
              color: '#f8fafc',
              padding: '1.5rem',
              borderRadius: '12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              lineHeight: 1.8
            }}
          >
            <div style={{ color: '#38bdf8' }}>[Query Keywords]  ───&gt;  [Query Category]</div>
            <div style={{ paddingLeft: '140px', color: '#94a3b8' }}>│</div>
            <div style={{ paddingLeft: '140px', color: '#a7f3d0' }}>▼</div>
            <div style={{ paddingLeft: '80px', color: '#fde047' }}>[Assigned Department]  ───&gt;  [Suggested Resolution]</div>
          </div>

          <div style={{ marginTop: '1.25rem', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '1rem', fontSize: '0.825rem', color: '#0369a1' }}>
            <strong>Conditional Probability Table (CPT) Sample:</strong>
            <br />
            <code>P(Category=Attendance | Keywords=[medical, condonation]) = 0.94</code>
            <br />
            <code>P(Department=AI&DS | Category=Attendance) = 0.88</code>
            <br />
            <code>P(Answer=Form AC-4 | Department=AI&DS, Category=Attendance) = 0.96</code>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: DEMPSTER-SHAFER THEORY
          ========================================================================= */}
      {activeTab === 'dempster' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Scale size={20} color="#7c3aed" />
              <h4 style={{ fontSize: '1.15rem', color: '#0f172a' }}>5. Dempster-Shafer Theory: Evidence Fusion</h4>
            </div>
            <AlgorithmBadge type="Implemented" />
          </div>

          <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1.25rem' }}>
            Handles epistemic uncertainty without requiring strict additivity to 1 across singletons.
            <br />
            • <strong>Belief [Bel(A)]:</strong> Total belief committed strictly to A.
            <br />
            • <strong>Plausibility [Pl(A)]:</strong> Upper bound of belief not committed to ¬A.
            <br />
            • <strong>Uncertainty Interval:</strong> <code>[Bel(A), Pl(A)]</code>.
          </p>

          <div className="grid-2" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                Source 1 (NLP Parser) Mass for Attendance: {dsAdvisorMass}
              </label>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={dsAdvisorMass}
                onChange={(e) => setDsAdvisorMass(Number(e.target.value))}
                style={{ width: '100%', marginTop: '6px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                Source 2 (Student History) Mass for Attendance: {dsFinanceMass}
              </label>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={dsFinanceMass}
                onChange={(e) => setDsFinanceMass(Number(e.target.value))}
                style={{ width: '100%', marginTop: '6px' }}
              />
            </div>
          </div>

          <button onClick={handleRunDS} className="btn btn-purple btn-sm" style={{ marginBottom: '1rem' }}>
            <Play size={14} />
            <span>Calculate Dempster Combination (m1 ⊕ m2)</span>
          </button>

          {dsResult && (
            <div style={{ background: '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: '10px', padding: '1rem', animation: 'fadeIn 200ms ease-out' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, color: '#5b21b6', fontSize: '0.9rem' }}>
                  Belief - Plausibility Interval for Attendance:
                </span>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#6d28d9' }}>
                  [{dsResult.belief}, {dsResult.plausibility}]
                </span>
              </div>
              <div style={{ display: 'flex', gap: '2rem', fontSize: '0.8rem', color: '#475569' }}>
                <span>Conflict Metric (K): <strong>{dsResult.conflict}</strong></span>
                <span>Remaining Uncertainty Interval: <strong>{dsResult.uncertaintyInterval}</strong></span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 6: FUZZY LOGIC
          ========================================================================= */}
      {activeTab === 'fuzzy' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Sliders size={20} color="#2563eb" />
              <h4 style={{ fontSize: '1.15rem', color: '#0f172a' }}>6. Fuzzy Logic Priority & Centroid Defuzzification</h4>
            </div>
            <AlgorithmBadge type="Implemented" />
          </div>

          <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1.25rem' }}>
            Handles partial truth values between 0.0 and 1.0 using continuous membership curves for Low, Medium, and High priority, defuzzified via the Centroid Method.
          </p>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
              Query Urgency Input Score: {fuzzyUrgency} / 100
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={fuzzyUrgency}
              onChange={(e) => setFuzzyUrgency(Number(e.target.value))}
              style={{ width: '100%', marginTop: '8px' }}
            />
          </div>

          {/* Membership Curves Values */}
          <div className="grid-3" style={{ marginBottom: '1rem' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>μ_Low (Standard)</span>
              <h4 style={{ fontSize: '1.25rem', color: '#475569', marginTop: '2px' }}>{fuzzyEval.muLow}</h4>
            </div>
            <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#854d0e' }}>μ_Medium (Normal Review)</span>
              <h4 style={{ fontSize: '1.25rem', color: '#d97706', marginTop: '2px' }}>{fuzzyEval.muMed}</h4>
            </div>
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#991b1b' }}>μ_High (Urgent Escalation)</span>
              <h4 style={{ fontSize: '1.25rem', color: '#dc2626', marginTop: '2px' }}>{fuzzyEval.muHigh}</h4>
            </div>
          </div>

          {/* Defuzzification Output */}
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e40af' }}>
                Centroid Defuzzified Score: {fuzzyEval.defuzzifiedScore} / 100
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, background: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: '999px' }}>
                Crisp Decision
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 600, marginTop: '4px' }}>
              Recommendation: {fuzzyEval.recommendation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
