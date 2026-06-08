<div align="center">

# Context Cal

**A Lighthouse-style context budget auditor for AI coding agents.**

[![npm package](https://img.shields.io/badge/npm-context--cal-red)](https://www.npmjs.com/package/context-cal)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-brightgreen)](https://nodejs.org)
[![Agent Context](https://img.shields.io/badge/agent%20context-budget%20audit-blue)]()

[简体中文](README.zh-CN.md)

</div>

AI coding agents are getting real project instructions from `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, Cursor rules, Copilot instructions, and MCP configs.

That context is useful until it becomes invisible debt:

- repeated rules across five agent files
- tool-specific instructions leaking into shared files
- broad "read the whole repo first" guidance
- large MCP menus that make every session heavier
- thousand-line instruction files nobody reviews

`context-cal` turns that into a small, local, CI-friendly report.

No API keys. No model calls. No cloud account. No telemetry.

## Documentation

| English | 简体中文 |
| --- | --- |
| [README](README.md) | [README.zh-CN](README.zh-CN.md) |
| [Changelog](CHANGELOG.md) | [更新日志](CHANGELOG.zh-CN.md) |
| [Contributing](CONTRIBUTING.md) | [贡献指南](CONTRIBUTING.zh-CN.md) |
| [Security](SECURITY.md) | [安全说明](SECURITY.zh-CN.md) |

## 30 Second Demo

```bash
npx context-cal demo
```

Example output:

```text
Context Cal
Status: WARN
Grade: B
Context calories: 2062
Estimated tokens: 447 / 8000
Files scanned: 4
MCP servers: 6
Repeated instructions: 1
Findings: 4
```

The demo writes:

- `reports/context-cal.json`
- `reports/context-cal.md`
- `reports/context-cal.html`

## Scan Your Repo

```bash
npx context-cal scan . --budget 8000 --out reports
```

Exit codes:

- `0`: pass or warn
- `1`: fail
- `2`: CLI/config error

Use a stricter per-file limit:

```bash
npx context-cal scan . --budget 6000 --max-file-tokens 1200
```

Print JSON to stdout:

```bash
npx context-cal scan . --json
```

## What It Scans

| Surface | Files |
| --- | --- |
| Shared agent guidance | `AGENTS.md`, nested `AGENTS.md` |
| Tool-specific guidance | `CLAUDE.md`, `GEMINI.md`, `.cursorrules`, `.windsurfrules` |
| Cursor rules | `.cursor/rules/**/*` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| MCP configs | `.mcp.json`, `mcp.json`, `.vscode/mcp.json`, `.cursor/mcp.json` |

Ignored directories include `node_modules`, `dist`, `build`, `coverage`, `.git`, `.next`, `.turbo`, `.venv`, and `reports`.

## Findings

| Rule | Why it matters |
| --- | --- |
| `oversized-context-file` | Large instruction files crowd out task-specific context. |
| `duplicate-instruction` | Repeated rules drift and waste context. |
| `tool-specific-leakage` | A shared `AGENTS.md` should not contain instructions only one agent understands. |
| `broad-context-loading` | "Read everything first" is expensive and often counterproductive. |
| `large-mcp-menu` | Too many always-on MCP servers increase tool-choice noise. |

## Context Calories

`context-cal` uses a deterministic heuristic:

```text
context calories =
  estimated instruction tokens
  + finding severity calories
  + repeated-rule calories
  + MCP server menu calories
  + over-budget penalty
```

This is not a tokenizer replacement. It is a stable engineering budget check: run it before and after a change and see whether your agent context got leaner or heavier.

## Why This Exists

Agent context has become a real development surface:

- The open `AGENTS.md` format describes itself as a README for coding agents and recommends nested files for large monorepos.
- GitHub Copilot supports repository custom instructions, path-specific instructions, and agent instruction files such as `AGENTS.md`, `CLAUDE.md`, and `GEMINI.md`.
- MCP servers expose tools, resources, and prompts that can add powerful but noisy context to agent workflows.

Teams need the same lightweight feedback loop for agent context that Lighthouse gave web performance.

## GitHub Action

Copy `templates/github-action.yml` into `.github/workflows/context-cal.yml`.

```yaml
- name: Audit agent context budget
  run: npx context-cal scan . --budget 8000 --out reports
```

## Not A Security Scanner

Use `context-cal` when you want to keep agent context focused and maintainable.

Use a security scanner or drill tool when you need prompt-injection, secret, permission, or MCP attack-surface checks.

## Development

```bash
npm install
npm run check
npm run dev -- demo
```

## Research Links

- [AGENTS.md](https://agents.md/index)
- [GitHub Copilot custom-instructions support](https://docs.github.com/en/copilot/reference/custom-instructions-support)
- [MCP resources](https://modelcontextprotocol.io/docs/concepts/resources)
- [MCP prompts](https://modelcontextprotocol.io/docs/concepts/prompts)

## License

MIT
