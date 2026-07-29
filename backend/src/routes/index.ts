import { Router } from "express";
import { projectRouter } from "../modules/project";

const router = Router();

router.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Project Tracker API",
  });
});

router.use("/projects", projectRouter);

export default router;
