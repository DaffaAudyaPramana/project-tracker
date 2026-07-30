import React from 'react';

import { ChevronRight, ChevronDown, Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectStatusBadge } from '@/components/common/ProjectStatusBadge';
import { DependencyBadge } from './DependencyBadge';
import type { TaskTreeNode, Task } from '../types';

interface TaskNodeProps {
  node: TaskTreeNode;
  projectId: string;
  expandedNodes: Set<string>;
  toggleNode: (id: string) => void;
  onAddSubtask: (parentId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  level?: number;
}

export const TaskNode: React.FC<TaskNodeProps> = ({
  node,
  projectId,
  expandedNodes,
  toggleNode,
  onAddSubtask,
  onEditTask,
  onDeleteTask,
  level = 0,
}) => {
  const isExpanded = expandedNodes.has(node.id);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col">
      {/* Node Row */}
      <div
        className="flex items-center justify-between py-2 px-3 hover:bg-muted/30 group border-b border-muted/20"
        style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-5 flex-shrink-0 flex items-center justify-center">
            {hasChildren ? (
              <button
                onClick={() => toggleNode(node.id)}
                className="p-0.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            ) : (
              <div className="w-4 h-4" />
            )}
          </div>
          <span className="font-medium text-sm text-foreground truncate">
            {node.title}
          </span>
          <DependencyBadge dependencies={node.dependencies || []} />
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <ProjectStatusBadge status={node.status} className="scale-90" />

          {/* Action buttons show on hover or on mobile */}
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              title="Add Subtask"
              onClick={() => onAddSubtask(node.id)}
            >
              <Plus className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              title="Edit Task"
              onClick={() => onEditTask(node)}
            >
              <Pencil className="h-3.5 w-3.5 text-blue-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              title="Delete Task"
              onClick={() => onDeleteTask(node)}
            >
              <Trash2 className="h-3.5 w-3.5 text-red-500" />
            </Button>
          </div>
        </div>
      </div>

      {/* Render Children Recursively */}
      {hasChildren && isExpanded && (
        <div className="flex flex-col">
          {node.children.map((child) => (
            <TaskNode
              key={child.id}
              node={child}
              projectId={projectId}
              expandedNodes={expandedNodes}
              toggleNode={toggleNode}
              onAddSubtask={onAddSubtask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
