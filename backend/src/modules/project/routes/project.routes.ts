import { Router } from "express";
import { validate, validateQuery } from "../../../common/middleware/validate.middleware";
import { ProjectController } from "../controller/project.controller";
import { createProjectSchema, projectQuerySchema, updateProjectSchema } from "../dto/project.dto";
import { TaskController } from "../../task/controller/task.controller";
import { taskFilterSchema } from "../../task/dto/task.dto";
import { ProjectDependencyController } from "../controller/project-dependency.controller";
import {
  createProjectDependencySchema,
  updateProjectDependencySchema,
} from "../dto/project-dependency.dto";

const projectRouter = Router();
const controller = new ProjectController();
const taskController = new TaskController();
const dependencyController = new ProjectDependencyController();

projectRouter.post("/", validate(createProjectSchema), controller.create);
projectRouter.get("/", validateQuery(projectQuerySchema), controller.findAll);
projectRouter.get(
  "/:projectId/tasks",
  validateQuery(taskFilterSchema.omit({ projectId: true })),
  taskController.getProjectTaskTree,
);
projectRouter.post(
  "/:projectId/dependencies",
  validate(createProjectDependencySchema),
  dependencyController.create,
);
projectRouter.get("/:projectId/dependencies", dependencyController.findAll);
projectRouter.get("/:projectId/dependencies/:id", dependencyController.findById);
projectRouter.patch(
  "/:projectId/dependencies/:id",
  validate(updateProjectDependencySchema),
  dependencyController.update,
);
projectRouter.delete("/:projectId/dependencies/:id", dependencyController.delete);
projectRouter.get("/:id", controller.findById);
projectRouter.patch("/:id", validate(updateProjectSchema), controller.update);
projectRouter.delete("/:id", controller.delete);

export default projectRouter;
