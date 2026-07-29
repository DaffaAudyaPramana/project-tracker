import { prisma } from "../../../config/prisma";
import { buildPagination, buildSearch, buildSorting } from "../../../common/query/query-builder";
import { CreateProjectDto, ProjectQueryDto, UpdateProjectDto } from "../dto/project.dto";

export class ProjectRepository {
  async create(data: CreateProjectDto) {
    return prisma.project.create({
      data,
    });
  }

  async findAll(query: ProjectQueryDto) {
    const where = buildSearch(query.search, ["name", "description"]);
    const [data, total] = await prisma.$transaction([
      prisma.project.findMany({
        where,
        ...buildPagination(query),
        orderBy: buildSorting(query.sort, query.order),
      }),
      prisma.project.count({ where }),
    ]);
    return { data, total };
  }

  async findById(id: string) {
    return prisma.project.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, data: UpdateProjectDto) {
    return prisma.project.update({
      where: {
        id,
      },
      data,
    });
  }

  async updateProgressAndStatus(
    id: string,
    progress: number,
    status: "TODO" | "IN_PROGRESS" | "DONE",
  ) {
    return prisma.project.update({ where: { id }, data: { progress, status } });
  }

  async delete(id: string) {
    return prisma.project.delete({
      where: {
        id,
      },
    });
  }

  async findScheduleConflict(startDate: Date, endDate: Date, excludeId?: string) {
    return prisma.project.findFirst({
      where: {
        ...(excludeId
          ? {
              NOT: {
                id: excludeId,
              },
            }
          : {}),

        startDate: {
          lte: endDate,
        },

        endDate: {
          gte: startDate,
        },
      },
    });
  }
}
