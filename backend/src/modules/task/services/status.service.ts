import { TaskDependencyRepository } from "../repository/task-dependency.repository";
import { TaskRepository } from "../repository/task.repository";
import { AppError } from "../../../common/errors/AppError";

export class StatusService {
  constructor(
    private readonly taskRepository = new TaskRepository(),
    private readonly dependencyRepository = new TaskDependencyRepository(),
  ) {}

  async ensureCanMarkDone(taskId: string) {
    if (await this.taskRepository.hasChildren(taskId)) {
      throw new AppError("A task with child tasks cannot be marked as DONE", 400);
    }
    if (await this.dependencyRepository.hasIncompleteDependencies(taskId)) {
      throw new AppError("A task cannot be marked as DONE while a dependency is incomplete", 409);
    }
  }

  async synchronizeTaskStatus(taskId: string) {
    const task = await this.taskRepository.findById(taskId);
    if (task?.status === "DONE" && (await this.dependencyRepository.hasIncompleteDependencies(taskId))) {
      await this.taskRepository.updateStatus(taskId, "IN_PROGRESS");
      return true;
    }
    return false;
  }

  async reopenDoneDependents(taskId: string) {
    const visited = new Set<string>();
    const visit = async (currentId: string): Promise<void> => {
      if (visited.has(currentId)) return;
      visited.add(currentId);

      for (const dependentId of await this.dependencyRepository.findDependentTaskIds(currentId)) {
        const dependent = await this.taskRepository.findById(dependentId);
        if (dependent?.status === "DONE") {
          await this.taskRepository.updateStatus(dependentId, "IN_PROGRESS");
        }
        await visit(dependentId);
      }
    };

    await visit(taskId);
  }
}
