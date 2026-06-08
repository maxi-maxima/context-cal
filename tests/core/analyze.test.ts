import { describe, expect, test } from "vitest";
import { analyzeContext } from "../../src/core/analyze.js";
import type { ContextFile } from "../../src/core/types.js";

function file(relativePath: string, content: string): ContextFile {
  return {
    absolutePath: `/repo/${relativePath}`,
    relativePath,
    kind: relativePath.endsWith(".json") ? "mcp-config" : "agent-instructions",
    content
  };
}

describe("analyzeContext", () => {
  test("flags repeated instructions across agent files", () => {
    const result = analyzeContext([
      file("AGENTS.md", "- Run npm test before commits.\n- Keep changes scoped."),
      file("CLAUDE.md", "- Run npm test before commits.\n- Prefer small files.")
    ]);

    expect(result.findings.some((finding) => finding.ruleId === "duplicate-instruction")).toBe(true);
  });

  test("flags tool-specific leakage in shared AGENTS.md", () => {
    const result = analyzeContext([
      file("AGENTS.md", "Claude Code must use the Task tool for every step.")
    ]);

    expect(result.findings).toContainEqual(
      expect.objectContaining({
        ruleId: "tool-specific-leakage",
        severity: "medium",
        file: "AGENTS.md"
      })
    );
  });

  test("flags broad context loading instructions", () => {
    const result = analyzeContext([
      file("GEMINI.md", "Always read every file in the repository before answering.")
    ]);

    expect(result.findings).toContainEqual(
      expect.objectContaining({
        ruleId: "broad-context-loading",
        severity: "high"
      })
    );
  });

  test("counts MCP servers as tool menu calories", () => {
    const result = analyzeContext([
      file(".mcp.json", JSON.stringify({ mcpServers: { a: {}, b: {}, c: {}, d: {}, e: {}, f: {} } }))
    ]);

    expect(result.mcpServerCount).toBe(6);
    expect(result.findings).toContainEqual(
      expect.objectContaining({
        ruleId: "large-mcp-menu",
        severity: "medium"
      })
    );
  });
});
