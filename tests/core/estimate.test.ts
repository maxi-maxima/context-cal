import { describe, expect, test } from "vitest";
import { estimateTokens } from "../../src/core/estimate.js";

describe("estimateTokens", () => {
  test("counts empty text as zero tokens", () => {
    expect(estimateTokens("")).toBe(0);
  });

  test("returns a stable rough estimate for mixed prose and code", () => {
    expect(estimateTokens("Read src/core first.\nRun npm test before commits.")).toBe(11);
  });
});
