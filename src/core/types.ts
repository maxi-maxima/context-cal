export type ContextFileKind =
  | "agent-instructions"
  | "tool-rules"
  | "mcp-config"
  | "unknown";

export type Severity = "low" | "medium" | "high" | "critical";

export type ScanStatus = "pass" | "warn" | "fail";

export type Grade = "A" | "B" | "C" | "D" | "F";

export interface ContextFile {
  absolutePath: string;
  relativePath: string;
  kind: ContextFileKind;
  content: string;
}

export interface FileSummary {
  path: string;
  kind: ContextFileKind;
  tokens: number;
  lines: number;
}

export interface Finding {
  ruleId: string;
  title: string;
  severity: Severity;
  file: string;
  line: number;
  evidence: string;
  recommendation: string;
}

export interface AnalyzeOptions {
  budget?: number;
  maxFileTokens?: number;
}

export interface AnalyzeResult {
  files: FileSummary[];
  findings: Finding[];
  totalTokens: number;
  repeatedInstructionCount: number;
  mcpServerCount: number;
}

export interface ScanOptions {
  budget: number;
  maxFileTokens: number;
  version?: string;
}

export interface ScanReport extends AnalyzeResult {
  tool: "context-cal";
  version: string;
  root: string;
  generatedAt: string;
  budget: number;
  maxFileTokens: number;
  contextCalories: number;
  grade: Grade;
  status: ScanStatus;
}
