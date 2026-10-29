import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, HelpCircle, ChevronDown, ChevronUp, BookOpen, Tag } from 'lucide-react';

export function FAQSection() {
  const { faqs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const categories = ['All', 'Attendance', 'Exams', 'Fees', 'Timetable', 'Technical', 'Hostel'];

  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchCat = selectedCategory === 'All' || faq.category === selectedCategory;
      const term = searchTerm.toLowerCase();
      const matchText = !searchTerm ||
        faq.question.toLowerCase().includes(term) ||
        faq.answer.toLowerCase().includes(term) ||
        (faq.keywords && faq.keywords.some(k => k.toLowerCase().includes(term)));
      return matchCat && matchText;
    });
  }, [faqs, searchTerm, selectedCategory]);

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle size={20} color="#2563eb" />
            <h3 style={{ fontSize: '1.25rem', color: '#0f172a' }}>
              Academic FAQ Knowledge Base
            </h3>
          </div>
          <p style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '2px' }}>
            Searchable institutional guidelines, exam directives, and attendance ordinances.
          </p>
        </div>

        {/* Search input */}
        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
            placeholder="Search FAQs by question or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '0.45rem', overflowX: 'auto', paddingBottom: '0.65rem', marginBottom: '1rem' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '999px',
              border: selectedCategory === cat ? '1px solid #2563eb' : '1px solid #e2e8f0',
              background: selectedCategory === cat ? '#2563eb' : '#ffffff',
              color: selectedCategory === cat ? '#ffffff' : '#475569',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 150ms'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {filteredFaqs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontSize: '0.9rem' }}>
            No matching FAQs found for "{searchTerm}".
          </div>
        ) : (
          filteredFaqs.map(faq => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  background: isExpanded ? '#f8fafc' : '#ffffff',
                  overflow: 'hidden',
                  transition: 'background 150ms'
                }}
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  style={{
                    padding: '0.9rem 1.15rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        background: '#eff6ff',
                        color: '#2563eb',
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}
                    >
                      {faq.category}
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>
                      {faq.question}
                    </span>
                  </div>
                  <div style={{ color: '#94a3b8' }}>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ padding: '0 1.15rem 1rem 1.15rem', borderTop: '1px solid #edf2f7', paddingTop: '0.75rem' }}>
                    <p style={{ fontSize: '0.885rem', color: '#334155', lineHeight: 1.6 }}>
                      {faq.answer}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem', fontSize: '0.75rem', color: '#64748b' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <BookOpen size={13} color="#2563eb" />
                        Reference: <strong>{faq.policyRef || 'Academic Handbook'}</strong>
                      </span>
                      {faq.keywords && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Tag size={12} />
                          <span>Keywords: {faq.keywords.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
