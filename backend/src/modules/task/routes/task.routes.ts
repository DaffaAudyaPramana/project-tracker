import { Router } from "express";
import { validate, validateQuery } from "../../../common/middleware/validate.middleware";
import { TaskController } from "../controller/task.controller";
import { TaskDependencyController } from "../controller/task-dependency.controller";
import { createTaskSchema, taskFilterSchema, updateTaskSchema } from "../dto/task.dto";
import { createTaskDependencySchema, updateTaskDependencySchema } from "../dto/task-dependency.dto";

const taskRouter = Router();
const controller = new TaskController();
const dependencyController = new TaskDependencyController();

taskRouter.post("/", validate(createTaskSchema), controller.create);
taskRouter.get("/", validateQuery(taskFilterSchema), controller.findAll);
taskRouter.post("/:taskId/dependencies", validate(createTaskDependencySchema), dependencyController.create);
taskRouter.get("/:taskId/dependencies", dependencyController.findAll);
taskRouter.get("/:taskId/dependencies/:id", dependencyController.findById);
taskRouter.patch("/:taskId/dependencies/:id", validate(updateTaskDependencySchema), dependencyController.update);
taskRouter.delete("/:taskId/dependencies/:id", dependencyController.delete);
taskRouter.get("/:id", controller.findById);
taskRouter.patch("/:id", validate(updateTaskSchema), controller.update);
taskRouter.delete("/:id", controller.delete);

export default taskRouter;
