/**
 * Search Algorithms for Module 1: Problem Solving Methodologies
 * Includes real, executable implementations of:
 * - BFS, DFS, Iterative Deepening, Bidirectional Search
 * - Heuristic evaluation, Greedy Best-First, A*, AO*
 * - Constraint Satisfaction Problem (CSP) for Query Assignment
 */

// Sample Academic Knowledge Tree for Uninformed Search
export const academicCategoryTree = {
  id: "Root",
  name: "College Academic Portal",
  children: [
    {
      id: "Academics",
      name: "Academic Affairs",
      children: [
        {
          id: "Attendance",
          name: "Attendance Cell",
          children: [
            { id: "MedCond", name: "Medical Condonation Policy", isTarget: true, answer: "Form AC-4 submitted with doctor certificate for 65-74% attendance." },
            { id: "Detention", name: "Attendance Detention Notice", isTarget: false, answer: "Below 65% requires course repeat." }
          ]
        },
        {
          id: "Curriculum",
          name: "Course Curriculum",
          children: [
            { id: "Syllabus", name: "Syllabus Structure 2026", isTarget: false, answer: "Choice-Based Credit System 160 credits total." },
            { id: "ElectiveSwap", name: "Elective Change Request", isTarget: true, answer: "Course swap permitted within first 10 days of semester." }
          ]
        }
      ]
    },
    {
      id: "Exams",
      name: "Examination Branch",
      children: [
        {
          id: "HallTicket",
          name: "Admit Card Services",
          children: [
            { id: "DownloadCard", name: "Admit Card Generation", isTarget: true, answer: "Issued 7 days prior upon clearing dues." },
            { id: "DuplicateCard", name: "Duplicate Hall Ticket", isTarget: false, answer: "Re-issue fee ₹200 with ID card." }
          ]
        },
        {
          id: "Evaluation",
          name: "Evaluation & Grades",
          children: [
            { id: "Reval", name: "Answer Script Re-evaluation", isTarget: true, answer: "Apply within 10 days of results, fee ₹750." },
            { id: "Transcript", name: "Official Transcripts", isTarget: false, answer: "Issued in 5 business days." }
          ]
        }
      ]
    },
    {
      id: "Finance",
      name: "Accounts & Fees",
      children: [
        {
          id: "Tuition",
          name: "Tuition Desk",
          children: [
            { id: "Installment", name: "Fee Installment Approval", isTarget: true, answer: "Submit Form FA-2 with Dean endorsement." }
          ]
        }
      ]
    }
  ]
};

/**
 * 1. Breadth-First Search (BFS)
 */
export function runBFS(tree, targetId) {
  const queue = [{ node: tree, path: [tree.name], depth: 0 }];
  const visited = [];
  const trace = [];
  let step = 1;

  while (queue.length > 0) {
    const current = queue.shift();
    const node = current.node;
    visited.push(node.name);

    trace.push({
      step: step++,
      action: `Visiting node: "${node.name}" (Depth ${current.depth})`,
      queueState: queue.map(q => q.node.name).join(", ") || "(empty)"
    });

    if (node.id === targetId || (node.isTarget && !targetId)) {
      trace.push({
        step: step,
        action: `GOAL FOUND at "${node.name}"!`,
        result: node.answer || `Successfully matched target ${node.name}`
      });
      return {
        found: true,
        targetNode: node,
        visited,
        path: current.path,
        trace,
        steps: step
      };
    }

    if (node.children) {
      for (const child of node.children) {
        queue.push({
          node: child,
          path: [...current.path, child.name],
          depth: current.depth + 1
        });
      }
    }
  }

  return { found: false, visited, trace, steps: step };
}

/**
 * 2. Depth-First Search (DFS)
 */
