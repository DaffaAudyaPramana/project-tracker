import { z } from "zod";

export const taskStatusSchema = z.enum(["TODO", "IN_PROGRESS", "DONE"]);

export const createTaskSchema = z.object({
  title: z.string().trim().min(3, "Task title must be at least 3 characters").max(100),
  description: z.string().trim().max(500).nullable().optional(),
  projectId: z.string().cuid(),
  parentId: z.string().cuid().nullable().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  status: taskStatusSchema.optional(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(3, "Task title must be at least 3 characters").max(100).optional(),
    description: z.string().trim().max(500).nullable().optional(),
    parentId: z.string().cuid().nullable().optional(),
    sortOrder: z.coerce.number().int().min(0).optional(),
    status: taskStatusSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const taskFilterSchema = z.object({
  projectId: z.string().cuid().optional(),
  search: z.string().trim().min(1).max(100).optional(),
  status: taskStatusSchema.optional(),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
export type TaskFilterDto = z.infer<typeof taskFilterSchema>;
