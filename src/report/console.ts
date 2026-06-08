import type { ScanReport } from "../core/types.js";

export function renderConsoleSummary(report: ScanReport): string {
  const lines = [
    "Context Cal",
    `Status: ${report.status.toUpperCase()}`,
    `Grade: ${report.grade}`,
    `Context calories: ${report.contextCalories}`,
    `Estimated tokens: ${report.totalTokens} / ${report.budget}`,
    `Files scanned: ${report.files.length}`,
    `MCP servers: ${report.mcpServerCount}`,
    `Repeated instructions: ${report.repeatedInstructionCount}`,
    `Findings: ${report.findings.length}`
  ];

  if (report.findings.length > 0) {
    lines.push("");
    for (const finding of report.findings.slice(0, 5)) {
      lines.push(`- [${finding.severity}] ${finding.ruleId} ${finding.file}:${finding.line}`);
    }
  }

  return `${lines.join("\n")}\n`;
}
