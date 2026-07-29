import { z } from "zod";

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

export type CreateProjectDto = z.infer<typeof createProjectSchema>;
export type UpdateProjectDto = z.infer<typeof updateProjectSchema>;
