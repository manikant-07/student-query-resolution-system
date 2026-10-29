/**
 * Knowledge Representation, Logic & Statistical Reasoning (Modules 3 & 4)
 * Real algorithmic implementations and utilities for:
 * - Propositional Logic evaluation & truth tables
 * - First-Order Logic (FOL) domain predicate evaluation
 * - Semantic Network relationship mapping
 * - Structured Minsky Frames
 * - Expert System Architecture
 * - Dempster-Shafer Evidence Combination
 * - Fuzzy Logic membership curves & defuzzification
 */

/* ==========================================================================
   Module 3: Knowledge Representation & Reasoning
   ========================================================================== */

/**
 * 1. Propositional Logic Evaluator
 * Evaluates binary proposition formulas with truth table generator
 */
export function evaluateProposition(p, q, operator) {
  switch (operator) {
    case "AND":
      return p && q;
    case "OR":
      return p || q;
    case "NOT_P":
      return !p;
    case "IMPLIES": // P -> Q is equivalent to (!P || Q)
      return !p || q;
    case "BICONDITIONAL": // P <-> Q is equivalent to (P === Q)
      return p === q;
    default:
      return false;
  }
}

export function generateTruthTable(operator = "IMPLIES") {
  const rows = [
    { p: true, q: true },
    { p: true, q: false },
    { p: false, q: true },
    { p: false, q: false }
  ];

  return rows.map(r => ({
    p: r.p ? "T" : "F",
    q: r.q ? "T" : "F",
    result: evaluateProposition(r.p, r.q, operator) ? "T" : "F"
  }));
}

/**
 * 2. First-Order Logic (FOL) Knowledge Base
 */
export const folKnowledgeBase = {
  students: ["Manikant", "Ananya", "Rohan"],
  courses: ["CS-201 (AI)", "CS-202 (DSA)", "CS-203 (DBMS)"],
  faculty: ["Prof. Rajesh Sharma", "Dr. Vikram Seth", "Prof. Priya Nair"],

  // Predicates: Enrolled(Student, Course)
  enrollments: [
    { student: "Manikant", course: "CS-201 (AI)", attendance: 68 },
    { student: "Manikant", course: "CS-202 (DSA)", attendance: 82 },
    { student: "Ananya", course: "CS-201 (AI)", attendance: 85 },
    { student: "Rohan", course: "CS-203 (DBMS)", attendance: 71 }
  ],

  // Predicate: Teaches(Faculty, Course)
  teaches: [
    { faculty: "Prof. Rajesh Sharma", course: "CS-201 (AI)" },
    { faculty: "Dr. Vikram Seth", course: "CS-202 (DSA)" },
    { faculty: "Prof. Priya Nair", course: "CS-203 (DBMS)" }
  ],

  // Rule 1: ∀x, ∀c [Enrolled(x, c) ∧ Attendance(x, c) < 75 ⇒ EligibleForCondonation(x, c)]
  checkCondonationEligibility(studentName) {
    return this.enrollments.filter(e => e.student === studentName && e.attendance >= 65 && e.attendance < 75);
  },

  // Rule 2: ∀f, ∀c, ∀x [Teaches(f, c) ∧ Enrolled(x, c) ⇒ AssignedResolver(f, x, c)]
  getCourseInstructor(courseName) {
    const record = this.teaches.find(t => t.course === courseName);
    return record ? record.faculty : "Unassigned Faculty";
  }
};

/**
 * 3. Semantic Network Nodes and Relations
 */
