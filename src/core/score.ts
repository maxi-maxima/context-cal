import type { AnalyzeResult, Grade, ScanStatus } from "./types.js";

export interface ScoreResult {
  contextCalories: number;
  grade: Grade;
  status: ScanStatus;
}

export function scoreAnalysis(result: AnalyzeResult, budget: number): ScoreResult {
  const severityCalories = result.findings.reduce((sum, finding) => sum + findingCalories(finding.severity), 0);
  const overBudgetCalories = Math.max(0, result.totalTokens - budget) * 2;
  const contextCalories =
    result.totalTokens +
    severityCalories +
    overBudgetCalories +
    result.repeatedInstructionCount * 60 +
    result.mcpServerCount * 40;

  const ratio = budget > 0 ? contextCalories / budget : 1;
  const hasHigh = result.findings.some((finding) => finding.severity === "high" || finding.severity === "critical");

  const grade: Grade =
    ratio <= 0.35 && !hasHigh
      ? "A"
      : ratio <= 0.65
        ? "B"
        : ratio <= 0.9
          ? "C"
          : ratio <= 1.2
            ? "D"
            : "F";

  const status: ScanStatus = grade === "F" || result.findings.some((finding) => finding.severity === "critical") ? "fail" : result.findings.length > 0 ? "warn" : "pass";

  return { contextCalories, grade, status };
}

function findingCalories(severity: string): number {
  switch (severity) {
    case "critical":
      return 1200;
    case "high":
      return 600;
    case "medium":
      return 240;
    default:
      return 80;
  }
}
