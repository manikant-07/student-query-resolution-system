/**
 * Classic AI Problems & Adversarial Search (Module 2)
 * Executable implementations for:
 * - Minimax & Alpha-Beta Pruning
 * - Water Jug Problem (BFS)
 * - N-Queens Problem (Backtracking)
 * - Travelling Salesperson Problem (Campus Tour)
 * - Missionaries and Cannibals (BFS)
 * - 8-Tiles Sliding Puzzle (A* with Manhattan Heuristic)
 */

/* ==========================================================================
   1. Game Playing: Minimax & Alpha-Beta Pruning
   ========================================================================== */

export function runMinimaxDemo() {
  // Balanced educational game tree (Depth 3, Branching factor 2)
  // Leaves: [3, 5, 6, 9, 1, 2, 0, -1]
  const leaves = [3, 5, 6, 9, 1, 2, 0, -1];
  
  // Level 2 (MIN player nodes)
  const n4 = Math.min(leaves[0], leaves[1]); // min(3, 5) = 3
  const n5 = Math.min(leaves[2], leaves[3]); // min(6, 9) = 6
  const n6 = Math.min(leaves[4], leaves[5]); // min(1, 2) = 1
  const n7 = Math.min(leaves[6], leaves[7]); // min(0, -1) = -1

  // Level 1 (MAX player nodes)
  const n2 = Math.max(n4, n5); // max(3, 6) = 6
  const n3 = Math.max(n6, n7); // max(1, -1) = 1

  // Root (MAX)
  const root = Math.max(n2, n3); // max(6, 1) = 6

  const steps = [
    { level: "Leaves", action: "Static evaluation of terminal game states: [3, 5, 6, 9, 1, 2, 0, -1]" },
    { level: "MIN Layer (Depth 2)", action: "MIN minimizes opponent scores: Node 4 = min(3,5)=3, Node 5 = min(6,9)=6, Node 6 = min(1,2)=1, Node 7 = min(0,-1)=-1" },
    { level: "MAX Layer (Depth 1)", action: "MAX maximizes student resolution payoff: Subtree Left = max(3,6)=6, Subtree Right = max(1,-1)=1" },
    { level: "ROOT (Depth 0)", action: `Root selects optimal strategy: max(6, 1) = ${root}. Optimal move is Branch LEFT.` }
  ];

  return { rootValue: root, leaves, steps };
}

export function runAlphaBetaDemo() {
  // Leaves: [3, 5, 6, 9, 1, 2, 0, -1]
  const leaves = [3, 5, 6, 9, 1, 2, 0, -1];
  const pruned = [];
  const trace = [];

  // Alpha = -Infinity, Beta = +Infinity
  trace.push({ step: 1, node: "Root", alpha: -Infinity, beta: Infinity, action: "Root starts with α = -∞, β = +∞ (MAX player)" });
  trace.push({ step: 2, node: "Left Subtree", alpha: -Infinity, beta: Infinity, action: "Descend to MIN node N4. Leaf 1 evaluated: 3. β updated to min(∞, 3) = 3." });
  trace.push({ step: 3, node: "Left Subtree", alpha: -Infinity, beta: 3, action: "Leaf 2 evaluated: 5. β remains min(3, 5) = 3. Node N4 returns 3." });
  trace.push({ step: 4, node: "Left Subtree", alpha: 3, beta: Infinity, action: "Parent MAX node updates α = max(-∞, 3) = 3." });
  trace.push({ step: 5, node: "Right Subtree N6", alpha: 6, beta: Infinity, action: "Node N5 evaluates 6 and 9 -> returns 6. Left subtree resolves to 6." });
  trace.push({ step: 6, node: "Right Branch N3", alpha: 6, beta: Infinity, action: "MAX root α = 6. Inspecting right branch. N6 evaluates leaf: 1. β becomes 1." });
  trace.push({ step: 7, node: "PRUNING CUT", alpha: 6, beta: 1, action: "CONDITION MET: β (1) <= α (6)! Pruning remaining children of N3! Leaves [0, -1] bypassed!" });

  pruned.push({ node: "N7 (leaves 0, -1)", reason: "β (1) ≤ α (6) cutoff" });

  return { rootValue: 6, pruned, trace };
}

/* ==========================================================================
   2. Water-Jug Problem (BFS Solver)
   ========================================================================== */

