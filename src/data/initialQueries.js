export const initialQueries = [
  {
    id: "QRY-1001",
    studentName: "Manikant Kumar",
    studentRoll: "23AI-104",
    email: "manikant.ai@college.edu",
    subject: "Attendance Shortage in Advanced AI & ML Lab",
    category: "Attendance",
    description: "My attendance in AI Lab is currently 68% due to a 10-day hospitalization with viral fever. I have verified medical certificates and approval from the department head. Can I apply for condonation to appear in the end-semester practical exams?",
    priority: "Urgent",
    status: "Pending",
    tags: ["attendance", "medical-leave", "ai-lab", "exam-eligibility"],
    createdAt: "2026-10-24T09:30:00Z",
    assignedTo: "Prof. Rajesh Sharma",
    assignedDept: "Artificial Intelligence & Data Science",
    suggestedAnswer: "According to College Academic Policy (Rule AC-104), students with attendance between 65% and 74% with valid registered medical documents are eligible to submit a Condonation Application to the Dean of Academics before the 5th working day prior to exams.",
    certaintyScore: 0.92,
    matchedRule: "RULE_ATTENDANCE_MEDICAL_CONDONATION",
    explanation: "Matched keywords ['attendance', 'hospitalization', 'condonation'] with Category=Attendance & threshold [65%-75%]. Rule fired from Academic Regulations Base.",
    replies: [
      {
        id: "rep-1",
        author: "Prof. Rajesh Sharma",
        role: "Faculty",
        message: "Hello Manikant, please submit your original hospital discharge slip and fitness certificate to Room 204 (Academic Cell) by tomorrow 2:00 PM. We will review your condonation request.",
        timestamp: "2026-10-25T11:15:00Z"
      }
    ],
    feedback: { helpful: 4, notHelpful: 0, userVoted: null }
  },
  {
    id: "QRY-1002",
    studentName: "Ananya Sharma",
    studentRoll: "23CS-042",
    email: "ananya.cs@college.edu",
    subject: "Exam Hall Ticket Download Error on Student Portal",
    category: "Exams",
    description: "When clicking 'Download Admit Card' for Semester 4 Mid-Term Examinations, the portal gives 'Error 403: Financial Clearance Required', despite my semester tuition fees being paid on Oct 10th with transaction ID TXN-98421.",
    priority: "High",
    status: "Answered",
    tags: ["hall-ticket", "fees-clearance", "mid-term", "accounts"],
    createdAt: "2026-10-22T14:20:00Z",
    assignedTo: "Dr. Vikram Seth",
    assignedDept: "Examination Branch",
    suggestedAnswer: "Payment reconciliations between the online bank gateway and ERP take up to 48 banking hours. If paid recently, present your bank receipt to the Accounts Desk for instant ledger clearance.",
    certaintyScore: 0.88,
    matchedRule: "RULE_EXAM_FEE_HOLD",
    explanation: "Identified conflict: Fee paid vs Financial Clearance lock. Triggered Accounts/Exam reconciliation rule.",
    replies: [
      {
        id: "rep-2",
        author: "Dr. Vikram Seth",
        role: "Exam Cell Head",
        message: "We cross-verified TXN-98421 with the Finance Office. Your status is now marked 'Cleared'. Please refresh the portal and download your Hall Ticket.",
        timestamp: "2026-10-23T10:00:00Z"
      }
    ],
    feedback: { helpful: 8, notHelpful: 1, userVoted: "helpful" }
  },
  {
    id: "QRY-1003",
    studentName: "Rohan Verma",
    studentRoll: "23IT-088",
    email: "rohan.it@college.edu",
    subject: "Clash in Mid-Term Timetable for Elective - Cloud Computing & AI",
    category: "Timetable",
    description: "The timetable published yesterday schedules 'Cloud Computing Elective' and 'Artificial Intelligence Core' in Slot 3 on Wednesday, 10:00 AM. Several 3rd semester IT students have opted for both courses.",
    priority: "Medium",
    status: "Resolved",
    tags: ["timetable-clash", "elective", "scheduling", "mid-term"],
    createdAt: "2026-10-18T16:45:00Z",
    assignedTo: "Prof. Priya Nair",
    assignedDept: "Academic Scheduling Committee",
    suggestedAnswer: "Timetable clashes for cross-departmental electives are routed to the Academic Scheduling Cell for rescheduled slot assignment.",
    certaintyScore: 0.95,
    matchedRule: "RULE_TIMETABLE_ELECTIVE_CLASH",
    explanation: "CSP constraint violation detected: 2 exams mapped to identical student cohort and time slot.",
    replies: [
      {
        id: "rep-3",
        author: "Prof. Priya Nair",
        role: "Timetable Coordinator",
        message: "Thank you for alerting us. The revised schedule has moved Cloud Computing to Thursday Slot 2 (2:00 PM). Notification uploaded to the portal notice board.",
        timestamp: "2026-10-19T09:30:00Z"
      }
    ],
    feedback: { helpful: 12, notHelpful: 0, userVoted: "helpful" }
  },
  {
    id: "QRY-1004",
    studentName: "Sneha Patel",
    studentRoll: "23EE-019",
    email: "sneha.ee@college.edu",
    subject: "Installment Fee Payment Request for Even Semester",
    category: "Fees",
    description: "Requesting permission to pay the remaining semester tuition balance in two installments due to family agricultural harvest delay. First installment of ₹25,000 paid already.",
    priority: "Medium",
    status: "Answered",
    tags: ["fee-installment", "accounts", "financial-aid"],
    createdAt: "2026-10-20T11:00:00Z",
    assignedTo: "Mr. K. Narayanan",
    assignedDept: "Accounts & Finance Office",
    suggestedAnswer: "Installment concessions require submission of Form FA-2 endorsed by the Academic Advisor and Dean of Student Welfare.",
    certaintyScore: 0.84,
    matchedRule: "RULE_FEE_INSTALLMENT_POLICY",
    explanation: "Rule evaluated financial assistance guidelines with partial payment record.",
    replies: [
      {
        id: "rep-4",
        author: "Mr. K. Narayanan",
        role: "Accounts Officer",
        message: "Your installment request has been sanctioned in principle. Second installment of ₹25,000 is due on or before Nov 30th without late fine.",
        timestamp: "2026-10-21T15:20:00Z"
      }
    ],
    feedback: { helpful: 5, notHelpful: 0, userVoted: null }
  },
  {
    id: "QRY-1005",
    studentName: "Aditya Joshi",
    studentRoll: "23EC-071",
    email: "aditya.ec@college.edu",
    subject: "Wi-Fi Authentication Failure in Hostel Block B",
    category: "Technical",
    description: "Campus 802.1x Enterprise Wi-Fi shows 'Radius Authentication Timed Out' on 2nd and 3rd floors of Hostel Block B since maintenance updates on Friday evening.",
    priority: "Low",
    status: "Resolved",
    tags: ["wifi", "network", "hostel", "it-support"],
    createdAt: "2026-10-15T20:10:00Z",
    assignedTo: "Er. Amit Saxena",
    assignedDept: "IT & Campus Infrastructure",
    suggestedAnswer: "Check device certificate configuration or contact IT Network Helpdesk at Ext 3302.",
    certaintyScore: 0.79,
    matchedRule: "RULE_NETWORK_RADIUS_TIMEOUT",
    explanation: "Keyword clustering matched network infrastructure incidents in residential sector.",
    replies: [
      {
        id: "rep-5",
        author: "Er. Amit Saxena",
        role: "Network Admin",
        message: "Access Point controller SSL certificates were renewed and Block B secondary gateway has been rebooted. Wi-Fi service is restored.",
        timestamp: "2026-10-16T10:40:00Z"
      }
    ],
    feedback: { helpful: 15, notHelpful: 1, userVoted: "helpful" }
  },
  {
    id: "QRY-1006",
    studentName: "Kavya Menon",
    studentRoll: "23ME-053",
    email: "kavya.me@college.edu",
    subject: "Re-evaluation Grade Change not Reflected in Transcript",
    category: "Exams",
    description: "My re-evaluation result for Thermodynamics (ME-301) was upgraded from Grade 'C' to Grade 'B+' on Oct 5th, but the provisional grade card still shows the old grade.",
    priority: "High",
    status: "Pending",
    tags: ["re-evaluation", "transcript", "grade-card", "thermodynamics"],
    createdAt: "2026-10-26T17:05:00Z",
    assignedTo: "Dr. Vikram Seth",
    assignedDept: "Examination Branch",
    suggestedAnswer: "Re-evaluation grade updates require controller sign-off in the Central Academic Registry database. Updated transcript prints generate every Monday.",
    certaintyScore: 0.91,
    matchedRule: "RULE_EXAM_REEVALUATION_TRANSCRIPT",
    explanation: "Heuristic match on grade change workflow and registrar batch sync cadence.",
    replies: [],
    feedback: { helpful: 2, notHelpful: 0, userVoted: null }
  }
];
