import { expect, test } from "vitest";
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

  expect(tree).toHaveLength(2);
  expect(tree[0].children[0].id).toBe("a1");
  expect(tree[0].children[0].children[0].id).toBe("a11");
});

test("filterTaskTree preserves ancestors of a matching task", () => {
  const tree = buildTaskTree([
    task("a", null, "Task A"),
    task("a1", "a", "Task A1"),
    task("a12", "a1", "Task A12"),
    task("b", null, "Task B"),
  ]);
  const filtered = filterTaskTree(tree, (node) => node.title === "Task A12");

  expect(filtered).toHaveLength(1);
  expect(filtered[0].id).toBe("a");
  expect(filtered[0].children[0].id).toBe("a1");
  expect(filtered[0].children[0].children[0].id).toBe("a12");
});
