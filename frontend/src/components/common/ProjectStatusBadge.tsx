import React from 'react';
import type { ProjectStatus } from '@/types/project.types';

import { Badge } from '@/components/ui/badge';

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

export const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({
  status,
  className,
}) => {
  switch (status) {
    case 'TODO':
      return (
        <Badge variant="todo" className={className}>
          🟡 TODO
        </Badge>
      );
    case 'IN_PROGRESS':
      return (
        <Badge variant="inProgress" className={className}>
          🔵 IN_PROGRESS
        </Badge>
      );
    case 'DONE':
      return (
        <Badge variant="done" className={className}>
          🟢 DONE
        </Badge>
      );
    default:
      return <Badge variant="outline" className={className}>{status}</Badge>;
  }
};
