import React from 'react';
import { Link2 } from 'lucide-react';
import type { TaskDependency } from '../types';

interface DependencyBadgeProps {
  dependencies: TaskDependency[];
}

export const DependencyBadge: React.FC<DependencyBadgeProps> = ({ dependencies }) => {
  if (!dependencies || dependencies.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {dependencies.map((dep) => (
        <span
          key={dep.id}
          className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20 dark:bg-rose-950/30 dark:text-rose-400 dark:ring-rose-900/50"
          title={`Depends on: ${dep.dependsOn?.title || dep.dependsOnTaskId}`}
        >
          <Link2 className="h-3 w-3" />
          {dep.dependsOn?.title || 'Unknown Task'}
        </span>
      ))}
    </div>
  );
};
