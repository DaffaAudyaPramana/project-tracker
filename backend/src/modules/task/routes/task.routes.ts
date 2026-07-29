import { Router } from "express";
import { validate, validateQuery } from "../../../common/middleware/validate.middleware";
import { TaskController } from "../controller/task.controller";
import { createTaskSchema, taskFilterSchema, updateTaskSchema } from "../dto/task.dto";

const taskRouter = Router();
const controller = new TaskController();

taskRouter.post("/", validate(createTaskSchema), controller.create);
taskRouter.get("/", validateQuery(taskFilterSchema), controller.findAll);
taskRouter.get("/:id", controller.findById);
taskRouter.patch("/:id", validate(updateTaskSchema), controller.update);
taskRouter.delete("/:id", controller.delete);

export default taskRouter;
