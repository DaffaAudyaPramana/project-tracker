import { api } from './api';
import type {
  Project,
  ProjectQuery,
  CreateProjectPayload,
  UpdateProjectPayload,
  PaginatedResponse,
  ApiResponse,
} from '@/types/project.types';


export const projectService = {
  getProjects: async (params?: ProjectQuery): Promise<PaginatedResponse<Project>> => {
    const response = await api.get<never, PaginatedResponse<Project>>('/projects', { params });
    return response;
  },

  getProjectById: async (id: string): Promise<ApiResponse<Project>> => {
    const response = await api.get<never, ApiResponse<Project>>(`/projects/${id}`);
    return response;
  },

  createProject: async (payload: CreateProjectPayload): Promise<ApiResponse<Project>> => {
    const response = await api.post<never, ApiResponse<Project>>('/projects', payload);
    return response;
  },

  updateProject: async (
    id: string,
    payload: UpdateProjectPayload
  ): Promise<ApiResponse<Project>> => {
    const response = await api.patch<never, ApiResponse<Project>>(`/projects/${id}`, payload);
    return response;
  },

  deleteProject: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<never, ApiResponse<null>>(`/projects/${id}`);
    return response;
  },
};