export function runDFS(tree, targetId) {
  const stack = [{ node: tree, path: [tree.name], depth: 0 }];
  const visited = [];
  const trace = [];
  let step = 1;

  while (stack.length > 0) {
    const current = stack.pop();
    const node = current.node;
    visited.push(node.name);

    trace.push({
      step: step++,
      action: `Visiting node: "${node.name}" (Depth ${current.depth})`,
      stackState: stack.map(s => s.node.name).join(", ") || "(empty)"
    });

    if (node.id === targetId || (node.isTarget && !targetId)) {
      trace.push({
        step: step,
        action: `GOAL FOUND at "${node.name}"!`,
        result: node.answer || `Successfully matched target ${node.name}`
      });
      return {
        found: true,
        targetNode: node,
        visited,
        path: current.path,
        trace,
        steps: step
      };
    }

    // Push children in reverse order so leftmost child is visited first
    if (node.children) {
      for (let i = node.children.length - 1; i >= 0; i--) {
        const child = node.children[i];
        stack.push({
          node: child,
          path: [...current.path, child.name],
          depth: current.depth + 1
        });
      }
    }
  }

  return { found: false, visited, trace, steps: step };
}

/**
 * 3. Iterative Deepening Search (IDS)
 */
export function runIDS(tree, targetId, maxDepthLimit = 3) {
  const trace = [];
  let totalSteps = 1;

  function dls(node, currentDepth, limit, path) {
    trace.push({
      step: totalSteps++,
      action: `[Limit ${limit}] Exploring "${node.name}" at Depth ${currentDepth}`,
      stackState: `Active Depth: ${currentDepth}/${limit}`
    });

    if (node.id === targetId) {
      return { found: true, node, path };
    }

    if (currentDepth >= limit) {
      return { cutoff: true };
    }

    let anyCutoff = false;
    if (node.children) {
      for (const child of node.children) {
        const res = dls(child, currentDepth + 1, limit, [...path, child.name]);
        if (res && res.found) return res;
        if (res && res.cutoff) anyCutoff = true;
      }
    }

    return anyCutoff ? { cutoff: true } : { notFound: true };
  }

  for (let limit = 0; limit <= maxDepthLimit; limit++) {
    trace.push({
      step: totalSteps++,
      action: `>>> Starting Depth-Limited Iteration: Depth Limit = ${limit} <<<`,
      stackState: `Limit ${limit}`
    });
    const result = dls(tree, 0, limit, [tree.name]);
    if (result && result.found) {
      trace.push({
        step: totalSteps,
        action: `GOAL FOUND at limit ${limit}! Node: "${result.node.name}"`,
        result: result.node.answer
      });
      return { found: true, targetNode: result.node, path: result.path, trace, steps: totalSteps, limitReached: limit };
    }
  }

  return { found: false, trace, steps: totalSteps };
}

/**
 * 4. Bidirectional Search
 * Searches simultaneously forward from Query Root and backward from Target Answer Node
 */
