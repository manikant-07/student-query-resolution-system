# Student Query Resolution System – AI Powered
> **"Ask Smarter. Resolve Faster."**  
> *A Complete Problem-Based Learning (PBL) College Project for Artificial Intelligence.*

---

## 📌 1. Project Overview & Objective
The **Student Query Resolution System – AI Powered** is a college portal engineered to streamline academic inquiry handling, departmental grievance redressal, and automated policy guidance. 

Students can submit academic inquiries (regarding attendance shortage, medical condonation, exam hall ticket clearance, timetable slot collisions, fee installments, hostel requests, etc.), check resolution status, and receive instant automated advice. Faculty members can triage inquiries, assign tickets, post official responses, and inspect analytical query trends.

Unlike static UI prototypes, this web application implements **real client-side algorithmic calculations, graph traversals, and statistical updates across all four modules of the Artificial Intelligence syllabus**.

---

## 🚀 2. Quick Start Guide

### Prerequisites
- **Node.js** (v18.0.0 or later, v24+ supported)
- **npm** (v9.0.0 or later)

### Running Locally
1. Clone or open the project folder in your terminal:
   ```bash
   cd "e:\Manikant\second year\project\AI_PBL"
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:5173/
   ```

### Production Build
To validate or build the optimized production bundle:
```bash
npm run build
npm run preview
```

### 🔄 1-Click GitHub Sync & Live Website Auto-Deployment
Whenever you make changes to the code or project:
1. Double click **`sync_github.bat`** (or run `git push origin main`).
2. It automatically stages all changes, creates a commit, and pushes to GitHub.
3. **GitHub Actions** (`.github/workflows/deploy.yml`) triggers automatically, builds the latest code, and updates your live website in ~1 minute!
4. **Live Website URL:** `https://manikant-07.github.io/student-query-resolution-system/`

> **Note on GitHub Pages Setup:**
> In your GitHub Repository:
> Go to **Settings** ➔ **Pages** ➔ Under **Build and deployment**, select **Source:** `GitHub Actions`.

### 🌗 Dark & Light Mode Theme Support
- Includes a built-in Dark / Light theme toggle in the header navbar.
- Automatically respects system preferences (`prefers-color-scheme`) and persists user choices to `localStorage`.
- High-contrast accessible color palette for both dark navy and crisp light modes.

---

## 🛠️ 3. Full-Stack Technology Stack
- **Frontend Framework:** React 19 with Vite
- **Routing:** React Router v7 (`react-router-dom` with HashRouter & SPA rewrites)
- **Backend & Database:** Supabase (PostgreSQL with Row Level Security - RLS)
- **Authentication:** Supabase Auth (Student, Faculty, Admin roles; bcrypt-secured JWT sessions)
- **Document Storage:** Supabase Storage (`query-attachments` bucket for PDF & images)
- **Visual Analytics & Charts:** Recharts (`recharts`)
- **Icons:** Lucide React (`lucide-react`)
- **Styling:** Custom Design System with glassmorphism, responsive utilities, and Dark/Light modes (`src/index.css`)
- **Deployment:** Vercel (Frontend) & Supabase (Backend/Database)

---

## 🗄️ 4. Supabase Database Schema & Setup

### Database Tables Created:
1. **`profiles`**: Linked to `auth.users`, holds `full_name`, `email`, `enrollment_number`, `department`, `semester`, and `role` (`student`, `faculty`, `admin`).
2. **`faculty`**: Holds academic advisor records, departments, specializations, workload tracking (`current_workload` / `maximum_workload`), and availability for CSP dispatch.
3. **`knowledge_rules`**: Expert system rules evaluated against student query submissions (`rule_code`, `category`, `condition`, `suggestion`, `confidence_score`, `is_active`).
4. **`queries`**: Core academic inquiries (`query_number`, `student_id`, `title`, `description`, `category`, `priority`, `status`, `assigned_faculty_id`, `ai_suggestion`, `confidence_score`, `matched_rule`, `tags`).
5. **`query_responses`**: Official faculty replies, directives, and resolution messages.
6. **`query_attachments`**: Metadata for uploaded medical certificates, fee receipts, or hall tickets stored in Supabase Storage.
7. **`query_status_history`**: Complete lifecycle audit trail for every status transition (Pending ➔ Answered ➔ Resolved).
8. **`notifications`**: Real-time notification logs delivered to students and faculty.

