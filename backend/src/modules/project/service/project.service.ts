import { ProjectRepository } from "../repository/project.repository";
import { AppError } from "../../../common/errors/AppError";
import { CreateProjectDto, UpdateProjectDto } from "../dto/project.dto";

export class ProjectService {
  constructor(private readonly repository = new ProjectRepository()) {}

  async create(data: CreateProjectDto) {
    const conflict = await this.repository.findScheduleConflict(data.startDate, data.endDate);

    if (conflict) {
      throw new AppError(`Project schedule conflicts with "${conflict.name}"`, 409);
    }

    return this.repository.create(data);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findById(id: string) {
    const project = await this.repository.findById(id);

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    return project;
  }

  async update(id: string, data: UpdateProjectDto) {
    const project = await this.findById(id);

    const startDate = data.startDate ?? project.startDate;
    const endDate = data.endDate ?? project.endDate;

    if (endDate < startDate) {
      throw new AppError("End date must be on or after start date", 400);
    }

    if (data.startDate || data.endDate) {
      const conflict = await this.repository.findScheduleConflict(startDate, endDate, id);

      if (conflict) {
        throw new AppError(`Project schedule conflicts with "${conflict.name}"`, 409);
      }
    }

    return this.repository.update(id, data);
  }

  async delete(id: string) {
    await this.findById(id);

    return this.repository.delete(id);
  }
}
