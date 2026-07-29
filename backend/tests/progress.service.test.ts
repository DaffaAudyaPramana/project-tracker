import assert from "node:assert/strict";
import test from "node:test";
import { ProgressService } from "../src/modules/progress/progress.service";

test("ProgressService calculates percentage from completed root tasks", () => {
  assert.equal(ProgressService.calculateProjectProgress(2, 3), 67);
  assert.equal(ProgressService.calculateProjectProgress(0, 0), 0);
  assert.equal(ProgressService.calculateTaskProgress(2, 3), 67);
});

test("ProgressService derives status from progress", () => {
  assert.equal(ProgressService.statusFromProgress(0), "TODO");
  assert.equal(ProgressService.statusFromProgress(66), "IN_PROGRESS");
  assert.equal(ProgressService.statusFromProgress(100), "DONE");
});