### ⚡ 1-Click Database Setup (in Supabase):
1. Create a free project at [supabase.com](https://supabase.com/).
2. Open your project dashboard and navigate to **SQL Editor** in the left menu.
3. Open [`supabase/schema.sql`](supabase/schema.sql) in this repository, copy its entire contents, paste them into the Supabase SQL Editor, and click **Run**.
4. All 8 tables, sequences, triggers, storage bucket policies, and default knowledge rules will be generated instantly.

### 🔑 Environment Variables Setup:
1. In your Supabase Dashboard, go to **Project Settings** ➔ **API**.
2. Copy your **Project URL** and **anon public Key**.
3. Create a `.env` file in the root of this project (see `.env.example`):
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
   ```

---

## ☁️ 5. Vercel Deployment Guide
1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com/) and click **Add New** ➔ **Project**.
3. Import your `student-query-resolution-system` repository.
4. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
5. Click **Deploy**. Vercel will automatically build the project using [`vercel.json`](vercel.json) single-page application rewrites.

---

## 👥 6. System Roles & Protected Dashboards
A quick role switcher is embedded directly into the navigation header:
- **Student Persona:**  
  - Name: **Manikant Rajpoot**  
  - Roll No: **23AI-104**  
  - Branch: Artificial Intelligence & Data Science (2nd Year)  
  - Access: Submit queries with real-time AI suggestions, track query history, vote on answers (Helpful / Not Helpful), browse searchable FAQs.
- **Faculty Persona:**  
  - Name: **Prof. Roshni Prasad**  
  - Title: Senior Professor & HOD, AI & Data Science  
  - Access: Query inbox triage, official response writer with AI prefill template, status transitions (Pending → Answered → Resolved), Automated CSP Assignment Engine, and Recharts analytics.

---

## 🧠 5. Comprehensive AI Syllabus Coverage (Modules 1–4)

All four syllabus modules are accessible interactively in the dedicated **AI Algorithm Lab** (`/ai-lab`) as well as in the core query workflow.

### 📘 Module 1: Problem Solving Methodologies
1. **Solving Problems by Searching:** Academic inquiry routing modeled as state space exploration from inquiry tokens to resolved policy records.
2. **Uninformed Search:**
   - **Breadth-First Search (BFS):** Explores category trees level-by-level using a FIFO queue; guarantees finding the shallowest valid answer node.
   - **Depth-First Search (DFS):** Traverses deep subdepartment hierarchies with LIFO backtracking; achieves linear space complexity $O(b \cdot m)$.
   - **Iterative Deepening Search (IDS):** Combines BFS optimality with DFS space efficiency by progressively executing Depth-Limited Search (DLS) with increasing depth limits $D=0, 1, 2, 3$.
   - **Bidirectional Search:** Concurrently searches forward from the student query frontier and backward from candidate answer nodes until the paths intersect, halving search depth to $O(b^{d/2})$.
3. **Informed (Heuristic) Search:**
   - **Heuristic Evaluation Function $h(n)$:** Transparent relevance metric computing normalized token overlap and category similarity between queries and FAQs.
   - **Greedy Best-First Search:** Explores nodes solely minimizing the estimated remaining cost $f(n) = h(n)$.
   - **A\* Search:** Implements $f(n) = g(n) + h(n)$ where $g(n)$ is verified traversal/dispatch cost and $h(n)$ is an admissible heuristic; guarantees minimal cost routing.
   - **AO\* Search (AND-OR Graph):** Models multi-condition requirements (e.g. *Exam Eligibility = Attendance $\ge$ 75% AND Financial Dues Cleared AND Admit Card Generated*).
4. **Constraint Satisfaction Problem (CSP):**
   - Solves automated query-to-faculty assignment using **Backtracking with Forward Checking**.
   - Variables ($X$): Unassigned Queries.
   - Domains ($D$): Available Faculty Members.
   - Constraints ($C$): Department/Subject match, current workload $<$ maximum workload capacity, and active availability.

---

### 🎮 Module 2: Adversarial Search & Classic AI Problems
1. **Game Playing:**
   - **Minimax Algorithm:** Step-by-step game tree evaluation with alternating MAX (maximizing student resolution payoff) and MIN (minimizing system latency/delays).
   - **Alpha-Beta Pruning:** Calculates $\alpha$ and $\beta$ cutoffs, demonstrating branches pruned when $\beta \le \alpha$.
2. **Water-Jug Problem:** Configurable Jug A, Jug B, and Target volume with animated liquid levels and step-by-step BFS fill, empty, and pour transitions.
3. **N-Queens Problem:** Configurable $N \times N$ chessboard ($4 \times 4$, $5 \times 5$, $8 \times 8$) solving queen placements using backtracking while enforcing row, column, and diagonal constraints ($|row[i] - row[j]| == |i - j|$).
4. **Travelling Salesperson Problem (TSP):** Calculates the minimal campus inspection tour between Administrative, CS, Library, and Exam nodes using distance matrix permutations.
5. **Missionaries & Cannibals:** Safe river crossing sequence using BFS under the safety constraint ($C \le M$ on both river banks).
6. **8-Tiles Problem:** Interactive $3 \times 3$ sliding tile puzzle computing live Manhattan distance ($h_2$) and misplaced tiles ($h_1$) with heuristic reset and solution triggers.

---

### 📚 Module 3: Knowledge Representation and Reasoning
1. **Academic Knowledge Base:** Curated declarative rules (Clause 7.2, 7.5, Form AC-4) encoded in production format (`IF <premises> THEN <conclusion>`).
2. **Propositional Logic:** Interactive truth-table generator and proposition evaluator for operators: AND ($\land$), OR ($\lor$), NOT ($\neg$), Implication ($P \implies Q$), and Biconditional ($P \iff Q$).
3. **First-Order Logic (FOL):** Relational knowledge representation with predicates:
   - $Enrolled(x, c)$
   - $Teaches(f, c)$
   - $\forall x, \forall c [Enrolled(x, c) \land Attendance(x, c) < 75 \implies NeedsCondonation(x, c)]$
4. **Semantic Networks:** Interactive directed entity-relationship graph connecting Student, Query, Course, Faculty, Department, and Verified Resolution via labeled edges (IS-A, TEACHES, SUBMITS, RESOLVED_BY).
5. **Minsky Frames:** Structured schema representation with slots, fillers, default values, facets, and inheritance (StudentFrame, QueryFrame, SpecificQueryInstance).
6. **Rule-Based Expert System Prototype:** Forward chaining inference engine matching query inputs against academic policy rules with transparent explanation facilities.
7. **Architecture of an Expert System:** Interactive 6-component architectural diagram:
   - User Interface
   - Working Memory
   - Inference Engine
   - Knowledge Base
   - Explanation Facility
   - Knowledge Acquisition Module

---

### 📊 Module 4: Statistical Reasoning & Uncertainty
1. **Probability Distribution:** Empirical prior probabilities $P(\text{Category})$ calculated from historical student inquiry tickets.
2. **Bayes Theorem:** Interactive posterior probability calculator updating $P(\text{Category} \mid \text{Keywords})$ based on observed tokens using Laplace smoothing.
3. **Certainty Factors (MYCIN Model):** Evaluates $CF = MB - MD$ where $MB$ is Measure of Belief from supporting evidence and $MD$ is Measure of Disbelief from contradictory inputs.
4. **Rule-Based vs. Statistical Inference:** Side-by-side comparison illustrating deterministic rule firing versus probabilistic inference.
5. **Bayesian Networks:** Directed Acyclic Graph (DAG) for Query Diagnosis:
   $$\text{Keywords} \longrightarrow \text{Category} \longrightarrow \text{Department} \longrightarrow \text{Suggested Resolution}$$
6. **Dempster-Shafer Theory:** Evidence fusion between multiple sources (e.g., NLP Keyword Parser and Student History) computing Belief intervals $[Bel(A), Pl(A)]$ and conflict metric $K$.
7. **Fuzzy Logic & Defuzzification:** Priority inference with continuous triangular and trapezoidal membership functions (Low, Medium, High) defuzzified via the **Centroid Method** (Center of Gravity).

---

## 🔄 6. End-to-End Query Resolution Workflow

1. **Query Entry:** The student enters inquiry subject, category, description, priority, and tags.
2. **Real-Time AI Diagnostic:** As the student types:
   - Tokens are cleaned and stop-words removed.
   - Bayes Theorem computes category posterior probabilities.
   - Heuristic scoring retrieves relevant institutional FAQs with immediate answers.
   - Production rules match premises (e.g. attendance between 65% and 74% + medical reason) to generate a suggested official action.
3. **Submission & Storage:** The ticket is saved in LocalStorage with a unique ID (e.g., `QRY-1007`), timestamp, certainty score, and status (`Pending`).
4. **Faculty Triage:** The inquiry appears in the Faculty Dashboard inbox with category, priority, and AI diagnostic summary.
5. **CSP Assignment:** Faculty can assign the query manually or click **"Automated CSP Assignment Engine"** to run the backtracking solver across all unassigned tickets.
6. **Resolution & Official Reply:** Faculty drafts an official response (optionally importing the AI suggested template) and marks the ticket as `Answered` or `Resolved`.
7. **Student Verification & Feedback:** The student inspects the reply, adds follow-up clarifications, and votes `Helpful` or `Not Helpful` to adjust certainty metrics.

---

## ⚖️ 7. AI Implementation Transparency Disclosure

In compliance with academic ethics and PBL guidelines:
- **Genuinely Implemented:** BFS, DFS, IDS, Bidirectional search, Heuristic scoring $h(n)$, A\* search, CSP Forward-Checking solver, Water-Jug BFS, N-Queens backtracking, 8-Tiles A\* with Manhattan distance, Propositional truth tables, FOL predicate evaluation, Bayes Theorem posterior calculation, Certainty Factors, and Fuzzy Logic Centroid defuzzification.
- **Simulation / Educational Demonstration:** Minimax/Alpha-Beta game tree visualizer, Dempster-Shafer two-source fusion, and Bayesian DAG dependency tables (executed via real local mathematical calculations over educational problem models).
- **Not Claimed:** No external black-box LLM API calls are used, preventing hallucinated responses and ensuring the system is fully auditable for college grading.

---

## 📂 8. Project Directory Structure
```
AI_PBL/
├── index.html                   # Entry HTML with meta tags & Google Fonts (Inter, Outfit, JetBrains Mono)
├── package.json                 # Project dependencies & scripts
├── vite.config.js               # Vite bundler configuration
├── src/
│   ├── main.jsx                 # Application root mounting App
│   ├── App.jsx                  # React Router configuration & global layout
│   ├── index.css                # Master CSS Design System (colors, glassmorphism, responsive styles)
│   ├── context/
│   │   └── AppContext.jsx       # Global state management & LocalStorage persistence
│   ├── data/
│   │   ├── initialQueries.js    # Realistic starter queries (attendance, exams, fees, timetable, network)
│   │   ├── initialFAQs.js       # Academic FAQs with keywords and regulation references
│   │   ├── facultyList.js       # Faculty records with subject expertise and workload limits (for CSP)
│   │   ├── knowledgeRules.js    # Expert system production rules
│   │   └── vivaQuestions.js     # 13+ high-yield viva voce Q&As covering Modules 1–4
│   ├── utils/
│   │   ├── aiEngine.js          # Tokenizer, Heuristic overlap, Bayes classifier, Certainty factors
│   │   ├── searchAlgorithms.js  # BFS, DFS, IDS, Bidirectional, A*, AO*, CSP Backtracking solver
│   │   ├── classicProblems.js   # Minimax, Alpha-Beta, Water Jug, N-Queens, TSP, 8-Puzzle
│   │   └── logicAndReasoning.js # Propositional truth table, FOL, Semantic net, Dempster-Shafer, Fuzzy
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx       # Header with persona switcher & reset demo button
│   │   │   ├── Sidebar.jsx      # Navigation sidebar with query pipeline status
│   │   │   ├── Badge.jsx        # Status, Priority, and Algorithm badges
│   │   │   ├── Modal.jsx        # Accessible backdrop modal dialog
│   │   │   └── Toast.jsx        # Notification feedback container
│   │   ├── student/
│   │   │   ├── SubmitQueryModal.jsx # Query form with real-time AI live diagnosis
│   │   │   ├── QueryDetailModal.jsx # Detailed ticket view with conversation thread
│   │   │   └── FAQSection.jsx       # Searchable accordion FAQ component
│   │   ├── faculty/
│   │   │   ├── FacultyReplyModal.jsx # Response drafting modal with AI template insert
│   │   │   ├── CSPOptimizerModal.jsx # Interactive CSP backtracking solver modal
│   │   │   └── AnalyticsCharts.jsx   # Recharts category bar charts, pie charts & metrics
│   │   └── ai-lab/
│   │       ├── Module1Search.jsx      # Uninformed, Informed & CSP search lab
│   │       ├── Module2Adversarial.jsx # Minimax, Water Jug, N-Queens, TSP, 8-Puzzle
│   │       ├── Module3Knowledge.jsx   # KB, Logic, FOL, Semantic Net, Frames, Expert System
│   │       └── Module4Statistical.jsx # Probability, Bayes, CF, Bayes Net, Dempster, Fuzzy
│   └── pages/
│       ├── LandingPage.jsx          # Hero section, statistics, features, syllabus highlights
│       ├── StudentDashboard.jsx     # Query submission, tracking, filters, and FAQs
│       ├── FacultyDashboard.jsx     # Triage inbox, reply modal, CSP trigger, and Recharts
│       ├── AILabPage.jsx            # Master AI Algorithm Lab with tabbed modules
│       └── ArchitectureVivaPage.jsx # System diagrams, syllabus checklist, and viva Q&A
```

---

## 🎓 9. Viva Voce Preparation Checklist

When defending this project in front of examiners:
1. **Explain the Architecture:** Use the diagram in `/viva` to explain the flow from student inquiry $\to$ NLP Tokenization $\to$ Bayesian Category Estimation $\to$ Expert Rule Evaluation $\to$ CSP Faculty Assignment $\to$ Resolution.
2. **Demonstrate Algorithm Execution:**
   - In **Module 1**: Click and run **A\* Search** to show $f(n) = g(n) + h(n)$ cost computation. Run **CSP Backtracking** to show how faculty workload and domain constraints prevent over-assignment.
   - In **Module 2**: Solve the **Water-Jug Problem** with animated pouring levels using BFS. Display **N-Queens** on an $8 \times 8$ board with diagonal conflict verification.
   - In **Module 3**: Generate the truth table for **Implication ($P \implies Q$)** and fire the **Academic Advisory Expert System** to show how attendance $< 75\%$ triggers medical condonation Form AC-4.
   - In **Module 4**: Input custom keywords into the **Bayes Theorem** calculator and observe the posterior probability shift. Adjust the **Fuzzy Logic** urgency slider to show centroid defuzzification.
3. **Emphasize Transparency:** Point to the **AI Implementation vs Simulation Matrix** to demonstrate honest academic integrity.
