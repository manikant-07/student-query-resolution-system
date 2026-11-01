import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  BookOpen,
  Calendar,
  CreditCard,
  Building,
  GraduationCap
} from 'lucide-react';

export function FAQPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openItems, setOpenItems] = useState({ 0: true });

  const categories = [
    { id: 'All', label: 'All FAQs' },
    { id: 'Attendance', label: 'Attendance & Leave', icon: <Calendar size={14} /> },
    { id: 'Exams', label: 'Examinations & Hall Tickets', icon: <BookOpen size={14} /> },
    { id: 'Fees', label: 'Fees & Scholarships', icon: <CreditCard size={14} /> },
    { id: 'Hostel', label: 'Hostel & Facilities', icon: <Building size={14} /> },
    { id: 'Academic', label: 'Academic & Electives', icon: <GraduationCap size={14} /> }
  ];

  const faqs = [
    {
      category: 'Attendance',
      q: 'What is the minimum attendance requirement to appear in semester exams?',
      a: 'As per academic regulations, students must maintain a minimum of 75% aggregate attendance across all courses. If attendance is between 65% and 75% due to medical reasons, condonation can be applied for by submitting certified medical documents and HOD approval via the SolveHub portal at least 7 days before exams.'
    },
    {
      category: 'Attendance',
      q: 'How do I submit medical certificates for attendance condonation?',
      a: 'Submit a new query under "Attendance" category with "Urgent" priority. Attach a single PDF containing your doctor certificate, hospital discharge summary (if applicable), and medical fitness certificate. The Dean of Student Welfare will review and update your attendance status.'
    },
    {
      category: 'Exams',
      q: 'Why am I getting "Financial Clearance Required" when downloading my Hall Ticket?',
      a: 'This error occurs if your fee payment status has not yet synced from the bank gateway to the ERP. Please ensure you have cleared all semester dues. If payment was made within the last 48 hours, raise a query with your transaction receipt PDF under the "Exams" or "Fees" category for immediate manual clearance.'
    },
    {
      category: 'Exams',
      q: 'What should I do if two elective exam dates clash on the mid-term timetable?',
      a: 'Immediately submit a query under the "Exams" category selecting "High" priority. State both course codes and your branch. SolveHub’s automated scheduling engine (CSP-based) flags timetable collisions to the Examination Cell for timely reshuffling.'
    },
    {
      category: 'Fees',
      q: 'How can I obtain a fee receipt for education loan or income tax rebate?',
      a: 'Official fee receipts with college seal and digital signature are generated automatically in the Student Accounts Portal. If you require a custom expenditure certificate or verification stamp, raise a query under the "Fees" category with your student ID.'
    },
    {
      category: 'Hostel',
      q: 'How do I request hostel room maintenance or Wi-Fi connectivity resolution?',
      a: 'Raise a ticket under "Hostel & Facilities". Specify your hostel block, room number, and detailed description of the issue. The Estate Officer and resident warden typically resolve basic maintenance within 24–48 hours.'
    },
    {
      category: 'Academic',
      q: 'Can I change my open elective course after the semester has commenced?',
      a: 'Open elective switches are permitted strictly within the first two weeks of semester commencement, subject to seat availability in the requested course. Raise a query with your preferred elective and approval from your faculty mentor.'
    }
  ];

  const filteredFaqs = faqs.filter(f => {
    const matchCat = activeCategory === 'All' || f.category === activeCategory;
    const matchSearch = !search || 
      f.q.toLowerCase().includes(search.toLowerCase()) || 
      f.a.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleItem = (idx) => {
    setOpenItems(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div 
        className="glass-card" 
        style={{ 
          padding: '2.5rem 2rem', 
          textAlign: 'center', 
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div 
          style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '20px', 
            background: 'var(--primary-glow)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1.25rem' 
          }}
        >
          <HelpCircle size={30} color="var(--primary)" />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
          Frequently Asked Questions
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '0.5rem', maxWidth: '580px', margin: '0.5rem auto 0' }}>
          Find fast answers to common questions about attendance, exams, fees, scholarships, and academic guidelines.
        </p>

        {/* Search input */}
        <div style={{ maxWidth: '540px', margin: '1.75rem auto 0', position: 'relative' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search keywords (e.g., hall ticket, attendance, fee receipt)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              paddingLeft: '44px', 
              borderRadius: '9999px', 
              fontSize: '0.925rem',
              height: '48px',
              boxShadow: 'var(--shadow-sm)'
            }}
          />
        </div>
      </div>

      {/* Category Pills */}
      <div 
        style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          overflowX: 'auto', 
          paddingBottom: '0.5rem', 
          marginBottom: '2rem' 
        }}
      >
        {categories.map(c => {
          const isActive = activeCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                borderRadius: '9999px',
                border: isActive ? '1px solid var(--primary)' : '1px solid var(--border)',
                background: isActive ? 'var(--primary)' : 'var(--bg-card)',
                color: isActive ? 'var(--bg-main)' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              {c.icon}
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* FAQ Accordion List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openItems[idx];
          return (
            <div
              key={idx}
              className="glass-card"
              style={{
                borderRadius: '18px',
                overflow: 'hidden',
                border: isOpen ? '1px solid var(--primary-glow)' : '1px solid var(--border)',
                transition: 'all 0.25s ease'
              }}
            >
              <button
                onClick={() => toggleItem(idx)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.25rem 1.75rem',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '999px',
                      background: 'var(--bg-glass-heavy)',
                      color: 'var(--primary)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    {faq.category}
                  </span>
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {faq.q}
                  </span>
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                  {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              {isOpen && (
                <div
                  style={{
                    padding: '0 1.75rem 1.35rem 1.75rem',
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    borderTop: '1px solid var(--border)',
                    paddingTop: '1rem'
                  }}
                >
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              No matching questions found for "{search}". Try searching another phrase or ask our mentors directly.
            </p>
          </div>
        )}
      </div>

      {/* Still need help CTA */}
      <div
        className="glass-card"
        style={{
          padding: '2.5rem',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--primary-glow) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          border: '1px solid var(--primary-glow)'
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--primary-glow)', padding: '4px 12px', borderRadius: '999px', marginBottom: '0.75rem' }}>
            <Sparkles size={14} color="var(--primary)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>Direct Faculty Escalation</span>
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
            Can't find an answer to your specific situation?
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '520px' }}>
            Submit an official ticket to get direct assistance from your assigned department mentor or Dean.
          </p>
        </div>

        <button
          onClick={() => navigate('/ask')}
          className="btn btn-primary btn-lg"
          style={{ gap: '0.65rem' }}
        >
          <span>Ask a Question</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

