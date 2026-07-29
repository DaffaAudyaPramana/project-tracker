import { z } from "zod";

export const createProjectDependencySchema = z.object({
  dependsOnProjectId: z.string().cuid(),
});

export const updateProjectDependencySchema = createProjectDependencySchema;

export type ProjectDependencyDto = z.infer<typeof createProjectDependencySchema>;
