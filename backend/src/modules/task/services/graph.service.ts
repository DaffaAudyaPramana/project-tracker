export type GraphEdge = {
  from: string;
  to: string;
};

/** Reusable directed-graph traversal service. */
export class GraphService {
  hasCycle(edges: GraphEdge[]): boolean {
    const adjacency = new Map<string, string[]>();

    for (const { from, to } of edges) {
      adjacency.set(from, [...(adjacency.get(from) ?? []), to]);
      if (!adjacency.has(to)) adjacency.set(to, []);
    }

    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const visit = (node: string): boolean => {
      if (recursionStack.has(node)) return true;
      if (visited.has(node)) return false;

      visited.add(node);
      recursionStack.add(node);

      for (const neighbor of adjacency.get(node) ?? []) {
        if (visit(neighbor)) return true;
      }

      recursionStack.delete(node);
      return false;
    };

    return [...adjacency.keys()].some(visit);
  }
}
