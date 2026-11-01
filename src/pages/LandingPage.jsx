import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Hero3DVisual } from '../components/common/Hero3DVisual';
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
  ChevronRight,
  UploadCloud,
  Star,
  Activity,
  Send,
  UserCheck,
  Share2,
  ChevronDown,
  ChevronUp,
  Globe,
  Mail
} from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();
  const { queries, openAuthModal, currentUser, setRole } = useApp();

  const [activeFaqIndex, setActiveFaqIndex] = useState(0);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);

  const pendingCount = queries.filter(q => q.status === 'Pending').length;
  const answeredCount = queries.filter(q => q.status === 'Answered').length;
  const resolvedCount = queries.filter(q => q.status === 'Resolved').length;

  const features = [
    {
      icon: <Zap size={24} color="var(--primary)" />,
      title: "Instant Ask",
      desc: "Post academic queries with smart rich-text, priority tags, and anonymous submission options."
    },
    {
      icon: <Cpu size={24} color="var(--primary)" />,
      title: "Smart Routing",
      desc: "Constraint Satisfaction (CSP) and Bayes algorithms match queries to eligible faculty workloads."
    },
    {
      icon: <MessageSquare size={24} color="var(--primary)" />,
      title: "Live Chat Thread",
      desc: "Direct threaded communication between student and mentor with instant resolution remarks."
    },
    {
      icon: <UploadCloud size={24} color="var(--primary)" />,
      title: "File / Image Upload",
      desc: "Drag & drop medical certificates, fee receipts, or hall ticket screenshots with instant previews."
    },
    {
      icon: <Layers size={24} color="var(--primary)" />,
      title: "Track Status Stepper",
      desc: "Follow query lifecycle in real-time: Submitted → Assigned → In Progress → Resolved."
    },
    {
      icon: <Star size={24} color="var(--primary)" />,
      title: "Rate & Feedback",
      desc: "Rate mentor responses with 5-star reviews and feedback to continually improve academic support."
    }
  ];

  const howItWorksSteps = [
    {
      step: "01",
      title: "Submit Query",
      desc: "Choose your category (Academic, Exams, Fees, Hostel), attach receipts or medical notes, and submit."
    },
    {
      step: "02",
      title: "AI Smart Route",
      desc: "SolveHub's intelligent pipeline analyzes keywords, matches regulations, and balances faculty workloads."
    },
    {
      step: "03",
      title: "Mentor Resolution",
      desc: "Assigned professors review the ticket, chat in real-time, and provide official academic resolutions."
    },
    {
      step: "04",
      title: "Rate & Close",
      desc: "Review your official answer, provide 5-star feedback, or reopen if you need further clarification."
    }
  ];

  const testimonials = [
    {
      name: "Ananya Sharma",
      role: "3rd Year, Computer Science",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      rating: 5,
      quote: "My exam hall ticket financial block was resolved within 2 hours. The status stepper made the entire process completely transparent!"
    },
    {
      name: "Prof. Roshni Prasad",
      role: "Faculty Advisor, AI & Data Science",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
      rating: 5,
      quote: "The automated CSP assignment balances student tickets across our department without manual email triage. A massive leap forward for campus ERP."
    },
    {
      name: "Rohan Verma",
      role: "2nd Year, Information Technology",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      rating: 5,
      quote: "Being able to upload medical slips directly and receive verified condonation guidelines in minutes saved me days of running between departments."
    }
  ];

  const faqs = [
    {
      q: "How does SolveHub automatically route student queries?",
      a: "SolveHub utilizes Bayesian probability classification and Constraint Satisfaction Problem (CSP) forward checking. Queries are matched to teachers with available workload slots in the appropriate academic department."
    },
    {
      q: "Can I submit queries anonymously?",
      a: "Yes! Students can enable the 'Ask Anonymously' toggle. Mentors will review and resolve your inquiry without your name or roll number visible."
    },
    {
      q: "What types of attachments are supported?",
      a: "SolveHub supports PDF documents, JPG, and PNG images up to 10 MB per file, ideal for medical certificates, fee challans, and marksheet screenshots."
    },
    {
      q: "What if I'm not satisfied with the mentor's answer?",
      a: "You can click 'Reopen Query' with additional remarks, or rate the resolution and escalate the ticket directly to the Department Head or Admin."
    }
  ];

  return (
    <div className="page-wrapper" style={{ paddingBottom: '4rem' }}>
      {/* =========================================================================
          1. HERO SECTION ("ASK. SOLVE. GROW.")
          ========================================================================= */}
      <section
        className="glass-card"
        style={{
          padding: '4rem 3rem',
          marginBottom: '3rem',
          overflow: 'hidden',
          background: 'var(--bg-card)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.15fr 0.85fr',
            gap: '3rem',
            alignItems: 'center'
          }}
          className="hero-grid"
        >
          {/* Left Column: Huge Headline & CTAs */}
          <div>
            {/* Pill Tag */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--primary-light)',
                border: '1px solid var(--border-accent)',
                color: 'var(--primary)',
                padding: '0.45rem 1.15rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.825rem',
                fontWeight: 700,
                marginBottom: '1.5rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}
            >
              <Sparkles size={16} />
              <span>Next-Gen Student Resolution Ecosystem</span>
            </div>

            {/* Giant Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.8rem, 5.2vw, 4.4rem)',
                lineHeight: 1.08,
                marginBottom: '1.35rem',
                fontWeight: 800,
                fontFamily: 'var(--font-heading)',
                letterSpacing: '-0.04em'
              }}
            >
              ASK. SOLVE.{' '}
              <span
                style={{
                  background: 'var(--accent-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                GROW.
              </span>
            </h1>

            {/* Subtext */}
            <p
              style={{
                fontSize: '1.15rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
                marginBottom: '2.25rem',
                maxWidth: '560px',
                fontWeight: 500
              }}
            >
              The unified glassmorphism query resolution platform connecting students, mentors, and administrators. Auto-categorize inquiries, get expert responses, and accelerate academic success.
            </p>

            {/* Action CTAs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.25rem' }}>
              <Link to="/ask" className="btn btn-primary btn-lg btn-pill">
                <PlusCircle size={20} />
                <span>Ask a Query</span>
                <ArrowRight size={18} />
              </Link>

              <button
                onClick={() => {
                  setRole('faculty');
                  openAuthModal('login');
                }}
                className="btn btn-secondary btn-lg btn-pill"
              >
                <Users size={20} color="var(--primary)" />
                <span>Become a Mentor</span>
              </button>
            </div>

            {/* Social Proof Avatars & Tag */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                  alt="Student"
                  style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid var(--bg-card)', objectFit: 'cover' }}
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                  alt="Student"
                  style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid var(--bg-card)', marginLeft: '-10px', objectFit: 'cover' }}
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80"
                  alt="Student"
                  style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid var(--bg-card)', marginLeft: '-10px', objectFit: 'cover' }}
                />
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80"
                  alt="Student"
                  style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid var(--bg-card)', marginLeft: '-10px', objectFit: 'cover' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B' }}>
                  <Star size={14} fill="#F59E0B" />
                  <Star size={14} fill="#F59E0B" />
                  <Star size={14} fill="#F59E0B" />
                  <Star size={14} fill="#F59E0B" />
                  <Star size={14} fill="#F59E0B" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', marginLeft: '4px' }}>4.9/5</span>
                </div>
                <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  5,000+ doubts solved across 12 departments
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Glossy Objects Visual */}
          <div>
            <Hero3DVisual />
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. STATS STRIP
          ========================================================================= */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div className="grid-4">
          <div className="glass-card" style={{ padding: '1.75rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--primary)', marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
              <TrendingUp size={28} />
            </div>
            <h3 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
              12,450+
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Queries Solved</p>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--warning)', marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
              <Clock size={28} />
            </div>
            <h3 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
              2.4 hrs
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Avg Response Time</p>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--success)', marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
              <UserCheck size={28} />
            </div>
            <h3 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
              180+
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Mentors</p>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--primary)', marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
              <Star size={28} fill="currentColor" />
            </div>
            <h3 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
              98.6%
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Satisfaction Score</p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. FEATURES GRID (6 Glass Cards)
          ========================================================================= */}
      <section id="features" style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem auto' }}>
          <div
            style={{
              display: 'inline-block',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '4px 14px',
              borderRadius: 'var(--radius-full)',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}
          >
            Engineered for Campus Speed
          </div>
          <h2 style={{ fontSize: '2.3rem', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>
            Everything You Need for Seamless Resolution
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            Designed from the ground up for modern university students, mentors, and administrators.
          </p>
        </div>

        <div className="grid-3" style={{ gap: '1.75rem' }}>
          {features.map((f, idx) => (
            <div key={idx} className="glass-card glass-card-interactive" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  border: '1px solid var(--border-accent)'
                }}
              >
                {f.icon}
              </div>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.65rem', fontFamily: 'var(--font-heading)' }}>
                {f.title}
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          4. HOW IT WORKS (4-Step Horizontal Timeline)
          ========================================================================= */}
      <section id="how-it-works" className="glass-card" style={{ padding: '3.5rem 2.5rem', marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
          <div
            style={{
              display: 'inline-block',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '4px 14px',
              borderRadius: 'var(--radius-full)',
              marginBottom: '0.75rem',
              textTransform: 'uppercase'
            }}
          >
            Transparent Flow
          </div>
          <h2 style={{ fontSize: '2.3rem', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>
            How SolveHub Resolves Your Query in 4 Steps
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            No red tape, no endless queues. Every grievance is tracked from start to finish.
          </p>
        </div>

        <div className="grid-4" style={{ gap: '1.5rem', position: 'relative' }}>
          {howItWorksSteps.map((step, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                border: '1px solid var(--border)',
                position: 'relative'
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'var(--primary)',
                  marginBottom: '0.75rem'
                }}
              >
                {step.step}
              </div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                {step.title}
              </h4>
              <p style={{ fontSize: '0.865rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          5. TESTIMONIALS CAROUSEL
          ========================================================================= */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem auto' }}>
          <h2 style={{ fontSize: '2.1rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            Loved by Students & Faculty
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
            See how SolveHub transforms campus support every single day.
          </p>
        </div>

        <div className="grid-3" style={{ gap: '1.75rem' }}>
          {testimonials.map((t, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', gap: '3px', color: '#F59E0B', marginBottom: '1.25rem' }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#F59E0B" />
                  ))}
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                  "{t.quote}"
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <img
                  src={t.avatar}
                  alt={t.name}
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-accent)' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-primary)' }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          6. FAQ ACCORDION
          ========================================================================= */}
      <section id="faq" style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem auto' }}>
          <h2 style={{ fontSize: '2.1rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Quick answers about query submission, mentor assignment, and privacy.
          </p>
        </div>

        <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                transition: 'all var(--transition-fast)'
              }}
            >
              <button
                type="button"
                onClick={() => setActiveFaqIndex(activeFaqIndex === idx ? -1 : idx)}
                style={{
                  width: '100%',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.05rem',
                  fontWeight: 700
                }}
              >
                <span>{faq.q}</span>
                {activeFaqIndex === idx ? <ChevronUp size={18} color="var(--primary)" /> : <ChevronDown size={18} />}
              </button>

              {activeFaqIndex === idx && (
                <div style={{ padding: '0 1.5rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          7. FINAL CTA BANNER
          ========================================================================= */}
      <section
        className="glass-card"
        style={{
          padding: '3.5rem 2.5rem',
          textAlign: 'center',
          borderRadius: 'var(--radius-card)',
          background: 'var(--accent-gradient)',
          color: '#060D09',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '3rem'
        }}
      >
        <div style={{ maxWidth: '680px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', marginBottom: '1rem', color: '#060D09', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            Ready to resolve your academic queries in minutes?
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(6, 13, 9, 0.85)', marginBottom: '2rem', lineHeight: 1.6, fontWeight: 600 }}>
            Join thousands of students and professors already using SolveHub for instant academic grievance resolution.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/ask"
              className="btn btn-pill"
              style={{
                background: '#060D09',
                color: '#ffffff',
                padding: '0.85rem 2rem',
                fontSize: '1.05rem',
                boxShadow: '0 4px 18px rgba(0, 0, 0, 0.35)'
              }}
            >
              <PlusCircle size={20} color="#B6F36B" />
              <span>Ask a Query Now</span>
            </Link>

            <Link
              to="/ai-lab"
              className="btn btn-pill"
              style={{
                background: 'rgba(255, 255, 255, 0.85)',
                color: '#060D09',
                padding: '0.85rem 2rem',
                fontSize: '1.05rem',
                border: '1px solid rgba(0, 0, 0, 0.1)'
              }}
            >
              <Cpu size={20} />
              <span>Explore AI Lab</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. FOOTER WITH SOCIALS
          ========================================================================= */}
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          fontSize: '0.85rem',
          color: 'var(--text-muted)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#060D09',
              fontWeight: 800,
              fontSize: '0.75rem'
            }}
          >
            SH
          </div>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            SolveHub Platform
          </span>
          <span>© 2026. All academic rights reserved.</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</Link>
          <Link to="/" style={{ color: 'var(--text-secondary)' }}>Campus Terms</Link>
          <Link to="/viva" style={{ color: 'var(--text-secondary)' }}>Viva Defense Docs</Link>
          <a href="https://github.com/manikant-07/student-query-resolution-system" target="_blank" rel="noreferrer" style={{ color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center' }} title="GitHub Repository">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>
        </div>
      </footer>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
