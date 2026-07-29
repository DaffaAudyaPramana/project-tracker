import type { TaskResponse, TaskTreeNode } from "../types/task.types";

export function buildTaskTree(tasks: TaskResponse[]): TaskTreeNode[] {
  const nodes = new Map<string, TaskTreeNode>();
  const roots: TaskTreeNode[] = [];

  for (const task of tasks) {
    nodes.set(task.id, { ...task, children: [] });
  }

  for (const node of nodes.values()) {
    const parent = node.parentId ? nodes.get(node.parentId) : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  }

  return roots;
}

export function filterTaskTree(
  nodes: TaskTreeNode[],
  predicate: (task: TaskTreeNode) => boolean,
): TaskTreeNode[] {
  return nodes.flatMap((node) => {
    const children = filterTaskTree(node.children, predicate);
    if (!predicate(node) && children.length === 0) return [];
    return [{ ...node, children }];
  });
}
