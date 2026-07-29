import assert from "node:assert/strict";
import test from "node:test";
import type { TaskResponse } from "../src/modules/task/types/task.types";
import { buildTaskTree, filterTaskTree } from "../src/modules/task/utils/task-tree";

const task = (id: string, parentId: string | null, title: string): TaskResponse => ({
  id,
  parentId,
  title,
  description: null,
  status: "TODO",
  sortOrder: 0,
  projectId: "project-id",
  createdAt: new Date(),
  updatedAt: new Date(),
});

test("buildTaskTree nests descendants under their parent", () => {
  const tree = buildTaskTree([
    task("a", null, "Task A"),
    task("a1", "a", "Task A1"),
    task("a11", "a1", "Task A1.1"),
    task("b", null, "Task B"),
  ]);

  assert.equal(tree.length, 2);
  assert.equal(tree[0].children[0].id, "a1");
  assert.equal(tree[0].children[0].children[0].id, "a11");
});

test("filterTaskTree preserves ancestors of a matching task", () => {
  const tree = buildTaskTree([
    task("a", null, "Task A"),
    task("a1", "a", "Task A1"),
    task("a12", "a1", "Task A12"),
    task("b", null, "Task B"),
  ]);
  const filtered = filterTaskTree(tree, (node) => node.title === "Task A12");

  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, "a");
  assert.equal(filtered[0].children[0].id, "a1");
  assert.equal(filtered[0].children[0].children[0].id, "a12");
});
