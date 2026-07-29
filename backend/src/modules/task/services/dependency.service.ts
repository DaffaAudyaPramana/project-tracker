import { AppError } from "../../../common/errors/AppError";
import { GraphService } from "./graph.service";
import { StatusService } from "./status.service";
import { TaskDependencyRepository } from "../repository/task-dependency.repository";
import { TaskRepository } from "../repository/task.repository";

export class DependencyService {
  constructor(
    private readonly repository = new TaskDependencyRepository(),
    private readonly taskRepository = new TaskRepository(),
    private readonly graphService = new GraphService(),
    private readonly statusService = new StatusService(),
  ) {}

  async create(taskId: string, dependsOnTaskId: string) {
    await this.validateCandidate(taskId, dependsOnTaskId);
    const dependency = await this.repository.create(taskId, dependsOnTaskId);
    if (await this.statusService.synchronizeTaskStatus(taskId)) {
      await this.statusService.reopenDoneDependents(taskId);
    }
    return dependency;
  }

  async findAll(taskId: string) {
    await this.findTaskOrThrow(taskId);
    return this.repository.findAllByTaskId(taskId);
  }

  async findById(taskId: string, id: string) {
    const dependency = await this.repository.findById(id);
    if (!dependency || dependency.taskId !== taskId) throw new AppError("Task dependency not found", 404);
    return dependency;
  }

  async update(taskId: string, id: string, dependsOnTaskId: string) {
    await this.findById(taskId, id);
    await this.validateCandidate(taskId, dependsOnTaskId, id);
    const dependency = await this.repository.update(id, dependsOnTaskId);
    if (await this.statusService.synchronizeTaskStatus(taskId)) {
      await this.statusService.reopenDoneDependents(taskId);
    }
    return dependency;
  }

  async delete(taskId: string, id: string) {
    await this.findById(taskId, id);
    return this.repository.delete(id);
  }

  private async validateCandidate(taskId: string, dependsOnTaskId: string, excludeId?: string) {
    if (taskId === dependsOnTaskId) throw new AppError("A task cannot depend on itself", 400);

    const [task, dependencyTask] = await Promise.all([
      this.findTaskOrThrow(taskId),
      this.findTaskOrThrow(dependsOnTaskId),
    ]);

    if (task.projectId !== dependencyTask.projectId) {
      throw new AppError("Tasks in a dependency must belong to the same project", 400);
    }

    const duplicate = await this.repository.findByPair(taskId, dependsOnTaskId);
    if (duplicate && duplicate.id !== excludeId) {
      throw new AppError("Task dependency already exists", 409);
    }

    const currentDependencies = await this.repository.findAllByProjectId(task.projectId);
    const edges = currentDependencies
      .filter((dependency) => dependency.id !== excludeId)
      .map((dependency) => ({ from: dependency.taskId, to: dependency.dependsOnTaskId }));
    edges.push({ from: taskId, to: dependsOnTaskId });

    if (this.graphService.hasCycle(edges)) {
      throw new AppError("Task dependency creates a circular dependency", 409);
    }
  }

  private async findTaskOrThrow(id: string) {
    const task = await this.taskRepository.findById(id);
    if (!task) throw new AppError("Task not found", 404);
    return task;
  }
}
