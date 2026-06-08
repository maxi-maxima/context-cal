#!/usr/bin/env node
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { Command } from "commander";
import { createDemoWorkspace } from "./demo/workspace.js";
import { scanWorkspace } from "./core/scan.js";
import { renderConsoleSummary } from "./report/console.js";
import { renderHtmlReport } from "./report/html.js";
import { renderMarkdownReport } from "./report/markdown.js";

interface CommandOptions {
  out: string;
  budget: string;
  maxFileTokens: string;
  json?: boolean;
}

const program = new Command();

program
  .name("context-cal")
  .description("Audit the context budget of AI coding-agent instructions and MCP configs.")
  .version("0.1.0");

program
  .command("scan")
  .argument("[path]", "workspace path", ".")
  .option("--out <dir>", "report output directory", "reports")
  .option("--budget <tokens>", "target context token budget", "8000")
  .option("--max-file-tokens <tokens>", "per-file soft limit", "1800")
  .option("--json", "print JSON report to stdout")
  .action(async (path: string, options: CommandOptions) => {
    const report = await scanWorkspace(path, {
      budget: parsePositiveInteger(options.budget, "budget"),
      maxFileTokens: parsePositiveInteger(options.maxFileTokens, "max-file-tokens")
    });
    await writeReports(options.out, report);
    if (options.json) {
      process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    } else {
      process.stdout.write(renderConsoleSummary(report));
      process.stdout.write(`Reports: ${resolve(options.out)}\n`);
    }
    process.exitCode = report.status === "fail" ? 1 : 0;
  });

program
  .command("demo")
  .option("--out <dir>", "report output directory", "reports")
  .option("--budget <tokens>", "target context token budget", "8000")
  .option("--max-file-tokens <tokens>", "per-file soft limit", "1800")
  .action(async (options: CommandOptions) => {
    const demoRoot = resolve("demo-workspace");
    await rm(demoRoot, { recursive: true, force: true });
    await createDemoWorkspace(demoRoot);
    const report = await scanWorkspace(demoRoot, {
      budget: parsePositiveInteger(options.budget, "budget"),
      maxFileTokens: parsePositiveInteger(options.maxFileTokens, "max-file-tokens")
    });
    await writeReports(options.out, report);
    process.stdout.write(renderConsoleSummary(report));
    process.stdout.write(`Demo workspace: ${demoRoot}\n`);
    process.stdout.write(`Reports: ${resolve(options.out)}\n`);
    process.exitCode = report.status === "fail" ? 1 : 0;
  });

await program.parseAsync();

async function writeReports(outDir: string, report: Awaited<ReturnType<typeof scanWorkspace>>): Promise<void> {
  await mkdir(outDir, { recursive: true });
  await Promise.all([
    writeFile(join(outDir, "context-cal.json"), `${JSON.stringify(report, null, 2)}\n`),
    writeFile(join(outDir, "context-cal.md"), renderMarkdownReport(report)),
    writeFile(join(outDir, "context-cal.html"), renderHtmlReport(report))
  ]);
}

function parsePositiveInteger(value: string, name: string): number {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`--${name} must be a positive integer`);
  }
  return parsed;
}
