import { initialFAQs } from '../data/initialFAQs';
import { knowledgeRules } from '../data/knowledgeRules';

// Stopwords for academic text cleaning
const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
  'to', 'was', 'were', 'will', 'with', 'i', 'my', 'me', 'we', 'our',
  'can', 'please', 'help', 'have', 'do', 'does', 'did', 'this', 'there'
]);

/**
 * Tokenize and normalize input string
 */
export function tokenizeText(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2 && !STOPWORDS.has(token));
}

/**
 * Transparent Heuristic Keyword Relevance Score
 * Returns score between 0.0 and 1.0 based on Jaccard/Dice overlap
 */
export function calculateKeywordRelevance(queryTokens, targetKeywords) {
  if (!queryTokens.length || !targetKeywords.length) return 0;
  
  const targetSet = new Set(targetKeywords.map(k => k.toLowerCase()));
  let matchCount = 0;

  for (const token of queryTokens) {
    if (targetSet.has(token)) {
      matchCount += 1;
    } else {
      // Partial prefix/substring match check
      for (const kw of targetSet) {
        if (kw.includes(token) || token.includes(kw)) {
          matchCount += 0.5;
          break;
        }
      }
    }
  }

  // Jaccard-like normalized similarity
  const totalTokens = Math.max(queryTokens.length, targetSet.size);
  const score = Math.min(1.0, (matchCount * 1.5) / totalTokens);
  return Number(score.toFixed(2));
}

/**
 * Find matching FAQs given a query text and category
 */
