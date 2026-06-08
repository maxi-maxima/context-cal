import { resolve } from "node:path";
import { analyzeContext } from "./analyze.js";
import { discoverContextFiles } from "./discover.js";
import { scoreAnalysis } from "./score.js";
import type { ScanOptions, ScanReport } from "./types.js";

export async function scanWorkspace(root: string, options?: Partial<ScanOptions>): Promise<ScanReport> {
  const budget = options?.budget ?? 8000;
  const maxFileTokens = options?.maxFileTokens ?? 1800;
  const absoluteRoot = resolve(root);
  const files = await discoverContextFiles(absoluteRoot);
  const analysis = analyzeContext(files, { budget, maxFileTokens });
  const score = scoreAnalysis(analysis, budget);

  return {
    tool: "context-cal",
    version: options?.version ?? "0.1.0",
    root: absoluteRoot,
    generatedAt: new Date().toISOString(),
    budget,
    maxFileTokens,
    ...analysis,
    ...score
  };
}
