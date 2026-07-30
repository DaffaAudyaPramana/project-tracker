import { prisma } from "../../../config/prisma";

export class ProjectDependencyRepository {
  async create(projectId: string, dependsOnProjectId: string) {
    return prisma.projectDependency.create({ data: { projectId, dependsOnProjectId } });
  }

  async findAllByProjectId(projectId: string) {
    return prisma.projectDependency.findMany({
      where: { projectId },
      include: { dependsOn: true },
      orderBy: { createdAt: "asc" },
    });
  }

  async findById(id: string) {
    return prisma.projectDependency.findUnique({ where: { id } });
  }

  async findByPair(projectId: string, dependsOnProjectId: string) {
    return prisma.projectDependency.findUnique({
      where: { projectId_dependsOnProjectId: { projectId, dependsOnProjectId } },
    });
  }

  async findAll() {
    return prisma.projectDependency.findMany({
      select: { id: true, projectId: true, dependsOnProjectId: true },
    });
  }

  async update(id: string, dependsOnProjectId: string) {
    return prisma.projectDependency.update({ where: { id }, data: { dependsOnProjectId } });
  }

  async delete(id: string) {
    return prisma.projectDependency.delete({ where: { id } });
  }
}
