export const vivaQuestions = [
  {
    id: "VIVA-01",
    module: "Module 1: Problem Solving",
    question: "What is the difference between Uninformed and Informed Search?",
    answer: "Uninformed (blind) search algorithms like BFS and DFS explore states solely using the problem definition and state transitions without any domain-specific knowledge about how close a state is to the goal. Informed (heuristic) search algorithms like Greedy Best-First and A* use an evaluation function (heuristic h(n)) estimating the remaining distance to the goal, allowing them to search faster and more selectively.",
    keyPoints: [
      "Uninformed search has no knowledge of goal proximity (e.g., BFS, DFS, IDS, Bidirectional).",
      "Informed search uses heuristic function h(n) (e.g., A*, Greedy Best-First, AO*).",
      "In our project, uninformed search traverses category hierarchies, while informed search ranks candidate FAQ answers by semantic keyword relevance."
    ],
    projectContext: "In our query portal, BFS traverses category-department trees, whereas A* computes f(n) = g(n) + h(n) where g(n) is query matching distance and h(n) is inverse keyword similarity."
  },
  {
    id: "VIVA-02",
    module: "Module 1: Problem Solving",
    question: "Why is A* Search considered optimal and complete, and what is heuristic admissibility?",
    answer: "A* Search uses f(n) = g(n) + h(n), where g(n) is the exact path cost from start to node n, and h(n) is the estimated cost from n to the goal. A* is guaranteed to be optimal (finding the lowest-cost solution) and complete if the heuristic h(n) is admissible (it never overestimates the true remaining cost, h(n) <= h*(n)) and consistent (monotonic).",
    keyPoints: [
      "f(n) = g(n) + h(n)",
      "Admissible: h(n) <= true cost h*(n)",
      "Guarantees shortest path exploration first on positive edge weights"
    ],
    projectContext: "Demonstrated in our AI Algorithm Lab with interactive cost breakdown and step trace."
  },
  {
    id: "VIVA-03",
    module: "Module 1: Problem Solving",
    question: "What is an AND-OR Graph and how does AO* work?",
    answer: "An AND-OR graph represents problem decomposition where solving a problem requires either solving ANY of several alternative subproblems (OR branch) or solving ALL required prerequisite subproblems simultaneously (AND branch). The AO* algorithm operates on acyclic AND-OR graphs using heuristic estimates to find a minimal cost hypergraph solution.",
    keyPoints: [
      "OR node: solved if any one child is solved.",
      "AND node: solved only if all connected children are solved.",
      "AO* updates heuristic values bottom-up through cost revision."
    ],
    projectContext: "Applied to Academic Exam Eligibility: to sit for exams, a student must clear Financial Dues AND achieve >= 75% Attendance AND obtain Hall Ticket."
  },
  {
    id: "VIVA-04",
    module: "Module 1: Problem Solving",
    question: "How is Constraint Satisfaction Problem (CSP) formulated in this portal?",
    answer: "A CSP consists of Variables (X), Domains (D), and Constraints (C). In our system: Variables = Unassigned Student Queries; Domains = Eligible Faculty Members; Constraints = Faculty Department must match Query Category, Faculty current workload cannot exceed maximum capacity, and Faculty must be marked Available.",
    keyPoints: [
      "Variables: Queries requiring faculty assignment",
      "Domains: List of registered faculty members",
      "Constraints: Subject match, workload capacity, availability",
      "Solved using Backtracking Search with Forward Checking"
    ],
    projectContext: "Implemented in Faculty Dashboard via the 'Automated CSP Assignment' engine button."
  },
  {
    id: "VIVA-05",
    module: "Module 2: Adversarial Search",
    question: "What is the Minimax algorithm and how does Alpha-Beta Pruning improve it?",
    answer: "Minimax is a decision-making algorithm for two-player zero-sum games where the MAX player tries to maximize payoff while the MIN player tries to minimize it. Alpha-Beta Pruning optimizes Minimax by eliminating branches that cannot possibly influence the final decision, reducing the branching factor from b^d to b^(d/2) in the best case.",
    keyPoints: [
      "Alpha: Best value MAX can guarantee so far (starts at -infinity).",
      "Beta: Best value MIN can guarantee so far (starts at +infinity).",
      "Prune condition: If beta <= alpha, the remaining children of this branch are cut off."
    ],
    projectContext: "Demonstrated in Module 2 Lab with an interactive game tree visualizer showing pruned nodes and alpha/beta cuts."
  },
  {
    id: "VIVA-06",
    module: "Module 2: Classic AI Problems",
    question: "Explain the state space representation of the Water-Jug Problem.",
    answer: "The problem uses state (x, y) where x is water in Jug A (capacity C_A) and y in Jug B (capacity C_B). Valid operators include: Fill Jug A, Fill Jug B, Empty Jug A, Empty Jug B, Pour A into B, and Pour B into A. A solution exists if and only if the target quantity is a multiple of GCD(C_A, C_B) and does not exceed the maximum jug capacity.",
    keyPoints: [
      "State representation: (x, y)",
      "Solvability condition: Target % GCD(C_A, C_B) == 0",
      "Explored using BFS to guarantee the minimal number of pouring steps."
    ],
    projectContext: "Interactive lab permits entering Jug A, Jug B, and Target amount, visualizing the liquid levels in animated jugs."
  },
  {
    id: "VIVA-07",
    module: "Module 2: Classic AI Problems",
    question: "How does the N-Queens problem enforce constraints?",
    answer: "In N-Queens, N non-attacking queens must be placed on an N x N chessboard. The constraints dictate that no two queens can share the same row, column, or diagonal. With one queen placed per column, row conflicts are checked via row[i] == row[j], and diagonal conflicts via |row[i] - row[j]| == |i - j|.",
    keyPoints: [
      "Row constraint: Unique row per queen.",
      "Diagonal constraint: Absolute difference in row equals absolute difference in column.",
      "Backtracking searches column by column, pruning invalid placements immediately."
    ],
    projectContext: "Interactive chessboard visualizer supports 4x4, 5x5, and 8x8 boards with safe/unsafe placement indicators."
  },
  {
    id: "VIVA-08",
    module: "Module 3: Knowledge Representation",
    question: "What are Semantic Networks and Frames?",
    answer: "A Semantic Network represents knowledge as a directed graph where nodes represent objects, concepts, or events, and edges represent relationships (such as IS-A, HAS-A, ENROLLED-IN). A Frame is a record-like data structure introduced by Marvin Minsky that groups attributes into 'slots' with 'values', default values, and inheritance procedures.",
    keyPoints: [
      "Semantic Networks: Node-link graph highlighting taxonomy and relational semantics.",
      "Frames: Object-attribute-value structures with default slots and inheritance.",
      "Both enable hierarchical inheritance from generic to specific concepts."
    ],
    projectContext: "Visualized in Module 3 with an interactive graph connecting Student, Query, Department, and Faculty, alongside frame slot tables."
  },
  {
    id: "VIVA-09",
    module: "Module 3: Knowledge Representation",
    question: "What are the core components of an Expert System Architecture?",
    answer: "A complete expert system consists of: 1) User Interface (queries/results), 2) Working Memory (active facts of current query), 3) Knowledge Base (rules/facts), 4) Inference Engine (forward/backward chaining), 5) Explanation Facility ('Why' and 'How' explanations), and 6) Knowledge Acquisition Module (adding new rules).",
    keyPoints: [
      "Inference Engine applies logical deduction rules to working memory facts.",
      "Explanation facility justifies why a recommendation was made.",
      "Separation of domain knowledge (rules) from execution engine is key."
    ],
    projectContext: "Rendered as an interactive 6-node architectural flow diagram with clickable module inspections."
  },
  {
    id: "VIVA-10",
    module: "Module 4: Statistical Reasoning",
    question: "How does Bayes Theorem update probabilities when new keywords are observed?",
    answer: "Bayes Theorem calculates Posterior Probability: P(Category | Keywords) = [P(Keywords | Category) * P(Category)] / P(Keywords). P(Category) is the prior probability based on historical ticket frequencies, P(Keywords | Category) is the likelihood of those words in that category, and P(Keywords) is the total marginal evidence probability.",
    keyPoints: [
      "Prior: Base probability before seeing text.",
      "Likelihood: Frequency of tokens in training class.",
      "Posterior: Updated probability given ticket evidence."
    ],
    projectContext: "Powers the live query suggestion engine and the Bayes Theorem interactive calculator in Module 4."
  },
  {
    id: "VIVA-11",
    module: "Module 4: Statistical Reasoning",
    question: "What is Dempster-Shafer Theory and how does it handle uncertainty differently from Bayes?",
    answer: "Unlike Bayesian probability which requires assigning probabilities to single mutually exclusive hypotheses (summing to 1), Dempster-Shafer Theory assigns Basic Probability Assignment (BPA, mass m) to sets of hypotheses (power set of discernment frame). It defines Belief (Bel(A), minimum support) and Plausibility (Pl(A), maximum potential support), creating an uncertainty interval [Bel(A), Pl(A)].",
    keyPoints: [
      "Frame of discernment Theta: set of all possibilities.",
      "Belief Bel(A): lower bound of confidence.",
      "Plausibility Pl(A) = 1 - Bel(not A): upper bound.",
      "Uncertainty interval = Pl(A) - Bel(A)."
    ],
    projectContext: "Demonstrated with a two-sensor evidence fusion tool comparing academic advisor and finance officer estimates."
  },
  {
    id: "VIVA-12",
    module: "Module 4: Statistical Reasoning",
    question: "How does Fuzzy Logic determine query urgency?",
    answer: "Fuzzy Logic handles partial truth values between 0.0 and 1.0 using continuous membership functions instead of binary true/false. Query urgency score (0-100) maps to overlapping fuzzy sets: Low [0, 40], Medium [30, 70], and High [60, 100]. Defuzzification (such as Centroid method) converts fuzzy membership outputs back into a crisp action recommendation.",
    keyPoints: [
      "Membership function mu(x) in [0, 1].",
      "Fuzzy rules: IF delay is Long AND attendance is Low THEN Priority is High.",
      "Centroid defuzzification calculates weighted center of mass."
    ],
    projectContext: "Interactive fuzzy membership curve visualizer in Module 4 lets users drag urgency inputs and observe dynamic membership values."
  },
  {
    id: "VIVA-13",
    module: "Project Defense",
    question: "What parts of AI in this application are truly implemented vs simulated?",
    answer: "Fully Implemented algorithms include: BFS, DFS, IDS, Bidirectional Search, Heuristic scoring, A* search, CSP Forward-Checking solver, Water-Jug BFS, N-Queens backtracking, 8-Puzzle A* with Manhattan distance, Propositional Logic evaluator, Bayes theorem posterior calculator, and Certainty Factor combination. Visualizations such as Minimax/Alpha-Beta game trees and Dempster-Shafer fusion run on real local math calculations over educational sample graphs.",
    keyPoints: [
      "Client-side algorithmic execution in JavaScript.",
      "No external API dependencies or mock hallucinations.",
      "Clear visual badge on every demonstration distinguishing 'Implemented' vs 'Simulation'."
    ],
    projectContext: "Every card in the AI Lab has a dedicated badge and methodology disclosure."
  }
];
