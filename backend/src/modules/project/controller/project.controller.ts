import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../common/helpers/response";
import { ProjectMapper } from "../mapper/project.mapper";
import { ProjectService } from "../service/project.service";

export class ProjectController {
  constructor(private readonly service = new ProjectService()) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await this.service.create(req.body);
      return sendResponse(res, 201, "Project created", ProjectMapper.toResponse(project));
    } catch (error) {
      return next(error);
    }
  };

  findAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const projects = await this.service.findAll();
      return sendResponse(res, 200, "Projects retrieved", ProjectMapper.toResponseList(projects));
    } catch (error) {
      return next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await this.service.findById(req.params.id as string);
      return sendResponse(res, 200, "Project retrieved", ProjectMapper.toResponse(project));
    } catch (error) {
      return next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await this.service.update(req.params.id as string, req.body);
      return sendResponse(res, 200, "Project updated", ProjectMapper.toResponse(project));
    } catch (error) {
      return next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.delete(req.params.id as string);
      return sendResponse(res, 200, "Project deleted");
    } catch (error) {
      return next(error);
    }
  };
}
