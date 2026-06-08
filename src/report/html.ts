import type { ScanReport } from "../core/types.js";
import { escapeHtml } from "./escape.js";

export function renderHtmlReport(report: ScanReport): string {
  const findingRows =
    report.findings.length === 0
      ? "<tr><td colspan=\"5\">No findings.</td></tr>"
      : report.findings
          .map(
            (finding) => `<tr>
  <td><span class="sev sev-${escapeHtml(finding.severity)}">${escapeHtml(finding.severity)}</span></td>
  <td>${escapeHtml(finding.ruleId)}</td>
  <td>${escapeHtml(`${finding.file}:${finding.line}`)}</td>
  <td>${escapeHtml(finding.evidence)}</td>
  <td>${escapeHtml(finding.recommendation)}</td>
</tr>`
          )
          .join("\n");

  const fileRows = report.files
    .map(
      (file) => `<tr>
  <td>${escapeHtml(file.path)}</td>
  <td>${escapeHtml(file.kind)}</td>
  <td>${file.tokens}</td>
  <td>${file.lines}</td>
</tr>`
    )
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Context Cal Report</title>
  <style>
    :root { color-scheme: light dark; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    body { margin: 0; background: #f7f5ef; color: #1f2937; }
    main { max-width: 1040px; margin: 0 auto; padding: 32px 20px 56px; }
    header { border-bottom: 1px solid #d7d0c3; padding-bottom: 20px; margin-bottom: 24px; }
    h1 { font-size: 36px; margin: 0 0 8px; letter-spacing: 0; }
    .meta { color: #5f6b7a; margin: 0; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin: 24px 0; }
    .metric { background: #ffffff; border: 1px solid #ded7ca; border-radius: 8px; padding: 14px; }
    .metric b { display: block; font-size: 24px; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; background: #ffffff; border: 1px solid #ded7ca; border-radius: 8px; overflow: hidden; margin-bottom: 24px; }
    th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #e6dfd3; vertical-align: top; }
    th { background: #ebe5d8; font-size: 13px; }
    .sev { border-radius: 999px; padding: 2px 8px; font-size: 12px; font-weight: 700; }
    .sev-high, .sev-critical { background: #fee2e2; color: #991b1b; }
    .sev-medium { background: #fef3c7; color: #92400e; }
    .sev-low { background: #dbeafe; color: #1e40af; }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>Context Cal Report</h1>
      <p class="meta">${escapeHtml(report.root)} · ${escapeHtml(report.generatedAt)}</p>
    </header>
    <section class="grid">
      <div class="metric">Status <b>${escapeHtml(report.status.toUpperCase())}</b></div>
      <div class="metric">Grade <b>${escapeHtml(report.grade)}</b></div>
      <div class="metric">Context Calories <b>${report.contextCalories}</b></div>
      <div class="metric">Tokens <b>${report.totalTokens} / ${report.budget}</b></div>
      <div class="metric">Findings <b>${report.findings.length}</b></div>
      <div class="metric">MCP Servers <b>${report.mcpServerCount}</b></div>
    </section>
    <h2>Findings</h2>
    <table>
      <thead><tr><th>Severity</th><th>Rule</th><th>File</th><th>Evidence</th><th>Recommendation</th></tr></thead>
      <tbody>${findingRows}</tbody>
    </table>
    <h2>Files</h2>
    <table>
      <thead><tr><th>File</th><th>Kind</th><th>Tokens</th><th>Lines</th></tr></thead>
      <tbody>${fileRows}</tbody>
    </table>
  </main>
</body>
</html>
`;
}
