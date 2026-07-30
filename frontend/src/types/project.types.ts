export type ProjectStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    tasks?: number;
  };
}

export interface ProjectQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: ProjectStatus;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface CreateProjectPayload {
  name: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  status?: ProjectStatus;
}

export interface UpdateProjectPayload {
  name?: string;
  description?: string | null;
  startDate?: string;
  endDate?: string;
  status?: ProjectStatus;
  progress?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
}
