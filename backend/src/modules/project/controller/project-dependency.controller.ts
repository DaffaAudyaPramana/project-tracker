import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../common/helpers/response";
import { ProjectDependencyService } from "../services/dependency.service";

export class ProjectDependencyController {
  constructor(private readonly service = new ProjectDependencyService()) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return sendResponse(
        res,
        201,
        "Project dependency created",
        await this.service.create(req.params.projectId as string, req.body.dependsOnProjectId),
      );
    } catch (error) {
      return next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return sendResponse(
        res,
        200,
        "Project dependencies retrieved",
        await this.service.findAll(req.params.projectId as string),
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
        "Project dependency retrieved",
        await this.service.findById(req.params.projectId as string, req.params.id as string),
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
        "Project dependency updated",
        await this.service.update(req.params.projectId as string, req.params.id as string, req.body.dependsOnProjectId),
      );
    } catch (error) {
      return next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.delete(req.params.projectId as string, req.params.id as string);
      return sendResponse(res, 200, "Project dependency deleted");
    } catch (error) {
      return next(error);
    }
  };
}
