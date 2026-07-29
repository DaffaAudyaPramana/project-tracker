import assert from "node:assert/strict";
import test from "node:test";
import { createProjectSchema, updateProjectSchema } from "../src/modules/project/dto/project.dto";

const validProject = {
  name: "Website redesign",
  startDate: "2026-08-01T00:00:00.000Z",
  endDate: "2026-08-10T00:00:00.000Z",
};

test("create project accepts a valid schedule", () => {
  const result = createProjectSchema.safeParse(validProject);
  assert.equal(result.success, true);
});

test("create project rejects an end date before its start date", () => {
  const result = createProjectSchema.safeParse({
    ...validProject,
    endDate: "2026-07-31T00:00:00.000Z",
  });
  assert.equal(result.success, false);
});

test("update project allows either schedule date independently", () => {
  const result = updateProjectSchema.safeParse({ endDate: "2026-08-12T00:00:00.000Z" });
  assert.equal(result.success, true);
});
