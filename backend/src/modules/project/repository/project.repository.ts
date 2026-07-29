import { prisma } from "../../../config/prisma";
import { CreateProjectDto, UpdateProjectDto } from "../dto/project.dto";

export class ProjectRepository {
  async create(data: CreateProjectDto) {
    return prisma.project.create({
      data,
    });
  }

  async findAll() {
    return prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
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