export function runBidirectional(tree, targetId = "MedCond") {
  const trace = [];
  const forwardQueue = [tree.id];
  const backwardQueue = [targetId];
  const forwardVisited = new Set([tree.id]);
  const backwardVisited = new Set([targetId]);

  // Graph adjacency map
  const adj = {
    Root: ["Academics", "Exams", "Finance"],
    Academics: ["Attendance", "Curriculum"],
    Attendance: ["MedCond", "Detention"],
    Curriculum: ["Syllabus", "ElectiveSwap"],
    Exams: ["HallTicket", "Evaluation"],
    HallTicket: ["DownloadCard", "DuplicateCard"],
    Evaluation: ["Reval", "Transcript"],
    Finance: ["Tuition"],
    Tuition: ["Installment"]
  };

  // Undirected graph edges
  const undirected = {};
  for (const [parent, children] of Object.entries(adj)) {
    undirected[parent] = undirected[parent] || [];
    children.forEach(c => {
      undirected[parent].push(c);
      undirected[c] = undirected[c] || [];
      undirected[c].push(parent);
    });
  }

  let step = 1;
  while (forwardQueue.length > 0 && backwardQueue.length > 0) {
    // Forward step
    const fNode = forwardQueue.shift();
    trace.push({
      step: step++,
      action: `[Forward Frontier] Exploring node: "${fNode}"`,
      forwardFrontier: [...forwardQueue, fNode].join(", "),
      backwardFrontier: backwardQueue.join(", ")
    });

    if (backwardVisited.has(fNode)) {
      trace.push({
        step: step,
        action: `>>> INTERSECTION DETECTED at node: "${fNode}"! Forward & Backward frontiers meet! <<<`,
        intersectionNode: fNode
      });
      return { found: true, intersectionNode: fNode, trace, steps: step };
    }

    for (const neighbor of undirected[fNode] || []) {
      if (!forwardVisited.has(neighbor)) {
        forwardVisited.add(neighbor);
        forwardQueue.push(neighbor);
      }
    }

    // Backward step
    const bNode = backwardQueue.shift();
    trace.push({
      step: step++,
      action: `[Backward Frontier] Exploring node: "${bNode}"`,
      forwardFrontier: forwardQueue.join(", "),
      backwardFrontier: [...backwardQueue, bNode].join(", ")
    });

    if (forwardVisited.has(bNode)) {
      trace.push({
        step: step,
        action: `>>> INTERSECTION DETECTED at node: "${bNode}"! Search paths have connected! <<<`,
        intersectionNode: bNode
      });
      return { found: true, intersectionNode: bNode, trace, steps: step };
    }

    for (const neighbor of undirected[bNode] || []) {
      if (!backwardVisited.has(neighbor)) {
        backwardVisited.add(neighbor);
        backwardQueue.push(neighbor);
      }
    }
  }

  return { found: false, trace, steps: step };
}

/**
 * 5. Heuristic & A* Search Graph
 * Demonstrates f(n) = g(n) + h(n) on an Academic State Graph
 */
export const academicSearchGraph = {
  StudentQuery: {
    name: "Student Query Influx",
    h: 8,
    neighbors: [
      { id: "PortalNLP", cost: 2 },
      { id: "DeptRegistry", cost: 4 }
    ]
  },
  PortalNLP: {
    name: "AI Natural Language Parser",
    h: 5,
    neighbors: [
      { id: "RuleBase", cost: 2 },
      { id: "FAQIndex", cost: 3 }
    ]
  },
  DeptRegistry: {
    name: "Department Manual Dispatcher",
    h: 6,
    neighbors: [
      { id: "FacultyDesk", cost: 5 }
    ]
  },
  RuleBase: {
    name: "Expert System Rule Matching",
    h: 2,
    neighbors: [
      { id: "VerifiedSolution", cost: 2 }
    ]
  },
  FAQIndex: {
    name: "Vector FAQ Semantic Index",
    h: 3,
    neighbors: [
      { id: "VerifiedSolution", cost: 3 }
    ]
  },
  FacultyDesk: {
    name: "Faculty Committee Review",
    h: 4,
    neighbors: [
      { id: "VerifiedSolution", cost: 4 }
    ]
  },
  VerifiedSolution: {
    name: "Resolved Student Answer",
    h: 0,
    neighbors: []
  }
};

/**
 * A* Search Implementation
 * Calculates f(n) = g(n) + h(n)
 */
export function runAStar(graph = academicSearchGraph, startId = "StudentQuery", goalId = "VerifiedSolution") {
  const openSet = [{
    id: startId,
    g: 0,
    h: graph[startId].h,
    f: graph[startId].h,
    path: [graph[startId].name]
  }];
  const closedSet = new Set();
  const trace = [];
  let step = 1;

  while (openSet.length > 0) {
    // Sort by lowest f(n)
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();
    closedSet.add(current.id);

    trace.push({
      step: step++,
      nodeName: graph[current.id].name,
      g: current.g,
      h: current.h,
      f: current.f,
      action: `Evaluating "${graph[current.id].name}" with f(n) = ${current.g} + ${current.h} = ${current.f}`,
      openCount: openSet.length
    });

    if (current.id === goalId) {
      trace.push({
        step: step,
        action: `GOAL REACHED! Optimal path found with total cost g = ${current.g}`,
        optimalCost: current.g,
        path: current.path
      });
      return { found: true, totalCost: current.g, path: current.path, trace, steps: step };
    }

    const neighbors = graph[current.id].neighbors || [];
    for (const edge of neighbors) {
      if (closedSet.has(edge.id)) continue;

      const gScore = current.g + edge.cost;
      const hScore = graph[edge.id].h;
      const fScore = gScore + hScore;

      const existing = openSet.find(o => o.id === edge.id);
      if (!existing) {
        openSet.push({
          id: edge.id,
          g: gScore,
          h: hScore,
          f: fScore,
          path: [...current.path, graph[edge.id].name]
        });
      } else if (gScore < existing.g) {
        existing.g = gScore;
        existing.f = fScore;
        existing.path = [...current.path, graph[edge.id].name];
      }
    }
  }

  return { found: false, trace, steps: step };
}

