import type { Prisma } from "@prisma/client";
import { prisma } from "../../../config/prisma";
import { buildPagination, buildSearch, buildSorting } from "../../../common/query/query-builder";
import type { CreateTaskDto, TaskFilterDto, UpdateTaskDto } from "../dto/task.dto";

export class TaskRepository {
  async create(data: CreateTaskDto) {
    return prisma.task.create({ data });
  }

  async findAll(filters: TaskFilterDto) {
    const where: Prisma.TaskWhereInput = {
      ...(filters.projectId ? { projectId: filters.projectId } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(buildSearch(filters.search, ["title"]) as Prisma.TaskWhereInput),
    };

    const [data, total] = await prisma.$transaction([
      prisma.task.findMany({
        where,
        ...buildPagination(filters),
        orderBy: [buildSorting(filters.sort, filters.order), { createdAt: "asc" }],
      }),
      prisma.task.count({ where }),
    ]);
    return { data, total };
  }

  async findById(id: string) {
    return prisma.task.findUnique({ where: { id } });
  }

  async findByProject(projectId: string) {
    return prisma.task.findMany({
      where: { projectId },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
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
