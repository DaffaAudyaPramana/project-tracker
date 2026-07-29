import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../common/helpers/response";
import { TaskMapper } from "../mapper/task.mapper";
import { TaskService } from "../service/task.service";
import type { TaskFilterDto } from "../dto/task.dto";

export class TaskController {
  constructor(private readonly service = new TaskService()) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await this.service.create(req.body);
      return sendResponse(res, 201, "Task created", TaskMapper.toResponse(task));
    } catch (error) {
      return next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = (res.locals.validatedQuery ?? req.query) as TaskFilterDto;
      const tasks = await this.service.findAll(filters);
      return sendResponse(res, 200, "Tasks retrieved", TaskMapper.toResponseList(tasks));
    } catch (error) {
      return next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await this.service.findById(req.params.id as string);
      return sendResponse(res, 200, "Task retrieved", TaskMapper.toResponse(task));
    } catch (error) {
      return next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await this.service.update(req.params.id as string, req.body);
      return sendResponse(res, 200, "Task updated", TaskMapper.toResponse(task));
    } catch (error) {
      return next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.delete(req.params.id as string);
      return sendResponse(res, 200, "Task deleted");
    } catch (error) {
      return next(error);
    }
  };

  getProjectTaskTree = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tree = await this.service.getProjectTaskTree(
        req.params.projectId as string,
        (res.locals.validatedQuery ?? req.query) as Omit<TaskFilterDto, "projectId">,
      );
      return sendResponse(res, 200, "Project task tree retrieved", tree);
    } catch (error) {
      return next(error);
    }
  };
}