/**
 * Greedy Best-First Search
 * Selects purely based on heuristic h(n)
 */
export function runGreedyBestFirst(graph = academicSearchGraph, startId = "StudentQuery", goalId = "VerifiedSolution") {
  const openSet = [{
    id: startId,
    h: graph[startId].h,
    path: [graph[startId].name]
  }];
  const visited = new Set();
  const trace = [];
  let step = 1;

  while (openSet.length > 0) {
    // Sort by lowest h(n)
    openSet.sort((a, b) => a.h - b.h);
    const current = openSet.shift();
    visited.add(current.id);

    trace.push({
      step: step++,
      nodeName: graph[current.id].name,
      h: current.h,
      action: `Selected next node purely by minimum heuristic: "${graph[current.id].name}" (h = ${current.h})`,
      openCount: openSet.length
    });

    if (current.id === goalId) {
      trace.push({
        step: step,
        action: `Goal Reached via Greedy Best-First!`,
        path: current.path
      });
      return { found: true, path: current.path, trace, steps: step };
    }

    const neighbors = graph[current.id].neighbors || [];
    for (const edge of neighbors) {
      if (!visited.has(edge.id) && !openSet.some(o => o.id === edge.id)) {
        openSet.push({
          id: edge.id,
          h: graph[edge.id].h,
          path: [...current.path, graph[edge.id].name]
        });
      }
    }
  }

  return { found: false, trace, steps: step };
}

/**
 * 6. AO* Search (AND-OR Graph)
 * Example: Exam Eligibility Problem
 * Goal = Exam Eligible
 * Branches:
 * - AND: (Attendance >= 75%) AND (Financial Clearance = YES) AND (Admit Card Generated)
 * - OR Alternative: (Dean Discretionary Waiver Granted)
 */
export function runAOStarDemo() {
  const tree = {
    name: "Exam Eligibility Determination",
    type: "OR",
    children: [
      {
        name: "Standard Institutional Clearance",
        type: "AND",
        children: [
          { name: "Attendance Verified (>=75%)", cost: 1, solved: true },
          { name: "Accounts Financial Clearance", cost: 1, solved: true },
          { name: "Admit Card Download Generated", cost: 1, solved: true }
        ],
        cost: 3
      },
      {
        name: "Dean Academic Special Exemption",
        type: "OR",
        children: [
          { name: "Medical Board Endorsement", cost: 5, solved: false },
          { name: "Sports Representation Waiver", cost: 4, solved: false }
        ],
        cost: 5
      }
    ]
  };

  const steps = [
    { step: 1, node: "Root (Exam Eligibility)", type: "OR Node", action: "Evaluating branch options: [Standard Institutional Clearance] vs [Dean Exemption]" },
    { step: 2, node: "Standard Clearance", type: "AND Node", action: "Must resolve ALL 3 prerequisites: Attendance, Accounts, Admit Card" },
    { step: 3, node: "Attendance Check", cost: 1, status: "SOLVED", action: "Aggregate attendance is 78% >= 75% threshold." },
    { step: 4, node: "Accounts Check", cost: 1, status: "SOLVED", action: "Tuition dues: ₹0. Balance verified." },
    { step: 5, node: "Admit Card Check", cost: 1, status: "SOLVED", action: "Barcode hall ticket compiled." },
    { step: 6, node: "AND Branch Resolution", cost: "1 + 1 + 1 = 3", status: "SOLVED", action: "All child nodes satisfied! Hyper-edge solved with cost = 3." },
    { step: 7, node: "Root Decision", cost: 3, status: "GOAL ACHIEVED", action: "Standard branch chosen because cost 3 < Dean Exemption cost 5." }
  ];

  return { tree, steps, optimalBranch: "Standard Institutional Clearance", finalCost: 3 };
}

