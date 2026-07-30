import { AppError } from "../../../common/errors/AppError";
import { GraphService } from "../../task/services/graph.service";
import { ProjectDependencyRepository } from "../repository/project-dependency.repository";
import { ProjectRepository } from "../repository/project.repository";

export class ProjectDependencyService {
  constructor(
    private readonly repository = new ProjectDependencyRepository(),
    private readonly projectRepository = new ProjectRepository(),
    private readonly graphService = new GraphService(),
  ) {}

  async create(projectId: string, dependsOnProjectId: string) {
    await this.validateCandidate(projectId, dependsOnProjectId);
    return this.repository.create(projectId, dependsOnProjectId);
  }

  async findAll(projectId: string) {
    await this.findProjectOrThrow(projectId);
    return this.repository.findAllByProjectId(projectId);
  }

  async findById(projectId: string, id: string) {
    const dependency = await this.repository.findById(id);
    if (!dependency || dependency.projectId !== projectId) throw new AppError("Project dependency not found", 404);
    return dependency;
  }

  async update(projectId: string, id: string, dependsOnProjectId: string) {
    await this.findById(projectId, id);
    await this.validateCandidate(projectId, dependsOnProjectId, id);
    return this.repository.update(id, dependsOnProjectId);
  }

  async delete(projectId: string, id: string) {
    await this.findById(projectId, id);
    return this.repository.delete(id);
  }

  private async validateCandidate(projectId: string, dependsOnProjectId: string, excludeId?: string) {
    if (projectId === dependsOnProjectId) throw new AppError("A project cannot depend on itself", 400);
    await Promise.all([this.findProjectOrThrow(projectId), this.findProjectOrThrow(dependsOnProjectId)]);

    const duplicate = await this.repository.findByPair(projectId, dependsOnProjectId);
    if (duplicate && duplicate.id !== excludeId) {
      throw new AppError("Project dependency already exists", 409);
    }

    const edges = (await this.repository.findAll())
      .filter((dependency) => dependency.id !== excludeId)
      .map((dependency) => ({ from: dependency.projectId, to: dependency.dependsOnProjectId }));
    edges.push({ from: projectId, to: dependsOnProjectId });

    if (this.graphService.hasCycle(edges)) {
      throw new AppError("Project dependency creates a circular dependency", 409);
    }
  }

  private async findProjectOrThrow(id: string) {
    const project = await this.projectRepository.findById(id);
    if (!project) throw new AppError("Project not found", 404);
    return project;
  }
}
