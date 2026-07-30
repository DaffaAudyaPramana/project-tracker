import { api } from '@/services/api';
import type { ApiResponse } from '@/types/project.types';
import type {
  Task,
  TaskTreeNode,
  TaskDependency,
  CreateTaskPayload,
  UpdateTaskPayload,
  CreateTaskDependencyPayload,
  TaskFilterDto,
} from '../types';

export const taskApi = {
  getProjectTaskTree: async (projectId: string, params?: TaskFilterDto): Promise<ApiResponse<TaskTreeNode[]>> => {
    return api.get<never, ApiResponse<TaskTreeNode[]>>(`/projects/${projectId}/tasks`, { params });
  },

  createTask: async (payload: CreateTaskPayload): Promise<ApiResponse<Task>> => {
    return api.post<never, ApiResponse<Task>>('/tasks', payload);
  },

  updateTask: async (id: string, payload: UpdateTaskPayload): Promise<ApiResponse<Task>> => {
    return api.patch<never, ApiResponse<Task>>(`/tasks/${id}`, payload);
  },

  deleteTask: async (id: string): Promise<ApiResponse<null>> => {
    return api.delete<never, ApiResponse<null>>(`/tasks/${id}`);
  },

  getTaskDependencies: async (taskId: string): Promise<ApiResponse<TaskDependency[]>> => {
    return api.get<never, ApiResponse<TaskDependency[]>>(`/tasks/${taskId}/dependencies`);
  },

  createTaskDependency: async (taskId: string, payload: CreateTaskDependencyPayload): Promise<ApiResponse<TaskDependency>> => {
    return api.post<never, ApiResponse<TaskDependency>>(`/tasks/${taskId}/dependencies`, payload);
  },

  deleteTaskDependency: async (taskId: string, dependencyId: string): Promise<ApiResponse<null>> => {
    return api.delete<never, ApiResponse<null>>(`/tasks/${taskId}/dependencies/${dependencyId}`);
  },
};