export const semanticNetworkData = {
  nodes: [
    { id: "Student", label: "Student Entity", type: "class", description: "Enrolled scholar submitting queries" },
    { id: "Manikant", label: "Student: Manikant", type: "instance", description: "Roll: 23AI-104" },
    { id: "Query", label: "Academic Query", type: "class", description: "Formal request for issue resolution" },
    { id: "QRY-1001", label: "Query: QRY-1001", type: "instance", description: "Attendance Shortage in AI Lab" },
    { id: "Course", label: "Course Entity", type: "class", description: "Departmental Subject" },
    { id: "CS201", label: "Course: CS-201 (AI)", type: "instance", description: "AI & ML Theory & Lab" },
    { id: "Faculty", label: "Faculty Entity", type: "class", description: "Academic mentor and resolver" },
    { id: "ProfSharma", label: "Prof. Rajesh Sharma", type: "instance", description: "HOD AI & Data Science" },
    { id: "Department", label: "Department: AI & DS", type: "instance", description: "Hosting department" },
    { id: "Answer", label: "Condonation Policy Form AC-4", type: "instance", description: "Verified institutional resolution" }
  ],
  edges: [
    { from: "Manikant", to: "Student", relation: "IS-A" },
    { from: "QRY-1001", to: "Query", relation: "IS-A" },
    { from: "Manikant", to: "QRY-1001", relation: "SUBMITS" },
    { from: "QRY-1001", to: "CS201", relation: "REGARDS_COURSE" },
    { from: "CS201", to: "Course", relation: "IS-A" },
    { from: "ProfSharma", to: "CS201", relation: "TEACHES" },
    { from: "ProfSharma", to: "Faculty", relation: "IS-A" },
    { from: "ProfSharma", to: "Department", relation: "BELONGS_TO" },
    { from: "ProfSharma", to: "QRY-1001", relation: "ASSIGNED_TO_RESOLVE" },
    { from: "QRY-1001", to: "Answer", relation: "RESOLVED_BY" }
  ]
};

/**
 * 4. Minsky Frames Structure
 */
export const academicFrames = {
  StudentFrame: {
    name: "Frame: Student (Generic)",
    slots: [
      { slot: "Inherits-From", value: "Person", facet: "Static" },
      { slot: "Enrollment-Status", value: "Active", facet: "Default" },
      { slot: "Min-Required-Attendance", value: "75%", facet: "Mandatory Policy" },
      { slot: "Permitted-Query-Limit", value: "10 active tickets", facet: "Constraint" }
    ]
  },
  QueryFrame: {
    name: "Frame: Query (Generic)",
    slots: [
      { slot: "Inherits-From", value: "Academic-Event", facet: "Static" },
      { slot: "Default-Status", value: "Pending", facet: "Default" },
      { slot: "Max-Resolution-SLA", value: "48 Business Hours", facet: "Policy" },
      { slot: "Auto-Assigned-Department", value: "Triggered on category match", facet: "Procedural Attachment" }
    ]
  },
  SpecificQueryInstance: {
    name: "Instance: QRY-1001 (Attendance Condonation)",
    slots: [
      { slot: "Instance-Of", value: "QueryFrame", facet: "Specialization" },
      { slot: "Submitter", value: "Manikant Kumar (23AI-104)", facet: "Filled Slot" },
      { slot: "Category", value: "Attendance", facet: "Filled Slot" },
      { slot: "Current-Attendance", value: "68%", facet: "Filled Slot" },
      { slot: "Action-Rule", value: "RULE_ATTENDANCE_MEDICAL_CONDONATION", facet: "Inferred Slot" }
    ]
  }
};

/**
 * 5. Architecture of an Expert System
 */
export const expertSystemArchitecture = [
  {
    id: "UI",
    name: "User Interface",
    role: "Facilitates natural interaction for student query submission and faculty review.",
    status: "Active",
    badge: "Implemented"
  },
  {
    id: "InferenceEngine",
    name: "Inference Engine",
    role: "Executes forward and backward chaining against premises to derive valid conclusions.",
    status: "Active",
    badge: "Implemented"
  },
  {
    id: "WorkingMemory",
    name: "Working Memory",
    role: "Temporarily holds active facts, tokenized keywords, and input conditions of the query.",
    status: "Active",
    badge: "Implemented"
  },
  {
    id: "KnowledgeBase",
    name: "Knowledge Base",
    role: "Stores declarative academic policies, ordinances, heuristics, and conditional rules.",
    status: "Active",
    badge: "Implemented"
  },
  {
    id: "ExplanationFacility",
    name: "Explanation Facility",
    role: "Explains 'HOW' and 'WHY' a particular suggested answer or condonation rule was fired.",
    status: "Active",
    badge: "Implemented"
  },
  {
    id: "KnowledgeAcquisition",
    name: "Knowledge Acquisition Module",
    role: "Allows faculty to add new FAQ answers and update resolution policies dynamically.",
    status: "Active",
    badge: "Implemented"
  }
];

/* ==========================================================================
   Module 4: Statistical Reasoning
   ========================================================================== */

