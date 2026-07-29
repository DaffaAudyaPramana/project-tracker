import type { Prisma } from "@prisma/client";
import { prisma } from "../../../config/prisma";
import type { CreateTaskDto, TaskFilterDto, UpdateTaskDto } from "../dto/task.dto";

export class TaskRepository {
  async create(data: CreateTaskDto) {
    return prisma.task.create({ data });
  }

  async findAll(filters: TaskFilterDto = {}) {
    const where: Prisma.TaskWhereInput = {
      ...(filters.projectId ? { projectId: filters.projectId } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.search ? { title: { contains: filters.search, mode: "insensitive" } } : {}),
    };

    return prisma.task.findMany({ where, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  }

  async findById(id: string) {
    return prisma.task.findUnique({ where: { id } });
  }

  async findByProject(projectId: string) {
    return this.findAll({ projectId });
  }

  async hasChildren(id: string) {
    return (await prisma.task.count({ where: { parentId: id } })) > 0;
  }

  async updateStatus(id: string, status: "TODO" | "IN_PROGRESS" | "DONE") {
    return prisma.task.update({ where: { id }, data: { status } });
  }

  async update(id: string, data: UpdateTaskDto) {
    return prisma.task.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.task.delete({ where: { id } });
  }
}
