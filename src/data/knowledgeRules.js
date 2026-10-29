export const knowledgeRules = [
  {
    id: "RULE_01",
    code: "RULE_ATTENDANCE_MEDICAL_CONDONATION",
    category: "Attendance",
    priority: 1,
    premises: [
      "Query relates to attendance percentage",
      "Attendance is between 65% and 74%",
      "Student cites medical / hospitalization reasons with certificates"
    ],
    conclusion: "Eligible for Academic Medical Condonation upon submitting Form AC-4 and hospital slips within 3 working days.",
    confidenceFactor: 0.92,
    domain: "Academic Regulations (Clause 7.5)",
    action: "Suggest Condonation Form AC-4 download & route to HOD"
  },
  {
    id: "RULE_02",
    code: "RULE_ATTENDANCE_CRITICAL_DETENTION",
    category: "Attendance",
    priority: 1,
    premises: [
      "Query relates to attendance percentage",
      "Attendance is strictly below 65%"
    ],
    conclusion: "Mandatory Academic Detention; student cannot appear for end-semester exams and must repeat the course during summer term.",
    confidenceFactor: 0.98,
    domain: "Examination Regulations (Clause 8.1)",
    action: "Alert student to meet Academic Dean immediately"
  },
  {
    id: "RULE_03",
    code: "RULE_EXAM_FEE_HOLD",
    category: "Exams",
    priority: 2,
    premises: [
      "Admit card download error / 403 Forbidden",
      "Payment made within the last 48 hours",
      "Bank transaction ID is available"
    ],
    conclusion: "Inter-bank ERP synchronization delay. Physical ledger clearance available instantly at Accounts Counter 2.",
    confidenceFactor: 0.88,
    domain: "ERP & Accounts Operations",
    action: "Provide ERP reconciliation guidance & manual counter hours"
  },
  {
    id: "RULE_04",
    code: "RULE_TIMETABLE_ELECTIVE_CLASH",
    category: "Timetable",
    priority: 2,
    premises: [
      "Multiple registered electives in identical timeslot",
      "Semester week 1 or 2"
    ],
    conclusion: "Cross-departmental schedule collision. Eligible for either automatic slot swap or elective change without penalty.",
    confidenceFactor: 0.95,
    domain: "Academic Timetable Ordinance",
    action: "Escalate ticket directly to Timetable Committee"
  },
  {
    id: "RULE_05",
    code: "RULE_FEE_INSTALLMENT_POLICY",
    category: "Fees",
    priority: 3,
    premises: [
      "Request for installment fee payment",
      "Initial 50% deposit paid"
    ],
    conclusion: "Installment plan granted under welfare discretionary code; remaining 50% balance deferred by 30 calendar days.",
    confidenceFactor: 0.85,
    domain: "Student Welfare & Finance",
    action: "Generate provisional installment agreement"
  },
  {
    id: "RULE_06",
    code: "RULE_NETWORK_RADIUS_TIMEOUT",
    category: "Technical",
    priority: 3,
    premises: [
      "Wi-Fi connection error 'Radius Timed Out' or 802.1x failure",
      "Hostel / Residential access point"
    ],
    conclusion: "Local certificate renewal or DHCP lease saturation. Reset adapter profile or report AP MAC to NOC desk.",
    confidenceFactor: 0.82,
    domain: "Campus IT Infrastructure",
    action: "Provide automated 802.1x profile reconfiguration steps"
  }
];
