import { assert } from "console";
import { INPUT } from "./input"
import { memoize } from "lodash";

const lines = INPUT.split('\n');

class Connection {
  constructor(public readonly left: string, public readonly right: string) {

  }

  connectsTo(computer: string) {
    return computer === this.left || computer === this.right;
  }

  getDestination(origin: string) {
    if (origin === this.left) {
      return this.right;
    }

    assert(this.right === origin);
    return this.left;
  }
}

const computers = new Set<string>();

const connections = lines.map((line) => {
  const [left, right] = line.split('-');
  computers.add(left);
  computers.add(right);
  return new Connection(left, right);
});

type Graph = Map<string, Set<string>>;
/**
 * Adds a connection to the graph.
 */
function addConnection(graph: Graph, node1: string, node2: string): void {
  if (!graph.has(node1)) graph.set(node1, new Set());
  if (!graph.has(node2)) graph.set(node2, new Set());

  graph.get(node1)!.add(node2);
  graph.get(node2)!.add(node1);
}

/**
* Finds all loops of exactly 3 nodes in the graph using memoization.
*/
function findThreeNodeLoops(graph: Graph): string[][] {
  const loops: string[][] = [];
  const visitedPairs = new Set<string>();

  for (const [node, neighbors] of graph) {
    for (const neighbor1 of neighbors) {
      for (const neighbor2 of neighbors) {
        if (
          neighbor1 !== neighbor2 && // Avoid self-loops
          graph.get(neighbor1)?.has(neighbor2) // Check if the third node connects back
        ) {
          // Generate a unique identifier for the loop to avoid duplicates
          const loopKey = [node, neighbor1, neighbor2].sort().join(',');

          if (!visitedPairs.has(loopKey)) {
            visitedPairs.add(loopKey); // Mark this combination as processed
            loops.push([node, neighbor1, neighbor2].sort());
          }
        }
      }
    }
  }

  return loops;
}


// Example usage
const graph: Graph = new Map();

connections.forEach(c => {
  addConnection(graph, c.left, c.right);
})

// Find loops of exactly 3 nodes
const loops = findThreeNodeLoops(graph);

//console.log(loops);


//console.log(loops.filter(loop => loop.some(id => id.startsWith("t"))))
const tFiltered = loops.filter(loop => loop.some(id => id.startsWith("t")));
console.log({ part1: tFiltered.length })