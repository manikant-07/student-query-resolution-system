import React, { useState } from 'react';
import { 
  generateTruthTable, 
  folKnowledgeBase, 
  semanticNetworkData, 
  academicFrames, 
  expertSystemArchitecture 
} from '../../utils/logicAndReasoning';
import { knowledgeRules } from '../../data/knowledgeRules';
import { AlgorithmBadge } from '../common/Badge';
import { 
  Database, 
  Binary, 
  Workflow, 
  Share2, 
  Boxes, 
  Sparkles, 
  LayoutGrid,
  Info,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export function Module3Knowledge() {
  const [activeTab, setActiveTab] = useState('knowledgebase');

  // Propositional Logic State
  const [propOp, setPropOp] = useState('IMPLIES');

  // FOL State
  const [folStudent, setFolStudent] = useState('Manikant');

  // Semantic Network State
  const [selectedNode, setSelectedNode] = useState(semanticNetworkData.nodes[0]);

  // Expert System Prototype State
  const [esCategory, setEsCategory] = useState('Attendance');
  const [esAttendance, setEsAttendance] = useState(68);
  const [esMedDoc, setEsMedDoc] = useState(true);
  const [esResult, setEsResult] = useState(null);

  const handleRunExpertSystem = () => {
    let firedRule = null;
    let recommendation = "";
    let confidence = 0;

    if (esCategory === 'Attendance') {
      if (esAttendance >= 75) {
        firedRule = "RULE_ATTENDANCE_REGULAR";
        recommendation = "Attendance is above 75%. Fully eligible for end-semester exams without any condonation required.";
        confidence = 0.99;
      } else if (esAttendance >= 65 && esMedDoc) {
        firedRule = "RULE_ATTENDANCE_MEDICAL_CONDONATION";
        recommendation = "Eligible for Academic Medical Condonation upon submitting Form AC-4 and hospital slips within 3 business days.";
        confidence = 0.92;
      } else {
        firedRule = "RULE_ATTENDANCE_CRITICAL_DETENTION";
        recommendation = "Attendance strictly below 65% or lacking medical documentation. Subject to Academic Detention. Must repeat course.";
        confidence = 0.98;
      }
    } else {
      firedRule = "RULE_GENERAL_POLICY";
      recommendation = "Inquiry forwarded to the departmental faculty cell for custom evaluation.";
      confidence = 0.75;
    }

    setEsResult({ firedRule, recommendation, confidence });
  };

  return (
    <div>
      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('knowledgebase')}
          className={`btn btn-sm ${activeTab === 'knowledgebase' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Knowledge Base & Rules
        </button>
        <button
          onClick={() => setActiveTab('propositional')}
          className={`btn btn-sm ${activeTab === 'propositional' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Propositional Logic
        </button>
        <button
          onClick={() => setActiveTab('fol')}
          className={`btn btn-sm ${activeTab === 'fol' ? 'btn-primary' : 'btn-secondary'}`}
        >
          First-Order Logic (FOL)
        </button>
        <button
          onClick={() => setActiveTab('semantic')}
          className={`btn btn-sm ${activeTab === 'semantic' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Semantic Networks
        </button>
        <button
          onClick={() => setActiveTab('frames')}
          className={`btn btn-sm ${activeTab === 'frames' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Minsky Frames
        </button>
        <button
          onClick={() => setActiveTab('expertsystem')}
          className={`btn btn-sm ${activeTab === 'expertsystem' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Expert System & Architecture
        </button>
      </div>

      {/* =========================================================================
          TAB 1: KNOWLEDGE BASE
          ========================================================================= */}
      {activeTab === 'knowledgebase' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Database size={20} color="#2563eb" />
              <h4 style={{ fontSize: '1.15rem', color: '#0f172a' }}>College Academic Knowledge Base</h4>
            </div>
            <AlgorithmBadge type="Implemented" />
          </div>

          <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1.25rem' }}>
            Stores declarative institutional facts, clauses, and production rules (<code>IF &lt;premises&gt; THEN &lt;conclusion&gt;</code>) governing academic operations.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {knowledgeRules.map(rule => (
              <div
                key={rule.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '1rem',
                  borderLeft: '4px solid #2563eb'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>{rule.code}</span>
                    <span style={{ fontSize: '0.72rem', background: '#eff6ff', color: '#2563eb', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>{rule.category}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: '999px' }}>
                    CF: {Math.round(rule.confidenceFactor * 100)}%
                  </span>
                </div>

                <div style={{ fontSize: '0.825rem', color: '#475569', marginBottom: '0.4rem' }}>
                  <strong>Premises (IF):</strong>
                  <ul style={{ paddingLeft: '1.25rem', marginTop: '2px' }}>
                    {rule.premises.map((p, idx) => <li key={idx}>{p}</li>)}
                  </ul>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#1e3a8a', background: '#f0f7ff', padding: '0.45rem 0.75rem', borderRadius: '6px' }}>
                  <strong>Conclusion (THEN):</strong> {rule.conclusion}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: PROPOSITIONAL LOGIC
          ========================================================================= */}
      {activeTab === 'propositional' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Binary size={20} color="#7c3aed" />
              <h4 style={{ fontSize: '1.15rem', color: '#0f172a' }}>Propositional Logic & Truth Table Generator</h4>
            </div>
            <AlgorithmBadge type="Implemented" />
          </div>

          <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1rem' }}>
            Demonstrates binary propositions and logical operators: AND (∧), OR (∨), NOT (¬), Implication (P ⇒ Q), and Biconditional (P ⇔ Q).
            <br />
            <strong>Portal Rule Example:</strong> <code>(AssignmentSubmitted ∧ ¬DeadlinePassed) ⇒ EligibleForGrade</code>.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Select Logical Operator:</span>
            {['IMPLIES', 'AND', 'OR', 'BICONDITIONAL'].map(op => (
              <button
                key={op}
                onClick={() => setPropOp(op)}
                className={`btn btn-sm ${propOp === op ? 'btn-purple' : 'btn-secondary'}`}
              >
                {op === 'IMPLIES' ? 'P ⇒ Q (Implication)' :
                 op === 'AND' ? 'P ∧ Q (Conjunction)' :
                 op === 'OR' ? 'P ∨ Q (Disjunction)' : 'P ⇔ Q (Biconditional)'}
              </button>
            ))}
          </div>

          {/* Truth Table */}
          <div className="table-container" style={{ maxWidth: '420px' }}>
            <table className="custom-table" style={{ textAlign: 'center' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'center' }}>P</th>
                  <th style={{ textAlign: 'center' }}>Q</th>
                  <th style={{ textAlign: 'center' }}>Result: {propOp}</th>
                </tr>
              </thead>
              <tbody>
                {generateTruthTable(propOp).map((r, idx) => (
                  <tr key={idx}>
                    <td><strong>{r.p}</strong></td>
                    <td><strong>{r.q}</strong></td>
                    <td style={{ color: r.result === 'T' ? '#16a34a' : '#dc2626', fontWeight: 700 }}>
                      {r.result}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: FIRST-ORDER LOGIC (FOL)
          ========================================================================= */}
      {activeTab === 'fol' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Workflow size={20} color="#059669" />
              <h4 style={{ fontSize: '1.15rem', color: '#0f172a' }}>First-Order Logic (FOL) Knowledge Base</h4>
            </div>
            <AlgorithmBadge type="Implemented" />
          </div>

          <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1rem' }}>
            Uses predicates, constants, variables, and quantifiers (∀, ∃) to express relational academic facts:
            <br />
            • <code>Enrolled(x, c)</code>: Student x is enrolled in course c.
            <br />
            • <code>Teaches(f, c)</code>: Faculty f teaches course c.
            <br />
            • <strong>Quantified Rule:</strong> <code>∀x, ∀c [Enrolled(x, c) ∧ Attendance(x, c) &lt; 75 ⇒ NeedsCondonation(x, c)]</code>
          </p>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>
              Evaluate Predicates for Student:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {folKnowledgeBase.students.map(s => (
                <button
                  key={s}
                  onClick={() => setFolStudent(s)}
                  className={`btn btn-sm ${folStudent === s ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: '#ecfdf5', border: '1px solid #86efac', borderRadius: '10px', padding: '1rem' }}>
            <h5 style={{ fontSize: '0.9rem', color: '#166534', marginBottom: '0.5rem' }}>
              Inferred Relational Facts for "{folStudent}":
            </h5>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#14532d', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {folKnowledgeBase.enrollments.filter(e => e.student === folStudent).map((e, idx) => (
                <li key={idx}>
                  <code>Enrolled({e.student}, {e.course})</code> with <strong>Attendance = {e.attendance}%</strong>
                  <br />
                  Instructor: <code>Teaches({folKnowledgeBase.getCourseInstructor(e.course)}, {e.course})</code>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed #86efac', fontSize: '0.85rem', fontWeight: 600, color: '#166534' }}>
              Condonation Evaluation: {folKnowledgeBase.checkCondonationEligibility(folStudent).length > 0 ? (
                <span>⚠️ EligibleForCondonation({folStudent}, AI Lab) = TRUE (Attendance in [65%, 75%))</span>
              ) : (
                <span>✓ Regular Standing = TRUE</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: SEMANTIC NETWORKS
          ========================================================================= */}
      {activeTab === 'semantic' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Share2 size={20} color="#0284c7" />
              <h4 style={{ fontSize: '1.15rem', color: '#0f172a' }}>Semantic Networks: Interactive Academic Graph</h4>
            </div>
            <AlgorithmBadge type="Implemented" />
          </div>

          <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1rem' }}>
            Represents propositions as a directed graph where nodes represent entities and labeled edges represent semantic relationships (such as IS-A, SUBMITS, TEACHES, RESOLVED_BY).
          </p>

          <div className="grid-2">
            {/* Clickable Node List */}
            <div>
              <h5 style={{ fontSize: '0.85rem', color: '#0f172a', marginBottom: '0.5rem' }}>Inspect Graph Nodes:</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {semanticNetworkData.nodes.map(node => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    style={{
                      textAlign: 'left',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      border: selectedNode.id === node.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      background: selectedNode.id === node.id ? '#eff6ff' : '#ffffff',
                      cursor: 'pointer',
                      fontSize: '0.825rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{node.label}</span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>{node.type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Edge Relational Inspector */}
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h5 style={{ fontSize: '0.95rem', color: '#0f172a', marginBottom: '0.35rem' }}>
                {selectedNode.label}
              </h5>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
                {selectedNode.description}
              </p>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                <strong style={{ fontSize: '0.8rem', color: '#334155' }}>Connected Semantic Edges:</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.5rem' }}>
                  {semanticNetworkData.edges
                    .filter(e => e.from === selectedNode.id || e.to === selectedNode.id)
                    .map((edge, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: '#ffffff',
                          padding: '0.45rem 0.75rem',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <span style={{ fontWeight: 600, color: '#1e293b' }}>{edge.from}</span>
                        <span style={{ fontSize: '0.72rem', background: '#dbeafe', color: '#1d4ed8', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          --[{edge.relation}]--&gt;
                        </span>
                        <span style={{ fontWeight: 600, color: '#1e293b' }}>{edge.to}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: FRAMES
          ========================================================================= */}
      {activeTab === 'frames' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Boxes size={20} color="#7c3aed" />
              <h4 style={{ fontSize: '1.15rem', color: '#0f172a' }}>Structured Minsky Frames</h4>
            </div>
            <AlgorithmBadge type="Implemented" />
          </div>

          <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1.25rem' }}>
            Organizes knowledge into structured frame records with slots, fillers, default values, and inheritance procedures.
          </p>

          <div className="grid-3">
            {Object.entries(academicFrames).map(([key, frame]) => (
              <div
                key={key}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '1rem',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <h5 style={{ fontSize: '0.9rem', color: '#0f172a', marginBottom: '0.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                  {frame.name}
                </h5>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                  {frame.slots.map((s, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', padding: '0.4rem 0.65rem', borderRadius: '6px', border: '1px solid #edf2f7' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 600, color: '#334155' }}>{s.slot}:</span>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>[{s.facet}]</span>
                      </div>
                      <div style={{ color: '#2563eb', fontWeight: 600, marginTop: '2px' }}>
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: EXPERT SYSTEM & ARCHITECTURE
          ========================================================================= */}
      {activeTab === 'expertsystem' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Interactive 6-Component Architecture Diagram */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <LayoutGrid size={20} color="#2563eb" />
                <h4 style={{ fontSize: '1.15rem', color: '#0f172a' }}>Expert System Architecture</h4>
              </div>
              <AlgorithmBadge type="Implemented" />
            </div>

            <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1.25rem' }}>
              Labelled interactive architecture showing the 6 indispensable components of an Expert System:
            </p>

            <div className="grid-3" style={{ gap: '1rem' }}>
              {expertSystemArchitecture.map(mod => (
                <div
                  key={mod.id}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '1rem',
                    borderTop: '3px solid #2563eb'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{mod.name}</span>
                    <span style={{ fontSize: '0.7rem', color: '#16a34a', background: '#dcfce7', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      Active
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
                    {mod.role}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Working Rule-based Assistant Prototype */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Sparkles size={20} color="#7c3aed" />
                <h4 style={{ fontSize: '1.15rem', color: '#0f172a' }}>Working Academic Advisory Expert System Prototype</h4>
              </div>
              <AlgorithmBadge type="Implemented" />
            </div>

            <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1rem' }}>
              Test how forward chaining premises generate automated policy recommendations:
            </p>

            <div className="grid-3" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Category:</label>
                <select
                  className="form-select"
                  style={{ fontSize: '0.825rem', padding: '0.35rem 0.65rem' }}
                  value={esCategory}
                  onChange={(e) => setEsCategory(e.target.value)}
                >
                  <option value="Attendance">Attendance & Detention</option>
                  <option value="Exams">Exams & Admit Card</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Attendance Percentage: {esAttendance}%</label>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={esAttendance}
                  onChange={(e) => setEsAttendance(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '6px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem' }}>
                <input
                  type="checkbox"
                  id="medDoc"
                  checked={esMedDoc}
                  onChange={(e) => setEsMedDoc(e.target.checked)}
                />
                <label htmlFor="medDoc" style={{ fontSize: '0.8rem', color: '#334155', cursor: 'pointer' }}>
                  Has Official Medical Discharge Slip
                </label>
              </div>
            </div>

            <button
              onClick={handleRunExpertSystem}
              className="btn btn-purple btn-sm"
              style={{ marginBottom: '1rem' }}
            >
              <Sparkles size={14} />
              <span>Fire Inference Engine</span>
            </button>

            {esResult && (
              <div style={{ background: '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: '10px', padding: '1rem', animation: 'fadeIn 200ms ease-out' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, color: '#5b21b6', fontSize: '0.9rem' }}>
                    Rule Fired: {esResult.firedRule}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#ede9fe', color: '#6d28d9', padding: '2px 8px', borderRadius: '999px' }}>
                    Certainty: {Math.round(esResult.confidence * 100)}%
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#1e293b', lineHeight: 1.5 }}>
                  <strong>Recommendation:</strong> {esResult.recommendation}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', fontStyle: 'italic' }}>
                  *Note: Automated expert suggestions provide guidance based on encoded rules. Official condonation remains subject to Controller sign-off.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
