import React, { useState, useEffect } from 'react';
import { TaskNode } from './TaskNode';
import type { TaskTreeNode, Task } from '../types';

interface TaskTreeProps {
  tasks: TaskTreeNode[];
  projectId: string;
  onAddSubtask: (parentId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  expandAll?: boolean; // Default prop to expand all if we are searching
}

export const TaskTree: React.FC<TaskTreeProps> = ({
  tasks,
  projectId,
  onAddSubtask,
  onEditTask,
  onDeleteTask,
  expandAll = false,
}) => {
  // Set to store expanded node ids
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Function to recursively get all node IDs
  const getAllNodeIds = (nodes: TaskTreeNode[]): string[] => {
    let ids: string[] = [];
    for (const node of nodes) {
      ids.push(node.id);
      if (node.children && node.children.length > 0) {
        ids = ids.concat(getAllNodeIds(node.children));
      }
    }
    return ids;
  };

  // If expandAll is true, we want to open all nodes automatically
  useEffect(() => {
    if (expandAll) {
      setExpandedNodes(new Set(getAllNodeIds(tasks)));
    } else {
      setExpandedNodes(new Set());
    }
  }, [expandAll, tasks]);

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col w-full border rounded-lg bg-card overflow-hidden">
      <div className="flex items-center justify-between py-3 px-4 bg-muted/50 border-b text-xs font-semibold uppercase text-muted-foreground tracking-wider">
        <span>Task Name</span>
        <span>Actions & Status</span>
      </div>
      <div className="flex flex-col">
        {tasks.map((task) => (
          <TaskNode
            key={task.id}
            node={task}
            projectId={projectId}
            expandedNodes={expandedNodes}
            toggleNode={toggleNode}
            onAddSubtask={onAddSubtask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            level={0}
          />
        ))}
      </div>
    </div>
  );
};
