import { z } from "zod";

export const createTaskDependencySchema = z.object({
  dependsOnTaskId: z.string().cuid(),
});

export const updateTaskDependencySchema = createTaskDependencySchema;

export type TaskDependencyDto = z.infer<typeof createTaskDependencySchema>;
