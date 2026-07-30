import { ProjectStatus } from "@prisma/client";

export interface ProjectResponse {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  progress: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}