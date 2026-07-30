export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  sortOrder: number;
  projectId: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskTreeNode extends Task {
  children: TaskTreeNode[];
  dependencies?: TaskDependency[];
}

export interface TaskDependency {
  id: string;
  taskId: string;
  dependsOnTaskId: string;
  dependsOn?: Task;
  createdAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string | null;
  projectId: string;
  parentId?: string | null;
  status?: TaskStatus;
  sortOrder?: number;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string | null;
  parentId?: string | null;
  status?: TaskStatus;
  sortOrder?: number;
}

export interface CreateTaskDependencyPayload {
  dependsOnTaskId: string;
}

export interface TaskFilterDto {
  projectId?: string;
  search?: string;
  status?: TaskStatus;
}