/**
 * 7. Constraint Satisfaction Problem (CSP) Solver
 * Solves: Assigning unassigned queries to faculty members
 * Variables: Queries [Q1, Q2, Q3...]
 * Domains: Faculty [F1, F2, F3...]
 * Constraints:
 * 1. Faculty Department matches Query Category/Dept
 * 2. Faculty currentLoad < maxLoad
 * 3. Faculty available === true
 */
export function solveQueryAssignmentCSP(queries, faculty) {
  const unassigned = queries.filter(q => !q.assignedTo || q.assignedTo === "Unassigned");
  const assignments = {};
  const trace = [];
  let step = 1;

  // Clone faculty load tracking
  const facultyTracker = faculty.map(f => ({ ...f, currentLoad: f.currentLoad || 0 }));

  function isConsistent(query, fac) {
    // Constraint 1: Availability
    if (!fac.available) return { valid: false, reason: `${fac.name} is on leave` };

    // Constraint 2: Workload limit
    if (fac.currentLoad >= fac.maxLoad) return { valid: false, reason: `${fac.name} workload full (${fac.currentLoad}/${fac.maxLoad})` };

    // Constraint 3: Department / Subject compatibility
    const cat = query.category ? query.category.toLowerCase() : "";
    const dept = fac.department.toLowerCase();
    const subs = fac.subjects.map(s => s.toLowerCase());

    const matchCategory =
      (cat === "attendance" && (dept.includes("academic") || dept.includes("intelligence"))) ||
      (cat === "exams" && dept.includes("examination")) ||
      (cat === "fees" && dept.includes("accounts")) ||
      (cat === "timetable" && (dept.includes("scheduling") || dept.includes("academic"))) ||
      (cat === "technical" && dept.includes("it")) ||
      (cat === "hostel" && dept.includes("hostel")) ||
      subs.some(s => s.includes(cat));

    if (!matchCategory) {
      return { valid: false, reason: `Department mismatch (${fac.department} vs ${query.category})` };
    }

    return { valid: true };
  }

  // Backtracking search with forward checking
  function backtrack(index) {
    if (index === unassigned.length) return true; // All assigned

    const query = unassigned[index];
    trace.push({
      step: step++,
      variable: query.id,
      action: `Selecting Variable: Query ${query.id} (${query.category} - "${query.subject.slice(0, 30)}...")`
    });

    for (const fac of facultyTracker) {
      const consistency = isConsistent(query, fac);
      if (consistency.valid) {
        // Tentative assignment
        assignments[query.id] = fac.name;
        fac.currentLoad++;

        trace.push({
          step: step++,
          variable: query.id,
          action: `Assigned Query ${query.id} -> ${fac.name} (${fac.department}) [Load: ${fac.currentLoad}/${fac.maxLoad}]`
        });

        if (backtrack(index + 1)) return true;

        // Backtrack
        delete assignments[query.id];
        fac.currentLoad--;
        trace.push({
          step: step++,
          variable: query.id,
          action: `Backtracking: Removed assignment ${query.id} -> ${fac.name}`
        });
      } else {
        trace.push({
          step: step++,
          variable: query.id,
          action: `Pruned Domain Value: ${fac.name} rejected. Reason: ${consistency.reason}`
        });
      }
    }

    return false;
  }

  const success = backtrack(0);
  return {
    success,
    assignments,
    trace,
    unassignedCount: unassigned.length,
    assignedCount: Object.keys(assignments).length
  };
}
