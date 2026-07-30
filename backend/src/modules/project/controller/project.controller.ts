import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../common/helpers/response";
import { ProjectMapper } from "../mapper/project.mapper";
import { ProjectService } from "../service/project.service";
import type { ProjectQueryDto } from "../dto/project.dto";
import { buildMeta } from "../../../common/query/query-builder";

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

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = (res.locals.validatedQuery ?? req.query) as ProjectQueryDto;
      const result = await this.service.findAll(query);
      return sendResponse(
        res,
        200,
        "Projects retrieved",
        ProjectMapper.toResponseList(result.data),
        buildMeta(query, result.total),
      );
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
