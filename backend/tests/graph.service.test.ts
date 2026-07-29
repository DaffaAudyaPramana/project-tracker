import assert from "node:assert/strict";
import test from "node:test";
import { GraphService } from "../src/modules/task/services/graph.service";

const graph = new GraphService();

test("GraphService detects a directed dependency cycle with DFS", () => {
  assert.equal(
    graph.hasCycle([
      { from: "A", to: "B" },
      { from: "B", to: "C" },
      { from: "C", to: "A" },
    ]),
    true,
  );
});

test("GraphService accepts an acyclic dependency graph", () => {
  assert.equal(
    graph.hasCycle([
      { from: "A", to: "B" },
      { from: "B", to: "C" },
      { from: "D", to: "C" },
    ]),
    false,
  );
});
