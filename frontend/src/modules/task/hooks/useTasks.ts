import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../api/task.api';
import type {
  CreateTaskPayload,
  UpdateTaskPayload,
  TaskFilterDto,
  CreateTaskDependencyPayload,
} from '../types';

export const TASK_KEYS = {
  all: ['tasks'] as const,
  tree: (projectId: string, filters?: TaskFilterDto) => [...TASK_KEYS.all, 'tree', projectId, filters] as const,
  dependencies: (taskId: string) => [...TASK_KEYS.all, 'dependencies', taskId] as const,
};

export function useProjectTaskTree(projectId: string, filters?: TaskFilterDto) {
  return useQuery({
    queryKey: TASK_KEYS.tree(projectId, filters),
    queryFn: () => taskApi.getProjectTaskTree(projectId, filters),
    enabled: !!projectId,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => taskApi.createTask(payload),
    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTaskPayload }) =>
      taskApi.updateTask(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => taskApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
    },
  });
}

export function useTaskDependencies(taskId: string) {
  return useQuery({
    queryKey: TASK_KEYS.dependencies(taskId),
    queryFn: () => taskApi.getTaskDependencies(taskId),
    enabled: !!taskId,
  });
}

export function useCreateTaskDependency() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: CreateTaskDependencyPayload }) =>
      taskApi.createTaskDependency(taskId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.dependencies(variables.taskId) });
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
    },
  });
}

export function useDeleteTaskDependency() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, dependencyId }: { taskId: string; dependencyId: string }) =>
      taskApi.deleteTaskDependency(taskId, dependencyId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.dependencies(variables.taskId) });
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
    },
  });
}