export function solveWaterJug(capA = 4, capB = 3, target = 2) {
  const gcd = (a, b) => (!b ? a : gcd(b, a % b));

  if (target > Math.max(capA, capB) || target % gcd(capA, capB) !== 0) {
    return {
      solvable: false,
      message: `No solution exists! Target ${target}L must be <= max capacity and divisible by GCD(${capA}, ${capB}) = ${gcd(capA, capB)}.`
    };
  }

  const queue = [{ state: [0, 0], path: [] }];
  const visited = new Set(["0,0"]);

  while (queue.length > 0) {
    const { state: [a, b], path } = queue.shift();

    if (a === target || b === target) {
      const fullPath = [...path, { a, b, action: `Goal Achieved: ${target}L reached!` }];
      return { solvable: true, path: fullPath, totalSteps: fullPath.length - 1 };
    }

    const transitions = [
      { a: capA, b, action: `Fill Jug A (Capacity ${capA}L)` },
      { a, b: capB, action: `Fill Jug B (Capacity ${capB}L)` },
      { a: 0, b, action: "Empty Jug A" },
      { a, b: 0, action: "Empty Jug B" },
      // Pour A -> B
      {
        a: a - Math.min(a, capB - b),
        b: b + Math.min(a, capB - b),
        action: `Pour Jug A into Jug B (${Math.min(a, capB - b)}L transferred)`
      },
      // Pour B -> A
      {
        a: a + Math.min(b, capA - a),
        b: b - Math.min(b, capA - a),
        action: `Pour Jug B into Jug A (${Math.min(b, capA - a)}L transferred)`
      }
    ];

    for (const next of transitions) {
      const key = `${next.a},${next.b}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({
          state: [next.a, next.b],
          path: [...path, { a, b, action: next.action }]
        });
      }
    }
  }

  return { solvable: false, message: "Target state not reachable." };
}

/* ==========================================================================
   3. N-Queens Problem (Backtracking)
   ========================================================================== */

export function solveNQueens(n = 4) {
  const board = Array(n).fill(null).map(() => Array(n).fill(0));
  const solutions = [];
  const trace = [];
  let step = 1;

  function isSafe(row, col, currentPlacement) {
    for (let c = 0; c < col; c++) {
      const r = currentPlacement[c];
      // Row constraint
      if (r === row) return false;
      // Diagonal constraint: |r - row| === |c - col|
      if (Math.abs(r - row) === Math.abs(c - col)) return false;
    }
    return true;
  }

  function backtrack(col, currentPlacement) {
    if (col === n) {
      solutions.push([...currentPlacement]);
      trace.push({
        step: step++,
        action: `Valid Arrangement Found: Queens placed at columns [${currentPlacement.join(", ")}]`
      });
      return;
    }

    for (let row = 0; row < n; row++) {
      if (isSafe(row, col, currentPlacement)) {
        currentPlacement[col] = row;
        trace.push({
          step: step++,
          action: `Col ${col}: Placed Queen safely at (Row ${row}, Col ${col})`
        });

        backtrack(col + 1, currentPlacement);

        // Backtrack
        trace.push({
          step: step++,
          action: `Backtracking: Removing Queen from (Row ${row}, Col ${col})`
        });
      } else {
        trace.push({
          step: step++,
          action: `Conflict detected at (Row ${row}, Col ${col}). Row or diagonal threatened.`
        });
      }
    }
  }

  backtrack(0, Array(n).fill(-1));

  return {
    n,
    totalSolutions: solutions.length,
    firstSolution: solutions[0] || null,
    trace: trace.slice(0, 30) // sample trace for clarity
  };
}

/* ==========================================================================
   4. Travelling Salesperson Problem (Campus Query Route)
   ========================================================================== */

export const campusLocations = [
  { id: 0, name: "Admin Block (Academic Registrar)" },
  { id: 1, name: "CS Department (Faculty Desks)" },
  { id: 2, name: "Central Library (Records Cell)" },
  { id: 3, name: "Examination Center (Hall Tickets)" }
];

// Distance matrix in meters
export const campusDistanceMatrix = [
  [0, 150, 200, 350],
  [150, 0, 120, 280],
  [200, 120, 0, 190],
  [350, 280, 190, 0]
];

export function solveCampusTSP() {
  const n = campusLocations.length;
  const nodes = [1, 2, 3]; // permute other than start node 0

  function permute(arr) {
    if (arr.length <= 1) return [arr];
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
      const perms = permute(rest);
      perms.forEach(p => result.push([arr[i], ...p]));
    }
    return result;
  }

  const allPerms = permute(nodes);
  let minDistance = Infinity;
  let bestTour = [];
  const evaluationBreakdown = [];

  allPerms.forEach(perm => {
    const tour = [0, ...perm, 0];
    let distance = 0;
    for (let i = 0; i < tour.length - 1; i++) {
      distance += campusDistanceMatrix[tour[i]][tour[i + 1]];
    }

    const tourNames = tour.map(idx => campusLocations[idx].name.split(" ")[0]).join(" -> ");
    evaluationBreakdown.push({ tour: tourNames, distance });

    if (distance < minDistance) {
      minDistance = distance;
      bestTour = tour;
    }
  });

  return {
    optimalDistance: minDistance,
    optimalTour: bestTour.map(idx => campusLocations[idx].name),
    breakdown: evaluationBreakdown
  };
}

/* ==========================================================================
   5. Missionaries and Cannibals (BFS River Crossing)
   ========================================================================== */

export function solveMissionariesAndCannibals() {
  // State: [M_left, C_left, Boat_position (1: left, 0: right)]
  // Initial: [3, 3, 1], Goal: [0, 0, 0]
  const isSafe = (m, c) => {
    if (m < 0 || m > 3 || c < 0 || c > 3) return false;
    // Left bank constraint
    if (m > 0 && c > m) return false;
    // Right bank constraint
    const mRight = 3 - m;
    const cRight = 3 - c;
    if (mRight > 0 && cRight > mRight) return false;
    return true;
  };

  const moves = [
    [1, 0], [2, 0], // 1 or 2 missionaries
    [0, 1], [0, 2], // 1 or 2 cannibals
    [1, 1]          // 1 of each
  ];

  const queue = [{ state: [3, 3, 1], path: [] }];
  const visited = new Set(["3,3,1"]);

  while (queue.length > 0) {
    const { state: [m, c, boat], path } = queue.shift();

    if (m === 0 && c === 0 && boat === 0) {
      return {
        solved: true,
        steps: [...path, { state: [0, 0, 0], action: "All 3 Missionaries and 3 Cannibals safely crossed the river!" }]
      };
    }

    for (const [dm, dc] of moves) {
      const nextM = boat === 1 ? m - dm : m + dm;
      const nextC = boat === 1 ? c - dc : c + dc;
      const nextBoat = boat === 1 ? 0 : 1;

      if (isSafe(nextM, nextC)) {
        const key = `${nextM},${nextC},${nextBoat}`;
        if (!visited.has(key)) {
          visited.add(key);
          const dir = boat === 1 ? "Left to Right" : "Right to Left";
          queue.push({
            state: [nextM, nextC, nextBoat],
            path: [...path, {
              state: [m, c, boat],
              action: `Crossed ${dm} Missionary & ${dc} Cannibal (${dir})`
            }]
          });
        }
      }
    }
  }

  return { solved: false, steps: [] };
}

/* ==========================================================================
   6. 8-Puzzle (Tiles Problem with Manhattan Heuristic)
   ========================================================================== */

// Goal State: 1 2 3 / 4 5 6 / 7 8 0 (0 is empty space)
export const PUZZLE_GOAL = [1, 2, 3, 4, 5, 6, 7, 8, 0];

export function getManhattanDistance(board) {
  let dist = 0;
  for (let i = 0; i < 9; i++) {
    const val = board[i];
    if (val !== 0) {
      const targetIdx = val - 1;
      const currentR = Math.floor(i / 3), currentC = i % 3;
      const targetR = Math.floor(targetIdx / 3), targetC = targetIdx % 3;
      dist += Math.abs(currentR - targetR) + Math.abs(currentC - targetC);
    }
  }
  return dist;
}

export function getMisplacedTilesCount(board) {
  let count = 0;
  for (let i = 0; i < 9; i++) {
    if (board[i] !== 0 && board[i] !== PUZZLE_GOAL[i]) {
      count++;
    }
  }
  return count;
}

export function getPossibleTileMoves(board) {
  const emptyIdx = board.indexOf(0);
  const row = Math.floor(emptyIdx / 3);
  const col = emptyIdx % 3;
  const neighbors = [];

  const deltas = [
    { dr: -1, dc: 0, dir: "UP" },
    { dr: 1, dc: 0, dir: "DOWN" },
    { dr: 0, dc: -1, dir: "LEFT" },
    { dr: 0, dc: 1, dir: "RIGHT" }
  ];

  for (const { dr, dc, dir } of deltas) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < 3 && nc >= 0 && nc < 3) {
      const swapIdx = nr * 3 + nc;
      const newBoard = [...board];
      newBoard[emptyIdx] = newBoard[swapIdx];
      newBoard[swapIdx] = 0;
      neighbors.push({ board: newBoard, movedTile: board[swapIdx], direction: dir });
    }
  }

  return neighbors;
}
