import { prisma } from "../../../config/prisma";

export class TaskDependencyRepository {
  async create(taskId: string, dependsOnTaskId: string) {
    return prisma.taskDependency.create({ data: { taskId, dependsOnTaskId } });
  }

  async findAllByTaskId(taskId: string) {
    return prisma.taskDependency.findMany({
      where: { taskId },
      include: { dependsOn: true },
      orderBy: { createdAt: "asc" },
    });
  }

  async findById(id: string) {
    return prisma.taskDependency.findUnique({ where: { id } });
  }

  async findByPair(taskId: string, dependsOnTaskId: string) {
    return prisma.taskDependency.findUnique({
      where: { taskId_dependsOnTaskId: { taskId, dependsOnTaskId } },
    });
  }

  async findAllByProjectId(projectId: string) {
    return prisma.taskDependency.findMany({
      where: { task: { projectId } },
      select: { id: true, taskId: true, dependsOnTaskId: true },
    });
  }

  async update(id: string, dependsOnTaskId: string) {
    return prisma.taskDependency.update({ where: { id }, data: { dependsOnTaskId } });
  }

  async delete(id: string) {
    return prisma.taskDependency.delete({ where: { id } });
  }

  async hasIncompleteDependencies(taskId: string) {
    return (
      (await prisma.taskDependency.count({
        where: { taskId, dependsOn: { status: { not: "DONE" } } },
      })) > 0
    );
  }

  async findDependentTaskIds(taskId: string) {
    const dependencies = await prisma.taskDependency.findMany({
      where: { dependsOnTaskId: taskId },
      select: { taskId: true },
    });
    return dependencies.map((dependency) => dependency.taskId);
  }
}