export function matchFAQs(querySubject, queryDesc, selectedCategory, faqs = initialFAQs) {
  const combinedText = `${querySubject} ${queryDesc}`;
  const tokens = tokenizeText(combinedText);

  const scoredFaqs = faqs.map(faq => {
    let score = calculateKeywordRelevance(tokens, faq.keywords);
    // Category match boost
    if (selectedCategory && faq.category.toLowerCase() === selectedCategory.toLowerCase()) {
      score = Math.min(1.0, score + 0.25);
    }
    return {
      ...faq,
      relevanceScore: Number(score.toFixed(2))
    };
  });

  // Sort descending by relevance
  return scoredFaqs
    .filter(f => f.relevanceScore > 0.15)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * Bayesian Category Estimation: P(Category | Tokens)
 * Prior distribution estimated from typical student inquiries
 */
export const CATEGORY_PRIORS = {
  Attendance: 0.30,
  Exams: 0.25,
  Fees: 0.18,
  Timetable: 0.12,
  Technical: 0.10,
  Hostel: 0.05
};

export const CATEGORY_KEYWORDS = {
  Attendance: ['attendance', 'shortage', 'medical', 'hospital', 'condonation', 'leave', 'percentage', 'detention'],
  Exams: ['exam', 'hall', 'ticket', 'admit', 'card', 'marks', 're-evaluation', 'grade', 'backlog', 'mid-term'],
  Fees: ['fee', 'tuition', 'installment', 'late', 'payment', 'challan', 'receipt', 'due', 'scholarship'],
  Timetable: ['timetable', 'slot', 'clash', 'elective', 'reschedule', 'overlap', 'lecture', 'timing'],
  Technical: ['wifi', 'network', 'login', 'portal', 'password', 'erp', 'error', 'radius', 'server'],
  Hostel: ['hostel', 'room', 'mess', 'warden', 'gate', 'pass', 'curfew', 'bed']
};

/**
 * Calculates posterior probability for each category given query text
 */
export function calculateBayesianCategory(text) {
  const tokens = tokenizeText(text);
  if (!tokens.length) {
    return Object.entries(CATEGORY_PRIORS).map(([cat, prior]) => ({
      category: cat,
      probability: prior,
      prior,
      likelihood: 0.5
    }));
  }

  const rawLikelihoods = {};
  let totalLikelihoodPriorProduct = 0;

  for (const [category, prior] of Object.entries(CATEGORY_PRIORS)) {
    const kws = CATEGORY_KEYWORDS[category] || [];
    let matches = 0;
    tokens.forEach(tok => {
      if (kws.some(kw => kw.includes(tok) || tok.includes(kw))) {
        matches++;
      }
    });

    // Laplace smoothing: (matches + 1) / (tokens.length + vocabSize)
    const likelihood = (matches + 1) / (tokens.length + kws.length);
    rawLikelihoods[category] = likelihood;
    totalLikelihoodPriorProduct += likelihood * prior;
  }

  // Normalize to get posterior P(Cat|Text)
  const results = Object.entries(CATEGORY_PRIORS).map(([category, prior]) => {
    const likelihood = rawLikelihoods[category];
    const posterior = (likelihood * prior) / (totalLikelihoodPriorProduct || 1);
    return {
      category,
      probability: Number(posterior.toFixed(3)),
      prior: Number(prior.toFixed(2)),
      likelihood: Number(likelihood.toFixed(3))
    };
  });

  return results.sort((a, b) => b.probability - a.probability);
}

/**
 * Expert System Rule Matching Engine
 * Evaluates working memory against knowledge base rules
 */
export function evaluateExpertRules(query) {
  const fullText = `${query.subject || ''} ${query.description || ''}`.toLowerCase();
  const category = query.category;

  for (const rule of knowledgeRules) {
    let match = false;

    if (rule.code === 'RULE_ATTENDANCE_MEDICAL_CONDONATION') {
      if (
        (category === 'Attendance' || fullText.includes('attendance')) &&
        (fullText.includes('medical') || fullText.includes('hospital') || fullText.includes('fever') || fullText.includes('condonation'))
      ) {
        match = true;
      }
    } else if (rule.code === 'RULE_ATTENDANCE_CRITICAL_DETENTION') {
      if (
        (category === 'Attendance' || fullText.includes('attendance')) &&
        (fullText.includes('detention') || fullText.includes('below 65') || fullText.includes('detained'))
      ) {
        match = true;
      }
    } else if (rule.code === 'RULE_EXAM_FEE_HOLD') {
      if (
        (category === 'Exams' || fullText.includes('hall ticket') || fullText.includes('admit card')) &&
        (fullText.includes('fee') || fullText.includes('403') || fullText.includes('financial') || fullText.includes('clearance'))
      ) {
        match = true;
      }
    } else if (rule.code === 'RULE_TIMETABLE_ELECTIVE_CLASH') {
      if (
        category === 'Timetable' ||
        fullText.includes('clash') ||
        fullText.includes('overlap') ||
        (fullText.includes('slot') && fullText.includes('elective'))
      ) {
        match = true;
      }
    } else if (rule.code === 'RULE_FEE_INSTALLMENT_POLICY') {
      if (
        (category === 'Fees' || fullText.includes('fee')) &&
        (fullText.includes('installment') || fullText.includes('partial') || fullText.includes('half'))
      ) {
        match = true;
      }
    } else if (rule.code === 'RULE_NETWORK_RADIUS_TIMEOUT') {
      if (
        category === 'Technical' ||
        fullText.includes('wifi') ||
        fullText.includes('radius') ||
        fullText.includes('authentication')
      ) {
        match = true;
      }
    }

    if (match) {
      return {
        ruleFired: rule.code,
        ruleTitle: rule.premises[0],
        conclusion: rule.conclusion,
        action: rule.action,
        domain: rule.domain,
        certaintyScore: rule.confidenceFactor,
        explanation: `Rule ${rule.code} fired from Knowledge Base: Verified match between input premises and domain policy.`
      };
    }
  }

  // Fallback heuristic suggestion
  return {
    ruleFired: 'DEFAULT_HEURISTIC_SEARCH',
    ruleTitle: 'General Academic Query Evaluation',
    conclusion: 'Your inquiry has been categorized and forwarded to the designated academic department desk.',
    action: 'Wait for faculty reply or inspect related FAQ entries below.',
    domain: 'General Academic Procedures',
    certaintyScore: 0.70,
    explanation: 'No deterministic rule matched all premises. Forwarded as a standard ticket with preliminary relevance scoring.'
  };
}

/**
 * Certainty Factor calculation (MYCIN formula)
 * CF = MB - MD where MB is Measure of Belief, MD is Measure of Disbelief
 */
export function calculateCertaintyFactor(evidenceMatches, contradictions = 0) {
  const MB = Math.min(1.0, evidenceMatches * 0.25);
  const MD = Math.min(1.0, contradictions * 0.4);
  const CF = Number((MB - MD).toFixed(2));
  return {
    MB: Number(MB.toFixed(2)),
    MD: Number(MD.toFixed(2)),
    CF: Math.max(-1.0, Math.min(1.0, CF))
  };
}
