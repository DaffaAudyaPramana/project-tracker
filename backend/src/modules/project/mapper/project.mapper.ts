import { Project } from "@prisma/client";

export class ProjectMapper {
  static toResponse(project: Project) {
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      progress: project.progress,
      startDate: project.startDate,
      endDate: project.endDate,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }

  static toResponseList(projects: Project[]) {
    return projects.map(this.toResponse);
  }
}