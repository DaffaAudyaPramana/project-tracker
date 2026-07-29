import { Router } from "express";
import { validate, validateQuery } from "../../../common/middleware/validate.middleware";
import { ProjectController } from "../controller/project.controller";
import { createProjectSchema, updateProjectSchema } from "../dto/project.dto";
import { TaskController } from "../../task/controller/task.controller";
import { taskFilterSchema } from "../../task/dto/task.dto";

const projectRouter = Router();
const controller = new ProjectController();
const taskController = new TaskController();

projectRouter.post("/", validate(createProjectSchema), controller.create);
projectRouter.get("/", controller.findAll);
projectRouter.get(
  "/:projectId/tasks",
  validateQuery(taskFilterSchema.omit({ projectId: true })),
  taskController.getProjectTaskTree,
);
projectRouter.get("/:id", controller.findById);
projectRouter.patch("/:id", validate(updateProjectSchema), controller.update);
projectRouter.delete("/:id", controller.delete);

export default projectRouter;
