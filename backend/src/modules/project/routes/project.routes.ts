import { Router } from "express";
import { validate } from "../../../common/middleware/validate.middleware";
import { ProjectController } from "../controller/project.controller";
import { createProjectSchema, updateProjectSchema } from "../dto/project.dto";

const projectRouter = Router();
const controller = new ProjectController();

projectRouter.post("/", validate(createProjectSchema), controller.create);
projectRouter.get("/", controller.findAll);
projectRouter.get("/:id", controller.findById);
projectRouter.patch("/:id", validate(updateProjectSchema), controller.update);
projectRouter.delete("/:id", controller.delete);

export default projectRouter;
