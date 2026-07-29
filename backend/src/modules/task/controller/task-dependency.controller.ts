import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../common/helpers/response";
import { DependencyService } from "../services/dependency.service";

export class TaskDependencyController {
  constructor(private readonly service = new DependencyService()) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dependency = await this.service.create(req.params.taskId as string, req.body.dependsOnTaskId);
      return sendResponse(res, 201, "Task dependency created", dependency);
    } catch (error) {
      return next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return sendResponse(
        res,
        200,
        "Task dependencies retrieved",
        await this.service.findAll(req.params.taskId as string),
      );
    } catch (error) {
      return next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return sendResponse(
        res,
        200,
        "Task dependency retrieved",
        await this.service.findById(req.params.taskId as string, req.params.id as string),
      );
    } catch (error) {
      return next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return sendResponse(
        res,
        200,
        "Task dependency updated",
        await this.service.update(req.params.taskId as string, req.params.id as string, req.body.dependsOnTaskId),
      );
    } catch (error) {
      return next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.delete(req.params.taskId as string, req.params.id as string);
      return sendResponse(res, 200, "Task dependency deleted");
    } catch (error) {
      return next(error);
    }
  };
}
