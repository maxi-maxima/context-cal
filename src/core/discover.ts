import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import fg from "fast-glob";
import type { ContextFile, ContextFileKind } from "./types.js";

const TARGET_PATTERNS = [
  "AGENTS.md",
  "**/AGENTS.md",
  "CLAUDE.md",
  "**/CLAUDE.md",
  "GEMINI.md",
  "**/GEMINI.md",
  ".cursorrules",
  "**/.cursorrules",
  ".windsurfrules",
  "**/.windsurfrules",
  ".github/copilot-instructions.md",
  "**/.github/copilot-instructions.md",
  ".cursor/rules/**/*.{md,mdc,txt}",
  "**/.cursor/rules/**/*.{md,mdc,txt}",
  ".mcp.json",
  "**/.mcp.json",
  "mcp.json",
  "**/mcp.json",
  ".vscode/mcp.json",
  "**/.vscode/mcp.json",
  ".cursor/mcp.json",
  "**/.cursor/mcp.json"
];

const IGNORE_PATTERNS = [
  "**/.git/**",
  "**/node_modules/**",
  "**/dist/**",
  "**/build/**",
  "**/coverage/**",
  "**/.next/**",
  "**/.turbo/**",
  "**/.venv/**",
  "**/reports/**"
];

export async function discoverContextFiles(root: string): Promise<ContextFile[]> {
  const absoluteRoot = resolve(root);
  const paths = await fg(TARGET_PATTERNS, {
    cwd: absoluteRoot,
    dot: true,
    onlyFiles: true,
    unique: true,
    ignore: IGNORE_PATTERNS
  });

  const sorted = paths.sort((a, b) => a.localeCompare(b));
  return Promise.all(
    sorted.map(async (relativePath) => {
      const absolutePath = resolve(absoluteRoot, relativePath);
      return {
        absolutePath,
        relativePath: normalizePath(relativePath),
        kind: classifyPath(relativePath),
        content: await readFile(absolutePath, "utf8")
      };
    })
  );
}

function classifyPath(relativePath: string): ContextFileKind {
  const normalized = normalizePath(relativePath);
  if (normalized.endsWith("mcp.json") || normalized.endsWith(".mcp.json")) {
    return "mcp-config";
  }
  if (normalized.includes(".cursor/rules/") || normalized.endsWith(".cursorrules") || normalized.endsWith(".windsurfrules")) {
    return "tool-rules";
  }
  if (
    normalized.endsWith("AGENTS.md") ||
    normalized.endsWith("CLAUDE.md") ||
    normalized.endsWith("GEMINI.md") ||
    normalized.endsWith(".github/copilot-instructions.md")
  ) {
    return "agent-instructions";
  }
  return "unknown";
}

function normalizePath(path: string): string {
  return path.replaceAll("\\", "/");
}
