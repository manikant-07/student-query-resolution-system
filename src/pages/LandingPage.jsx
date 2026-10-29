import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  GraduationCap, 
  Users, 
  Cpu, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Layers,
  HelpCircle
} from 'lucide-react';

export function LandingPage() {
  const { queries } = useApp();

  const pendingCount = queries.filter(q => q.status === 'Pending').length;
  const answeredCount = queries.filter(q => q.status === 'Answered').length;
  const resolvedCount = queries.filter(q => q.status === 'Resolved').length;

  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 50%, #f5f3ff 100%)',
          borderRadius: '24px',
          padding: '3.5rem 2rem',
          border: '1px solid #dbeafe',
          boxShadow: 'var(--shadow-md)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '2.5rem'
        }}
      >
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#2563eb',
              padding: '0.4rem 1rem',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1.25rem'
            }}
          >
            <Sparkles size={16} />
            <span>AI Problem-Based Learning (PBL) Project</span>
          </div>

          <h1
            style={{
              fontSize: '2.6rem',
              color: '#0f172a',
              lineHeight: 1.2,
              marginBottom: '1rem',
              fontWeight: 800
            }}
          >
            Student Query Resolution System
            <br />
            <span className="gradient-text">AI Powered Portal</span>
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: '#475569',
              lineHeight: 1.6,
              marginBottom: '2rem',
              fontWeight: 500
            }}
          >
            "Ask Smarter. Resolve Faster."
            <br />
            A smart college grievance and inquiry platform implementing AI syllabus modules: Problem Solving Search, Adversarial Games, Knowledge Representation, and Statistical Reasoning.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/student" className="btn btn-primary btn-lg">
              <GraduationCap size={20} />
              <span>Student Portal</span>
            </Link>

            <Link to="/faculty" className="btn btn-purple btn-lg">
              <Users size={20} />
              <span>Faculty Dashboard</span>
            </Link>

            <Link to="/ai-lab" className="btn btn-secondary btn-lg">
              <Cpu size={20} />
              <span>Explore AI Algorithm Lab</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Impact Statistics */}
      <section style={{ marginBottom: '3rem' }}>
        <div className="grid-4">
          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ color: '#2563eb', marginBottom: '0.5rem' }}>
              <TrendingUp size={28} style={{ margin: '0 auto' }} />
            </div>
            <h3 style={{ fontSize: '2rem', color: '#0f172a' }}>{queries.length}</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Total Inquiries Logged</p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ color: '#d97706', marginBottom: '0.5rem' }}>
              <Layers size={28} style={{ margin: '0 auto' }} />
            </div>
            <h3 style={{ fontSize: '2rem', color: '#0f172a' }}>{pendingCount}</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Active Pending Review</p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ color: '#10b981', marginBottom: '0.5rem' }}>
              <CheckCircle2 size={28} style={{ margin: '0 auto' }} />
            </div>
            <h3 style={{ fontSize: '2rem', color: '#0f172a' }}>{resolvedCount + answeredCount}</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Answered & Resolved</p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ color: '#7c3aed', marginBottom: '0.5rem' }}>
              <Sparkles size={28} style={{ margin: '0 auto' }} />
            </div>
            <h3 style={{ fontSize: '2rem', color: '#0f172a' }}>100%</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>AI Diagnostic Coverage</p>
          </div>
        </div>
      </section>

      {/* How AI Helps Resolve Student Queries */}
      <section className="glass-card" style={{ padding: '2.5rem 2rem', marginBottom: '3rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.5rem auto' }}>
          <h2 style={{ fontSize: '1.85rem', color: '#0f172a', marginBottom: '0.5rem' }}>
            How AI Powers Query Resolution
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#64748b' }}>
            A transparent 5-stage automated pipeline bridging student inquiries with expert resolution.
          </p>
        </div>

        <div className="grid-3" style={{ gap: '1.5rem' }}>
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '0.75rem' }}>
              1
            </div>
            <h4 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '0.5rem' }}>Semantic Intent & Bayes Classification</h4>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
              Tokens are extracted and evaluated via Bayes Theorem to calculate posterior category probabilities P(Category | Keywords).
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: '#ede9fe', color: '#6d28d9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '0.75rem' }}>
              2
            </div>
            <h4 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '0.5rem' }}>Heuristic FAQ Vector Matching</h4>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
              Informed heuristic scoring h(n) compares query tokens against institutional ordinances to surface matching answers immediately.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '0.75rem' }}>
              3
            </div>
            <h4 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '0.5rem' }}>Expert System Forward Chaining</h4>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
              If premises match official academic rules (e.g. medical condonation between 65%-74%), the system proposes a rule-based resolution with certainty score.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '0.75rem' }}>
              4
            </div>
            <h4 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '0.5rem' }}>CSP Automated Faculty Assignment</h4>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
              Unresolved inquiries are automatically assigned to eligible faculty members using Backtracking with Forward Checking respecting workload constraints.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: '#fee2e2', color: '#b91c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '0.75rem' }}>
              5
            </div>
            <h4 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '0.5rem' }}>Fuzzy Urgency Prioritization</h4>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
              Fuzzy membership functions (Low, Medium, High) defuzzify query urgency to ensure critical exam and fee requests receive immediate escalation.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '0.75rem' }}>
              6
            </div>
            <h4 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '0.5rem' }}>Student Feedback Loop</h4>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
              Students rate resolutions as Helpful or Not Helpful, updating the knowledge base certainty metrics for subsequent inquiries.
            </p>
          </div>
        </div>
      </section>

      {/* 4 AI Syllabus Modules Overview */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.5rem auto' }}>
          <h2 style={{ fontSize: '1.85rem', color: '#0f172a', marginBottom: '0.5rem' }}>
            Complete AI Syllabus Coverage (Modules 1–4)
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#64748b' }}>
            Interactive algorithmic demonstrations built directly into the portal for viva defense and academic demonstration.
          </p>
        </div>

        <div className="grid-2">
          {/* Module 1 */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '6px' }}>
                MODULE 1
              </span>
              <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>Implemented</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '0.5rem' }}>
              Problem Solving Methodologies
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '1rem' }}>
              Uninformed Search (BFS, DFS, Iterative Deepening, Bidirectional Search), Informed Search (Heuristics, Greedy Best-First, A*, AO*), and Constraint Satisfaction Problems (CSP).
            </p>
            <Link to="/ai-lab" className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
              <span>Launch Module 1 Lab</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Module 2 */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7c3aed', background: '#f5f3ff', padding: '2px 8px', borderRadius: '6px' }}>
                MODULE 2
              </span>
              <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>Implemented</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '0.5rem' }}>
              Adversarial Search & Classic AI
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '1rem' }}>
              Minimax Game Trees, Alpha-Beta Pruning, Water-Jug Problem, N-Queens Backtracking, Travelling Salesperson Problem (TSP), Missionaries & Cannibals, and 8-Tiles Sliding Puzzle.
            </p>
            <Link to="/ai-lab" className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
              <span>Launch Module 2 Lab</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Module 3 */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: '6px' }}>
                MODULE 3
              </span>
              <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>Implemented</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '0.5rem' }}>
              Knowledge Representation & Reasoning
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '1rem' }}>
              Knowledge Base Rules, Propositional Truth Tables, First-Order Logic (FOL) Relational Predicates, Semantic Networks, Minsky Frames, and complete Expert System Architecture.
            </p>
            <Link to="/ai-lab" className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
              <span>Launch Module 3 Lab</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Module 4 */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#d97706', background: '#fffbeb', padding: '2px 8px', borderRadius: '6px' }}>
                MODULE 4
              </span>
              <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>Implemented</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '0.5rem' }}>
              Statistical Reasoning & Uncertainty
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '1rem' }}>
              Probability & Priors, Bayes Theorem Posterior Updater, Certainty Factors (MYCIN), Bayesian Dependency Networks, Dempster-Shafer Theory, and Fuzzy Logic Urgency Defuzzification.
            </p>
            <Link to="/ai-lab" className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
              <span>Launch Module 4 Lab</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Viva Voce Highlight Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #6d28d9 100%)',
          color: '#ffffff',
          borderRadius: '20px',
          padding: '2.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.6rem', color: '#ffffff', marginBottom: '0.5rem' }}>
            Preparing for Project Evaluation & Viva?
          </h3>
          <p style={{ fontSize: '0.95rem', color: '#e0e7ff', maxWidth: '640px', lineHeight: 1.5 }}>
            Access our dedicated Viva Voce guide containing 30+ detailed Q&As, architecture diagrams, syllabus checklist, and algorithmic complexity matrices.
          </p>
        </div>
        <Link to="/viva" className="btn" style={{ background: '#ffffff', color: '#1e3a8a', fontWeight: 700, padding: '0.85rem 1.75rem' }}>
          <BookOpen size={18} />
          <span>Open Architecture & Viva Guide</span>
        </Link>
      </section>
    </div>
  );
}
