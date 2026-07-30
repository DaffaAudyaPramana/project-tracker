import { expect, test } from "vitest";
import { ProgressService } from "../src/modules/progress/progress.service";

test("ProgressService calculates percentage from completed root tasks", () => {
  expect(ProgressService.calculateProjectProgress(2, 3)).toBe(67);
  expect(ProgressService.calculateProjectProgress(0, 0)).toBe(0);
  expect(ProgressService.calculateTaskProgress(2, 3)).toBe(67);
});

test("ProgressService derives status from progress", () => {
  expect(ProgressService.statusFromProgress(0)).toBe("TODO");
  expect(ProgressService.statusFromProgress(66)).toBe("IN_PROGRESS");
  expect(ProgressService.statusFromProgress(100)).toBe("DONE");
});
