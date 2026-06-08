import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, test } from "vitest";
import { scanWorkspace } from "../../src/core/scan.js";

const roots: string[] = [];

async function makeWorkspace(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "context-cal-scan-"));
  roots.push(root);
  return root;
}

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("scanWorkspace", () => {
  test("returns a graded report with totals and findings", async () => {
    const root = await makeWorkspace();
    await writeFile(
      join(root, "AGENTS.md"),
      [
        "Run npm test before commits.",
        "Run npm test before commits.",
        "Always read every file in the repository."
      ].join("\n")
    );

    const report = await scanWorkspace(root, { budget: 1000, maxFileTokens: 20 });

    expect(report.status).toBe("warn");
    expect(report.grade).toMatch(/[A-F]/);
    expect(report.totalTokens).toBeGreaterThan(0);
    expect(report.findings.map((finding) => finding.ruleId)).toEqual(
      expect.arrayContaining(["duplicate-instruction", "broad-context-loading"])
    );
  });
});
