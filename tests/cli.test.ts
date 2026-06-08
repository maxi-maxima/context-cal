import { execFile } from "node:child_process";
import { access, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { afterEach, describe, expect, test } from "vitest";

const execFileAsync = promisify(execFile);
const roots: string[] = [];

async function makeWorkspace(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "context-cal-cli-"));
  roots.push(root);
  return root;
}

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("context-cal CLI", () => {
  test("scan writes JSON, Markdown, and HTML reports", async () => {
    const root = await makeWorkspace();
    const out = join(root, "reports");
    await writeFile(join(root, "AGENTS.md"), "Run npm test before commits.");

    const result = await execFileAsync(process.execPath, [
      "--import",
      "tsx",
      "src/cli.ts",
      "scan",
      root,
      "--out",
      out,
      "--budget",
      "8000"
    ]);

    expect(result.stdout).toContain("Context Cal");
    expect(result.stdout).toContain("Status:");
    await expect(access(join(out, "context-cal.json"))).resolves.toBeUndefined();
    await expect(access(join(out, "context-cal.md"))).resolves.toBeUndefined();
    await expect(access(join(out, "context-cal.html"))).resolves.toBeUndefined();
  });
});
