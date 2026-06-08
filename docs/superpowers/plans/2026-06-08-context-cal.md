# Context Cal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local-first `context-cal` CLI that audits AI-agent context files and outputs console, JSON, Markdown, and HTML reports.

**Architecture:** The CLI delegates to a scan pipeline: discover files, classify them, estimate tokens, analyze findings, score the result, and render reports. Each module is deterministic and testable without network access or API keys.

**Tech Stack:** TypeScript, Node.js 20+, Commander, fast-glob, zod, Vitest, ESLint.

---

### Task 1: Core Types And Token Estimator

**Files:**
- Create: `src/core/types.ts`
- Create: `src/core/estimate.ts`
- Test: `tests/core/estimate.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, expect, test } from "vitest";
import { estimateTokens } from "../../src/core/estimate.js";

describe("estimateTokens", () => {
  test("counts empty text as zero tokens", () => {
    expect(estimateTokens("")).toBe(0);
  });

  test("returns a stable rough estimate for mixed prose and code", () => {
    expect(estimateTokens("Read src/core first.\nRun npm test before commits.")).toBe(11);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/core/estimate.test.ts`
Expected: FAIL because `src/core/estimate.ts` does not exist.

- [ ] **Step 3: Implement the estimator and shared types**

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/core/estimate.test.ts`
Expected: PASS.

### Task 2: Discovery And Classification

**Files:**
- Create: `src/core/discover.ts`
- Test: `tests/core/discover.test.ts`

- [ ] **Step 1: Write failing tests for agent and MCP target discovery**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement fast-glob discovery with ignored generated directories**
- [ ] **Step 4: Run test to verify it passes**

### Task 3: Findings And Scoring

**Files:**
- Create: `src/core/analyze.ts`
- Create: `src/core/score.ts`
- Create: `src/core/scan.ts`
- Test: `tests/core/analyze.test.ts`
- Test: `tests/core/scan.test.ts`

- [ ] **Step 1: Write failing tests for duplicate instructions, oversized files, broad reading instructions, tool-specific leakage, and MCP menu size**
- [ ] **Step 2: Run tests to verify they fail**
- [ ] **Step 3: Implement deterministic analysis and scoring**
- [ ] **Step 4: Run tests to verify they pass**

### Task 4: Report Renderers

**Files:**
- Create: `src/report/console.ts`
- Create: `src/report/markdown.ts`
- Create: `src/report/html.ts`
- Test: `tests/report/report.test.ts`

- [ ] **Step 1: Write failing tests for report content and escaping**
- [ ] **Step 2: Run tests to verify they fail**
- [ ] **Step 3: Implement renderers**
- [ ] **Step 4: Run tests to verify they pass**

### Task 5: CLI And Demo

**Files:**
- Create: `src/cli.ts`
- Create: `src/demo/workspace.ts`
- Create: `templates/github-action.yml`
- Test: `tests/cli.test.ts`

- [ ] **Step 1: Write failing CLI tests**
- [ ] **Step 2: Run tests to verify they fail**
- [ ] **Step 3: Implement `scan` and `demo` commands**
- [ ] **Step 4: Run tests to verify they pass**

### Task 6: Public Launch Package

**Files:**
- Create: `README.md`
- Create: `README.zh-CN.md`
- Create: `CHANGELOG.md`
- Create: `CONTRIBUTING.md`
- Create: `SECURITY.md`
- Create: `LICENSE`

- [ ] **Step 1: Add public-facing docs with a 30-second demo**
- [ ] **Step 2: Run `npm run check`**
- [ ] **Step 3: Run `node dist/cli.js demo --out reports/demo`**
- [ ] **Step 4: Run `npm pack --dry-run --ignore-scripts`**
- [ ] **Step 5: Commit and push to public GitHub repo**
