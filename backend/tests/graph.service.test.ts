import { expect, test } from "vitest";
import { GraphService } from "../src/modules/task/services/graph.service";

const graph = new GraphService();

test("GraphService detects a directed dependency cycle with DFS", () => {
  expect(
    graph.hasCycle([
      { from: "A", to: "B" },
      { from: "B", to: "C" },
      { from: "C", to: "A" },
    ]),
  ).toBe(true);
});

test("GraphService accepts an acyclic dependency graph", () => {
  expect(
    graph.hasCycle([
      { from: "A", to: "B" },
      { from: "B", to: "C" },
      { from: "D", to: "C" },
    ]),
  ).toBe(false);
});
