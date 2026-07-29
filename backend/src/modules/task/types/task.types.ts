import type { TaskStatus } from "@prisma/client";

export interface TaskResponse {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  sortOrder: number;
  projectId: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskTreeNode extends TaskResponse {
  children: TaskTreeNode[];
}
