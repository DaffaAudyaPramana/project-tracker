import type { Task } from "@prisma/client";
import { AppError } from "../../../common/errors/AppError";
import { ProjectRepository } from "../../project/repository/project.repository";
import type { CreateTaskDto, TaskFilterDto, UpdateTaskDto } from "../dto/task.dto";
import { TaskMapper } from "../mapper/task.mapper";
import { TaskRepository } from "../repository/task.repository";
import { buildTaskTree, filterTaskTree } from "../utils/task-tree";

export class TaskService {
  constructor(
    private readonly repository = new TaskRepository(),
    private readonly projectRepository = new ProjectRepository(),
  ) {}

  async create(data: CreateTaskDto) {
    await this.ensureProjectExists(data.projectId);
    await this.validateParent(data.parentId, data.projectId);
    return this.repository.create(data);
  }

  async findAll(filters: TaskFilterDto = {}) {
    return this.repository.findAll(filters);
  }

  async findById(id: string) {
    const task = await this.repository.findById(id);
    if (!task) throw new AppError("Task not found", 404);
    return task;
  }

  async getProjectTaskTree(projectId: string, filters: Omit<TaskFilterDto, "projectId"> = {}) {
    await this.ensureProjectExists(projectId);
    const tasks = await this.repository.findByProject(projectId);
    const tree = buildTaskTree(TaskMapper.toResponseList(tasks));

    if (!filters.search && !filters.status) return tree;

    const search = filters.search?.toLocaleLowerCase();
    return filterTaskTree(
      tree,
      (task) =>
        (!search || task.title.toLocaleLowerCase().includes(search)) &&
        (!filters.status || task.status === filters.status),
    );
  }

  async update(id: string, data: UpdateTaskDto) {
    const task = await this.findById(id);

    if (data.parentId !== undefined) {
      await this.validateParent(data.parentId, task.projectId, task.id);
    }

    if (
      data.status === "DONE" &&
      task.status !== "DONE" &&
      (await this.repository.hasChildren(id))
    ) {
      throw new AppError("A task with child tasks cannot be marked as DONE", 400);
    }

    return this.repository.update(id, data);
  }

  async delete(id: string) {
    await this.findById(id);
    return this.repository.delete(id);
  }

  private async ensureProjectExists(projectId: string) {
    const project = await this.projectRepository.findById(projectId);
    if (!project) throw new AppError("Project not found", 404);
  }

  private async validateParent(
    parentId: string | null | undefined,
    projectId: string,
    taskId?: string,
  ) {
    if (!parentId) return;
    if (parentId === taskId) throw new AppError("A task cannot be its own parent", 400);

    const parent = await this.repository.findById(parentId);
    if (!parent) throw new AppError("Parent task not found", 404);
    if (parent.projectId !== projectId)
      throw new AppError("Parent task must belong to the same project", 400);

    if (taskId) await this.ensureParentIsNotDescendant(parent, taskId);
  }

  private async ensureParentIsNotDescendant(parent: Task, taskId: string) {
    let current: Task | null = parent;
    while (current) {
      const parentId = current.parentId;
      if (!parentId) return;
      if (parentId === taskId) {
        throw new AppError("A task cannot be moved under one of its descendants", 400);
      }
      current = await this.repository.findById(parentId);
    }
  }
}
