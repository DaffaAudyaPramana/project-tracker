import { z } from "zod";

const projectSortFields = ["name", "startDate", "endDate", "createdAt", "updatedAt"] as const;

const projectFields = {
  name: z.string().trim().min(3, "Project name must be at least 3 characters").max(100),
  description: z.string().trim().max(500).nullable().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
};

const hasValidDateRange = (data: { startDate?: Date; endDate?: Date }) =>
  !data.startDate || !data.endDate || data.endDate >= data.startDate;

export const createProjectSchema = z
  .object({
    ...projectFields,
    name: projectFields.name,
    startDate: projectFields.startDate,
    endDate: projectFields.endDate,
  })
  .refine(hasValidDateRange, {
    message: "End date must be on or after start date",
    path: ["endDate"],
  });

export const updateProjectSchema = z
  .object(projectFields)
  .partial()
  .refine(hasValidDateRange, {
    message: "End date must be on or after start date",
    path: ["endDate"],
  });

export const projectQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().min(1).max(100).optional(),
  sort: z.enum(projectSortFields).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateProjectDto = z.infer<typeof createProjectSchema>;
export type UpdateProjectDto = z.infer<typeof updateProjectSchema>;
export type ProjectQueryDto = z.infer<typeof projectQuerySchema>;
