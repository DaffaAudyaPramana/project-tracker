import type { Task } from "@prisma/client";
import type { TaskResponse } from "../types/task.types";

export class TaskMapper {
  static toResponse(task: Task): TaskResponse {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      sortOrder: task.sortOrder,
      projectId: task.projectId,
      parentId: task.parentId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }

  static toResponseList(tasks: Task[]): TaskResponse[] {
    return tasks.map((task) => this.toResponse(task));
  }
}
