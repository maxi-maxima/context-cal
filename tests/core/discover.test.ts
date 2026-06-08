import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, test } from "vitest";
import { discoverContextFiles } from "../../src/core/discover.js";

const roots: string[] = [];

async function makeWorkspace(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "context-cal-"));
  roots.push(root);
  return root;
}

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("discoverContextFiles", () => {
  test("finds agent instruction files and MCP configs while ignoring generated folders", async () => {
    const root = await makeWorkspace();
    await mkdir(join(root, ".cursor", "rules"), { recursive: true });
    await mkdir(join(root, ".vscode"), { recursive: true });
    await mkdir(join(root, "node_modules"), { recursive: true });
    await writeFile(join(root, "AGENTS.md"), "Use npm test.");
    await writeFile(join(root, ".cursor", "rules", "frontend.md"), "Prefer accessible UI.");
    await writeFile(join(root, ".vscode", "mcp.json"), "{\"servers\":{}}");
    await writeFile(join(root, "node_modules", "CLAUDE.md"), "ignore me");

    const files = await discoverContextFiles(root);

    expect(files.map((file) => file.relativePath).sort()).toEqual([
      ".cursor/rules/frontend.md",
      ".vscode/mcp.json",
      "AGENTS.md"
    ]);
    expect(files.find((file) => file.relativePath === "AGENTS.md")?.kind).toBe("agent-instructions");
    expect(files.find((file) => file.relativePath === ".vscode/mcp.json")?.kind).toBe("mcp-config");
  });
});