/**
 * Dempster-Shafer Theory Evidence Combination
 * Frame of Discernment Theta = { Attendance, Exams, Fees }
 * Computes Belief Bel(A) and Plausibility Pl(A) from two evidence sources
 */
export function combineDempsterShafer(m1, m2) {
  // m1: Evidence from Keyword Parser (e.g. { Attendance: 0.6, Exams: 0.2, Theta: 0.2 })
  // m2: Evidence from Historical Student Profile (e.g. { Attendance: 0.5, Fees: 0.2, Theta: 0.3 })
  
  // Conflict K = sum of masses where intersection is empty
  // For demonstration: intersection of distinct singletons is empty
  const conflict = (m1.Attendance * m2.Exams) + (m1.Attendance * m2.Fees) +
                   (m1.Exams * m2.Attendance) + (m1.Exams * m2.Fees) +
                   (m1.Fees * m2.Attendance) + (m1.Fees * m2.Exams);

  const denom = 1 - conflict;

  // Combined mass for Attendance
  const mCombinedAttendance = (
    (m1.Attendance * m2.Attendance) +
    (m1.Attendance * m2.Theta) +
    (m1.Theta * m2.Attendance)
  ) / (denom || 1);

  // Combined mass for Exams
  const mCombinedExams = (
    (m1.Exams * m2.Exams) +
    (m1.Exams * m2.Theta) +
    (m1.Theta * m2.Exams)
  ) / (denom || 1);

  // Combined uncertainty mass (Theta)
  const mCombinedTheta = (m1.Theta * m2.Theta) / (denom || 1);

  // Belief Bel(Attendance) = m(Attendance)
  // Plausibility Pl(Attendance) = 1 - Bel(not Attendance) = m(Attendance) + m(Theta)
  const belAttendance = Number(mCombinedAttendance.toFixed(3));
  const plAttendance = Number((mCombinedAttendance + mCombinedTheta).toFixed(3));

  return {
    conflict: Number(conflict.toFixed(3)),
    combinedAttendance: belAttendance,
    combinedExams: Number(mCombinedExams.toFixed(3)),
    combinedUncertainty: Number(mCombinedTheta.toFixed(3)),
    belief: belAttendance,
    plausibility: plAttendance,
    uncertaintyInterval: Number((plAttendance - belAttendance).toFixed(3))
  };
}

/**
 * Fuzzy Logic Priority Inference
 * Input: Urgency Score x in [0, 100]
 * Output: Fuzzy memberships for Low, Medium, High + Centroid Defuzzification
 */
export function evaluateFuzzyPriority(urgencyScore) {
  const x = Math.max(0, Math.min(100, urgencyScore));

  // 1. Triangular / Trapezoidal Membership functions
  // Low: 1 at x=0, 0 at x=40
  let muLow = 0;
  if (x <= 20) muLow = 1;
  else if (x > 20 && x < 45) muLow = (45 - x) / (45 - 20);

  // Medium: 0 at 25, 1 at 50, 0 at 75
  let muMed = 0;
  if (x >= 25 && x <= 50) muMed = (x - 25) / (50 - 25);
  else if (x > 50 && x <= 75) muMed = (75 - x) / (75 - 50);

  // High: 0 at 55, 1 at 80-100
  let muHigh = 0;
  if (x >= 55 && x <= 80) muHigh = (x - 55) / (80 - 55);
  else if (x > 80) muHigh = 1;

  // 2. Defuzzification via Centroid (Center of Gravity)
  // Representative center points: Low = 15, Med = 50, High = 85
  const numerator = (muLow * 15) + (muMed * 50) + (muHigh * 85);
  const denominator = muLow + muMed + muHigh || 1;
  const centroid = Number((numerator / denominator).toFixed(1));

  let crispRecommendation = "Standard Processing (Low Priority)";
  if (centroid > 65) crispRecommendation = "High Priority Escalation (24h SLA)";
  else if (centroid > 35) crispRecommendation = "Normal Departmental Review (48h SLA)";

  return {
    urgencyInput: x,
    muLow: Number(muLow.toFixed(2)),
    muMed: Number(muMed.toFixed(2)),
    muHigh: Number(muHigh.toFixed(2)),
    defuzzifiedScore: centroid,
    recommendation: crispRecommendation
  };
}
