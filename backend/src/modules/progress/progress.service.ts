import type { Task, TaskStatus } from "@prisma/client";
import { ProjectRepository } from "../project/repository/project.repository";
import { TaskDependencyRepository } from "../task/repository/task-dependency.repository";
import { TaskRepository } from "../task/repository/task.repository";
import { StatusService } from "../task/services/status.service";

export class ProgressService {
  constructor(
    private readonly projectRepository = new ProjectRepository(),
    private readonly taskRepository = new TaskRepository(),
    private readonly dependencyRepository = new TaskDependencyRepository(),
    private readonly statusService = new StatusService(),
  ) {}

  static calculateProjectProgress(completed: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  }

  static calculateTaskProgress(completedChildren: number, totalChildren: number): number {
    return this.calculateProjectProgress(completedChildren, totalChildren);
  }

  static statusFromProgress(progress: number): TaskStatus {
    if (progress === 0) return "TODO";
    if (progress === 100) return "DONE";
    return "IN_PROGRESS";
  }

  async recalculate(projectId: string) {
    const tasks = await this.taskRepository.findByProject(projectId);
    const childrenByParent = new Map<string, Task[]>();

    for (const task of tasks) {
      if (!task.parentId) continue;
      childrenByParent.set(task.parentId, [...(childrenByParent.get(task.parentId) ?? []), task]);
    }

    const resolvedStatus = new Map<string, TaskStatus>();
    const resolveTaskStatus = async (task: Task): Promise<TaskStatus> => {
      const cached = resolvedStatus.get(task.id);
      if (cached) return cached;

      const children = childrenByParent.get(task.id) ?? [];
      let nextStatus = task.status;

      if (children.length > 0) {
        const childStatuses = await Promise.all(children.map(resolveTaskStatus));
        nextStatus = ProgressService.statusFromProgress(
          ProgressService.calculateTaskProgress(
            childStatuses.filter((status) => status === "DONE").length,
            childStatuses.length,
          ),
        );
      }

      if (nextStatus === "DONE" && (await this.dependencyRepository.hasIncompleteDependencies(task.id))) {
        nextStatus = "IN_PROGRESS";
      }

      resolvedStatus.set(task.id, nextStatus);
      if (task.status !== nextStatus) {
        await this.taskRepository.updateStatus(task.id, nextStatus);
        if (task.status === "DONE" && nextStatus !== "DONE") {
          await this.statusService.reopenDoneDependents(task.id);
        }
      }
      return nextStatus;
    };

    const roots = tasks.filter((task) => !task.parentId);
    const rootStatuses = await Promise.all(roots.map(resolveTaskStatus));
    const progress = ProgressService.calculateProjectProgress(
      rootStatuses.filter((status) => status === "DONE").length,
      roots.length,
    );
    await this.projectRepository.updateProgressAndStatus(
      projectId,
      progress,
      ProgressService.statusFromProgress(progress),
    );
  }
}
