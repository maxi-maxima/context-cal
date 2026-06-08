import { describe, expect, test } from "vitest";
import { renderConsoleSummary } from "../../src/report/console.js";
import { renderHtmlReport } from "../../src/report/html.js";
import { renderMarkdownReport } from "../../src/report/markdown.js";
import type { ScanReport } from "../../src/core/types.js";

const report: ScanReport = {
  tool: "context-cal",
  version: "0.1.0-test",
  root: "/repo",
  generatedAt: "2026-06-08T00:00:00.000Z",
  budget: 8000,
  maxFileTokens: 1800,
  totalTokens: 1200,
  repeatedInstructionCount: 1,
  mcpServerCount: 2,
  contextCalories: 1440,
  grade: "B",
  status: "warn",
  files: [
    {
      path: "AGENTS.md",
      kind: "agent-instructions",
      tokens: 1200,
      lines: 10
    }
  ],
  findings: [
    {
      ruleId: "tool-specific-leakage",
      title: "Tool-specific instruction in shared file",
      severity: "medium",
      file: "AGENTS.md",
      line: 2,
      evidence: "<Claude Code>",
      recommendation: "Move tool-specific guidance into CLAUDE.md."
    }
  ]
};

describe("report renderers", () => {
  test("console summary includes status, grade, and finding count", () => {
    expect(renderConsoleSummary(report)).toContain("Status: WARN");
    expect(renderConsoleSummary(report)).toContain("Grade: B");
    expect(renderConsoleSummary(report)).toContain("Findings: 1");
  });

  test("markdown report includes a findings table", () => {
    const markdown = renderMarkdownReport(report);
    expect(markdown).toContain("| Severity | Rule | File | Recommendation |");
    expect(markdown).toContain("tool-specific-leakage");
  });

  test("html report escapes finding evidence", () => {
    const html = renderHtmlReport(report);
    expect(html).toContain("&lt;Claude Code&gt;");
    expect(html).not.toContain("<Claude Code>");
  });
});
