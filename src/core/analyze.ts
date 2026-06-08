import { estimateTokens } from "./estimate.js";
import type { AnalyzeOptions, AnalyzeResult, ContextFile, FileSummary, Finding, Severity } from "./types.js";

const DEFAULT_MAX_FILE_TOKENS = 1800;

const TOOL_SPECIFIC_PATTERNS = [
  /\bClaude Code\b/i,
  /\bTask tool\b/i,
  /\bCursor\b/i,
  /\bGemini CLI\b/i,
  /\bCopilot\b/i,
  /\bCodex\b/i
];

const BROAD_CONTEXT_PATTERNS = [
  /read every file/i,
  /read all files/i,
  /entire repository/i,
  /whole repo/i,
  /scan the full codebase/i,
  /load everything/i
];

export function analyzeContext(files: ContextFile[], options: AnalyzeOptions = {}): AnalyzeResult {
  const maxFileTokens = options.maxFileTokens ?? DEFAULT_MAX_FILE_TOKENS;
  const summaries: FileSummary[] = files.map((file) => ({
    path: file.relativePath,
    kind: file.kind,
    tokens: estimateTokens(file.content),
    lines: countLines(file.content)
  }));

  const findings: Finding[] = [];
  const instructionLines = new Map<string, Array<{ file: ContextFile; line: number; text: string }>>();
  let mcpServerCount = 0;

  for (const file of files) {
    const summary = summaries.find((candidate) => candidate.path === file.relativePath);
    if (summary && summary.tokens > maxFileTokens) {
      findings.push(makeFinding({
        ruleId: "oversized-context-file",
        title: "Large agent context file",
        severity: "medium",
        file: file.relativePath,
        line: 1,
        evidence: `${summary.tokens} estimated tokens`,
        recommendation: "Move detailed background into referenced docs or nested rules."
      }));
    }

    if (file.kind === "mcp-config") {
      const count = countMcpServers(file.content);
      mcpServerCount += count;
      if (count >= 6) {
        findings.push(makeFinding({
          ruleId: "large-mcp-menu",
          title: "Large MCP tool menu",
          severity: "medium",
          file: file.relativePath,
          line: 1,
          evidence: `${count} MCP servers configured`,
          recommendation: "Split rarely used MCP servers into profile-specific configs."
        }));
      }
      continue;
    }

    const lines = file.content.split(/\r?\n/);
    for (const [index, rawLine] of lines.entries()) {
      const text = normalizeInstructionLine(rawLine);
      if (text.length < 12) {
        continue;
      }
      const lineNumber = index + 1;
      const existing = instructionLines.get(text) ?? [];
      existing.push({ file, line: lineNumber, text: rawLine.trim() });
      instructionLines.set(text, existing);

      if (file.relativePath === "AGENTS.md" && TOOL_SPECIFIC_PATTERNS.some((pattern) => pattern.test(rawLine))) {
        findings.push(makeFinding({
          ruleId: "tool-specific-leakage",
          title: "Tool-specific instruction in shared file",
          severity: "medium",
          file: file.relativePath,
          line: lineNumber,
          evidence: rawLine.trim(),
          recommendation: "Move tool-specific guidance into the matching tool rule file."
        }));
      }

      if (BROAD_CONTEXT_PATTERNS.some((pattern) => pattern.test(rawLine))) {
        findings.push(makeFinding({
          ruleId: "broad-context-loading",
          title: "Broad context loading instruction",
          severity: "high",
          file: file.relativePath,
          line: lineNumber,
          evidence: rawLine.trim(),
          recommendation: "Replace broad preloading with task-specific discovery guidance."
        }));
      }
    }
  }

  let repeatedInstructionCount = 0;
  for (const occurrences of instructionLines.values()) {
    const uniqueFiles = new Set(occurrences.map((entry) => entry.file.relativePath));
    if (occurrences.length > 1) {
      repeatedInstructionCount += occurrences.length - 1;
      const first = occurrences[0];
      if (first) {
        findings.push(makeFinding({
          ruleId: "duplicate-instruction",
          title: uniqueFiles.size > 1 ? "Repeated instruction across agent files" : "Repeated instruction in one agent file",
          severity: "low",
          file: first.file.relativePath,
          line: first.line,
          evidence: first.text,
          recommendation: uniqueFiles.size > 1
            ? "Keep shared guidance in one neutral file and link tool-specific variants."
            : "Keep each rule once, then move detail into a referenced section if needed."
        }));
      }
    }
  }

  findings.sort((a, b) => severityRank(b.severity) - severityRank(a.severity) || a.file.localeCompare(b.file));

  return {
    files: summaries,
    findings,
    totalTokens: summaries.reduce((sum, file) => sum + file.tokens, 0),
    repeatedInstructionCount,
    mcpServerCount
  };
}

function makeFinding(finding: Finding): Finding {
  return finding;
}

function countLines(text: string): number {
  if (text.length === 0) {
    return 0;
  }
  return text.split(/\r?\n/).length;
}

function normalizeInstructionLine(line: string): string {
  return line
    .trim()
    .replace(/^[-*]\s+/, "")
    .replace(/^\d+[.)]\s+/, "")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function countMcpServers(content: string): number {
  try {
    const parsed = JSON.parse(content) as Record<string, unknown>;
    const servers = parsed.mcpServers ?? parsed.servers;
    if (servers && typeof servers === "object" && !Array.isArray(servers)) {
      return Object.keys(servers).length;
    }
  } catch {
    return 0;
  }
  return 0;
}

function severityRank(severity: Severity): number {
  switch (severity) {
    case "critical":
      return 4;
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
  }
}
