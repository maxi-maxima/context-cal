import type { ScanReport } from "../core/types.js";
import { escapeMarkdownCell } from "./escape.js";

export function renderMarkdownReport(report: ScanReport): string {
  const lines = [
    "# Context Cal Report",
    "",
    `- Status: **${report.status.toUpperCase()}**`,
    `- Grade: **${report.grade}**`,
    `- Context calories: **${report.contextCalories}**`,
    `- Estimated tokens: **${report.totalTokens} / ${report.budget}**`,
    `- Files scanned: **${report.files.length}**`,
    `- MCP servers: **${report.mcpServerCount}**`,
    "",
    "## Findings",
    "",
    "| Severity | Rule | File | Recommendation |",
    "| --- | --- | --- | --- |"
  ];

  if (report.findings.length === 0) {
    lines.push("| - | - | - | No findings. |");
  } else {
    for (const finding of report.findings) {
      lines.push(
        `| ${escapeMarkdownCell(finding.severity)} | ${escapeMarkdownCell(finding.ruleId)} | ${escapeMarkdownCell(`${finding.file}:${finding.line}`)} | ${escapeMarkdownCell(finding.recommendation)} |`
      );
    }
  }

  lines.push("", "## Files", "", "| File | Kind | Tokens | Lines |", "| --- | --- | ---: | ---: |");

  for (const file of report.files) {
    lines.push(
      `| ${escapeMarkdownCell(file.path)} | ${escapeMarkdownCell(file.kind)} | ${file.tokens} | ${file.lines} |`
    );
  }

  return `${lines.join("\n")}\n`;
}
