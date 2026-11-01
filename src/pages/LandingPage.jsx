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
  Clock,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  FileCheck,
  ChevronRight
} from 'lucide-react';

export function LandingPage() {
  const { queries, openAuthModal, currentUser } = useApp();

  const pendingCount = queries.filter(q => q.status === 'Pending').length;
  const answeredCount = queries.filter(q => q.status === 'Answered').length;
  const resolvedCount = queries.filter(q => q.status === 'Resolved').length;

  return (
    <div className="page-wrapper" style={{ paddingBottom: '3rem' }}>
      {/* =========================================================================
          HERO SECTION (Inspired by Meritto's Professional EdTech Design)
          - Large soft sky blue background (#DCEEFF / #F1F7FD)
          - Left: Strong heading, description, CTAs
          - Right: Professional student-support / dashboard visual preview
          ========================================================================= */}
      <section
        style={{
          background: 'linear-gradient(135deg, #DCEEFF 0%, #F1F7FD 100%)',
          borderRadius: '20px',
          border: '1px solid #DFE8F2',
          padding: '3.5rem 2.5rem',
          marginBottom: '2.5rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.15fr 0.85fr',
            gap: '2.5rem',
            alignItems: 'center'
          }}
          className="hero-grid"
        >
          {/* Left Column: Heading & CTAs */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#FFFFFF',
                border: '1px solid #DFE8F2',
                color: '#2878E5',
                padding: '0.4rem 1rem',
                borderRadius: '999px',
                fontSize: '0.825rem',
                fontWeight: 700,
                marginBottom: '1.25rem',
                boxShadow: 'var(--shadow-xs)',
                letterSpacing: '0.02em'
              }}
            >
              <Sparkles size={16} color="#2878E5" />
              <span>Academic ERP & Student Query Management Platform</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.1rem, 3.8vw, 3.2rem)',
                color: '#142B4D',
                lineHeight: 1.18,
                marginBottom: '1.25rem',
                fontWeight: 800,
                fontFamily: 'var(--font-heading)'
              }}
            >
              One Platform. Every Student Query.{' '}
              <span style={{ color: '#2878E5' }}>Resolved.</span>
            </h1>

            <p
              style={{
                fontSize: '1.12rem',
                color: '#52677F',
                lineHeight: 1.65,
                marginBottom: '2rem',
                maxWidth: '560px',
                fontWeight: 500
              }}
            >
              A smarter way to connect students, faculty and administration. Submit queries, track progress and get timely resolutions through one unified platform.
            </p>

            {/* Hero Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {currentUser ? (
                <Link to="/student" className="btn btn-primary btn-lg" style={{ boxShadow: '0 4px 14px rgba(40, 120, 229, 0.35)' }}>
                  <GraduationCap size={20} />
                  <span>Go to Student Dashboard</span>
                  <ArrowRight size={18} />
                </Link>
              ) : (
                <button
                  onClick={() => openAuthModal('register')}
                  className="btn btn-primary btn-lg"
                  style={{ boxShadow: '0 4px 14px rgba(40, 120, 229, 0.35)' }}
                >
                  <GraduationCap size={20} />
                  <span>Get Started</span>
                  <ArrowRight size={18} />
                </button>
              )}

              <Link to="/student" className="btn btn-secondary btn-lg" style={{ background: '#FFFFFF', borderColor: '#DFE8F2', color: '#142B4D' }}>
                <Search size={18} color="#2878E5" />
                <span>Explore Platform</span>
              </Link>
            </div>

            {/* Quick Trust Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid rgba(223, 232, 242, 0.7)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#52677F', fontWeight: 600 }}>
                <CheckCircle2 size={16} color="#16865B" />
                <span>Real-Time Tracking</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#52677F', fontWeight: 600 }}>
                <ShieldCheck size={16} color="#2878E5" />
                <span>Official Faculty Desks</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#52677F', fontWeight: 600 }}>
                <Zap size={16} color="#E5A13B" />
                <span>Automated AI Assistance</span>
              </div>
            </div>
          </div>

          {/* Right Column: EdTech Dashboard Visual Preview */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #DFE8F2',
                boxShadow: 'var(--shadow-xl)',
                padding: '1.5rem',
                position: 'relative'
              }}
            >
              {/* Preview Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid #DFE8F2', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#16865B', boxShadow: '0 0 6px #16865B' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#142B4D' }}>Live Resolution Feed</span>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#52677F', background: '#F1F7FD', padding: '2px 8px', borderRadius: '6px' }}>
                  Campus ERP Node
                </span>
              </div>

              {/* Sample Ticket 1 */}
              <div
                style={{
                  background: '#F1F7FD',
                  borderRadius: '10px',
                  padding: '1rem',
                  border: '1px solid #DFE8F2',
                  marginBottom: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2878E5' }}>QRY-1002 • Examination</span>
                  <span className="badge badge-resolved" style={{ fontSize: '0.7rem' }}>Resolved</span>
                </div>
                <h4 style={{ fontSize: '0.92rem', color: '#142B4D', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Mid-Term Examination Hall Ticket Clearance
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#52677F' }}>
                  <FileCheck size={14} color="#16865B" />
                  <span>Financial clearance verified • Resolution issued by Dr. Vikram Seth</span>
                </div>
              </div>

              {/* Sample Ticket 2 */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '10px',
                  padding: '1rem',
                  border: '1px solid #DFE8F2',
                  marginBottom: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2878E5' }}>QRY-1001 • Attendance</span>
                  <span className="badge badge-answered" style={{ fontSize: '0.7rem' }}>Answered</span>
                </div>
                <h4 style={{ fontSize: '0.92rem', color: '#142B4D', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Lab Attendance Condonation (68% Medical)
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#52677F' }}>
                  <MessageSquare size={14} color="#2878E5" />
                  <span>Assigned to Prof. Roshni Prasad (AI & Data Science)</span>
                </div>
              </div>

              {/* AI Auto-Evaluation Insight Pill */}
              <div
                style={{
                  background: '#EBF3FD',
                  borderRadius: '8px',
                  padding: '0.75rem 0.95rem',
                  border: '1px solid #D0E2FB',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem'
                }}
              >
                <Sparkles size={16} color="#2878E5" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: '0.78rem', color: '#142B4D', lineHeight: 1.35 }}>
                  <strong>AI Heuristic Match:</strong> Rule #ATT-102 fired with 95% confidence for medical condonation workflow.
                </div>
              </div>

              {/* Floating Stat Pill (Right Bottom) */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-14px',
                  right: '18px',
                  background: '#FFFFFF',
                  border: '1px solid #DFE8F2',
                  borderRadius: '999px',
                  padding: '0.4rem 0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: 'var(--shadow-md)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#142B4D'
                }}
              >
                <Clock size={14} color="#16865B" />
                <span>Avg. Resolution: 2.4 Hours</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          LIVE PORTAL METRICS
          ========================================================================= */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div className="grid-4">
          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', background: '#FFFFFF' }}>
            <div style={{ color: '#2878E5', marginBottom: '0.5rem' }}>
              <TrendingUp size={28} style={{ margin: '0 auto' }} />
            </div>
            <h3 style={{ fontSize: '2rem', color: '#142B4D', fontFamily: 'var(--font-heading)' }}>{queries.length}</h3>
            <p style={{ fontSize: '0.825rem', color: '#52677F', fontWeight: 600 }}>Total Inquiries Logged</p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', background: '#FFFFFF' }}>
            <div style={{ color: '#E5A13B', marginBottom: '0.5rem' }}>
              <Layers size={28} style={{ margin: '0 auto' }} />
            </div>
            <h3 style={{ fontSize: '2rem', color: '#142B4D', fontFamily: 'var(--font-heading)' }}>{pendingCount}</h3>
            <p style={{ fontSize: '0.825rem', color: '#52677F', fontWeight: 600 }}>Active Pending Review</p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', background: '#FFFFFF' }}>
            <div style={{ color: '#16865B', marginBottom: '0.5rem' }}>
              <CheckCircle2 size={28} style={{ margin: '0 auto' }} />
            </div>
            <h3 style={{ fontSize: '2rem', color: '#142B4D', fontFamily: 'var(--font-heading)' }}>{resolvedCount + answeredCount}</h3>
            <p style={{ fontSize: '0.825rem', color: '#52677F', fontWeight: 600 }}>Answered & Resolved</p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', background: '#FFFFFF' }}>
            <div style={{ color: '#2878E5', marginBottom: '0.5rem' }}>
              <Sparkles size={28} style={{ margin: '0 auto' }} />
            </div>
            <h3 style={{ fontSize: '2rem', color: '#142B4D', fontFamily: 'var(--font-heading)' }}>100%</h3>
            <p style={{ fontSize: '0.825rem', color: '#52677F', fontWeight: 600 }}>AI Diagnostic Coverage</p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          HOW AI POWERS QUERY RESOLUTION
          ========================================================================= */}
      <section className="glass-card" style={{ padding: '2.5rem 2rem', marginBottom: '2.5rem', background: '#FFFFFF' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.5rem auto' }}>
          <div
            style={{
              display: 'inline-block',
              background: '#EBF3FD',
              color: '#2878E5',
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '999px',
              marginBottom: '0.5rem',
              textTransform: 'uppercase'
            }}
          >
            Intelligent Automation
          </div>
          <h2 style={{ fontSize: '1.85rem', color: '#142B4D', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            How AI Powers Student Query Resolution
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#52677F' }}>
            A transparent 5-stage automated pipeline bridging student inquiries with expert resolution.
          </p>
        </div>

        <div className="grid-3" style={{ gap: '1.5rem' }}>
          <div style={{ background: '#F1F7FD', padding: '1.5rem', borderRadius: '12px', border: '1px solid #DFE8F2' }}>
            <div style={{ width: 34, height: 34, borderRadius: '8px', background: '#2878E5', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '0.75rem' }}>
              1
            </div>
            <h4 style={{ fontSize: '1.05rem', color: '#142B4D', marginBottom: '0.5rem' }}>Semantic Intent & Bayes Classification</h4>
            <p style={{ fontSize: '0.85rem', color: '#52677F', lineHeight: 1.5 }}>
              Tokens are extracted and evaluated via Bayes Theorem to calculate posterior category probabilities P(Category | Keywords).
            </p>
          </div>

          <div style={{ background: '#F1F7FD', padding: '1.5rem', borderRadius: '12px', border: '1px solid #DFE8F2' }}>
            <div style={{ width: 34, height: 34, borderRadius: '8px', background: '#E5A13B', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '0.75rem' }}>
              2
            </div>
            <h4 style={{ fontSize: '1.05rem', color: '#142B4D', marginBottom: '0.5rem' }}>Heuristic FAQ Vector Matching</h4>
            <p style={{ fontSize: '0.85rem', color: '#52677F', lineHeight: 1.5 }}>
              Informed heuristic scoring h(n) compares query tokens against institutional ordinances to surface matching answers immediately.
            </p>
          </div>

          <div style={{ background: '#F1F7FD', padding: '1.5rem', borderRadius: '12px', border: '1px solid #DFE8F2' }}>
            <div style={{ width: 34, height: 34, borderRadius: '8px', background: '#2878E5', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '0.75rem' }}>
              3
            </div>
            <h4 style={{ fontSize: '1.05rem', color: '#142B4D', marginBottom: '0.5rem' }}>Expert System Forward Chaining</h4>
            <p style={{ fontSize: '0.85rem', color: '#52677F', lineHeight: 1.5 }}>
              If premises match official academic rules (e.g. medical condonation between 65%-74%), the system proposes a rule-based resolution with certainty score.
            </p>
          </div>

          <div style={{ background: '#F1F7FD', padding: '1.5rem', borderRadius: '12px', border: '1px solid #DFE8F2' }}>
            <div style={{ width: 34, height: 34, borderRadius: '8px', background: '#16865B', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '0.75rem' }}>
              4
            </div>
            <h4 style={{ fontSize: '1.05rem', color: '#142B4D', marginBottom: '0.5rem' }}>CSP Automated Faculty Assignment</h4>
            <p style={{ fontSize: '0.85rem', color: '#52677F', lineHeight: 1.5 }}>
              Unresolved inquiries are automatically assigned to eligible faculty members using Backtracking with Forward Checking respecting workload constraints.
            </p>
          </div>

          <div style={{ background: '#F1F7FD', padding: '1.5rem', borderRadius: '12px', border: '1px solid #DFE8F2' }}>
            <div style={{ width: 34, height: 34, borderRadius: '8px', background: '#D9383A', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '0.75rem' }}>
              5
            </div>
            <h4 style={{ fontSize: '1.05rem', color: '#142B4D', marginBottom: '0.5rem' }}>Fuzzy Urgency Prioritization</h4>
            <p style={{ fontSize: '0.85rem', color: '#52677F', lineHeight: 1.5 }}>
              Fuzzy membership functions (Low, Medium, High) defuzzify query urgency to ensure critical exam and fee requests receive immediate escalation.
            </p>
          </div>

          <div style={{ background: '#F1F7FD', padding: '1.5rem', borderRadius: '12px', border: '1px solid #DFE8F2' }}>
            <div style={{ width: 34, height: 34, borderRadius: '8px', background: '#16865B', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '0.75rem' }}>
              6
            </div>
            <h4 style={{ fontSize: '1.05rem', color: '#142B4D', marginBottom: '0.5rem' }}>Student Feedback Loop</h4>
            <p style={{ fontSize: '0.85rem', color: '#52677F', lineHeight: 1.5 }}>
              Students rate resolutions as Helpful or Not Helpful, updating the knowledge base certainty metrics for subsequent inquiries.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          AI SYLLABUS MODULES OVERVIEW (MODULES 1–4)
          ========================================================================= */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.5rem auto' }}>
          <div
            style={{
              display: 'inline-block',
              background: '#EBF3FD',
              color: '#2878E5',
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '999px',
              marginBottom: '0.5rem',
              textTransform: 'uppercase'
            }}
          >
            Academic Foundation
          </div>
          <h2 style={{ fontSize: '1.85rem', color: '#142B4D', marginBottom: '0.5rem' }}>
            Complete AI Syllabus Coverage (Modules 1–4)
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#52677F' }}>
            Interactive algorithmic demonstrations built directly into the portal for viva defense and academic demonstration.
          </p>
        </div>

        <div className="grid-2">
          {/* Module 1 */}
          <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2878E5', background: '#EBF3FD', padding: '2px 8px', borderRadius: '6px' }}>
                MODULE 1
              </span>
              <span style={{ fontSize: '0.75rem', color: '#16865B', fontWeight: 600 }}>Implemented</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#142B4D', marginBottom: '0.5rem' }}>
              Problem Solving Methodologies
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#52677F', lineHeight: 1.5, marginBottom: '1rem' }}>
              Uninformed Search (BFS, DFS, Iterative Deepening, Bidirectional Search), Informed Search (Heuristics, Greedy Best-First, A*, AO*), and Constraint Satisfaction Problems (CSP).
            </p>
            <Link to="/ai-lab" className="btn btn-secondary btn-sm" style={{ gap: '0.4rem', color: '#2878E5', borderColor: '#DFE8F2' }}>
              <span>Launch Module 1 Lab</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Module 2 */}
          <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2878E5', background: '#EBF3FD', padding: '2px 8px', borderRadius: '6px' }}>
                MODULE 2
              </span>
              <span style={{ fontSize: '0.75rem', color: '#16865B', fontWeight: 600 }}>Implemented</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#142B4D', marginBottom: '0.5rem' }}>
              Adversarial Search & Classic AI
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#52677F', lineHeight: 1.5, marginBottom: '1rem' }}>
              Minimax Game Trees, Alpha-Beta Pruning, Water-Jug Problem, N-Queens Backtracking, Travelling Salesperson Problem (TSP), Missionaries & Cannibals, and 8-Tiles Sliding Puzzle.
            </p>
            <Link to="/ai-lab" className="btn btn-secondary btn-sm" style={{ gap: '0.4rem', color: '#2878E5', borderColor: '#DFE8F2' }}>
              <span>Launch Module 2 Lab</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Module 3 */}
          <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2878E5', background: '#EBF3FD', padding: '2px 8px', borderRadius: '6px' }}>
                MODULE 3
              </span>
              <span style={{ fontSize: '0.75rem', color: '#16865B', fontWeight: 600 }}>Implemented</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#142B4D', marginBottom: '0.5rem' }}>
              Knowledge Representation & Reasoning
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#52677F', lineHeight: 1.5, marginBottom: '1rem' }}>
              Knowledge Base Rules, Propositional Truth Tables, First-Order Logic (FOL) Relational Predicates, Semantic Networks, Minsky Frames, and complete Expert System Architecture.
            </p>
            <Link to="/ai-lab" className="btn btn-secondary btn-sm" style={{ gap: '0.4rem', color: '#2878E5', borderColor: '#DFE8F2' }}>
              <span>Launch Module 3 Lab</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Module 4 */}
          <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2878E5', background: '#EBF3FD', padding: '2px 8px', borderRadius: '6px' }}>
                MODULE 4
              </span>
              <span style={{ fontSize: '0.75rem', color: '#16865B', fontWeight: 600 }}>Implemented</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#142B4D', marginBottom: '0.5rem' }}>
              Statistical Reasoning & Uncertainty
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#52677F', lineHeight: 1.5, marginBottom: '1rem' }}>
              Probability & Priors, Bayes Theorem Posterior Updater, Certainty Factors (MYCIN), Bayesian Dependency Networks, Dempster-Shafer Theory, and Fuzzy Logic Urgency Defuzzification.
            </p>
            <Link to="/ai-lab" className="btn btn-secondary btn-sm" style={{ gap: '0.4rem', color: '#2878E5', borderColor: '#DFE8F2' }}>
              <span>Launch Module 4 Lab</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          VIVA VOCE BANNER (Soft Sky Blue / White EdTech Styling)
          ========================================================================= */}
      <section
        style={{
          background: 'linear-gradient(135deg, #DCEEFF 0%, #F1F7FD 100%)',
          borderRadius: '16px',
          padding: '2.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid #DFE8F2'
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-block',
              background: '#FFFFFF',
              color: '#2878E5',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '6px',
              marginBottom: '0.5rem'
            }}
          >
            Academic Assessment Ready
          </div>
          <h3 style={{ fontSize: '1.5rem', color: '#142B4D', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            Preparing for Academic Project Evaluation & Viva?
          </h3>
          <p style={{ fontSize: '0.925rem', color: '#52677F', maxWidth: '640px', lineHeight: 1.5 }}>
            Access our dedicated Viva Voce guide containing 30+ detailed Q&As, architecture diagrams, syllabus checklist, and algorithmic complexity matrices.
          </p>
        </div>
        <Link to="/viva" className="btn btn-primary" style={{ fontWeight: 700, padding: '0.8rem 1.6rem' }}>
          <BookOpen size={18} />
          <span>Open Architecture & Viva Guide</span>
          <ChevronRight size={16} />
        </Link>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}
