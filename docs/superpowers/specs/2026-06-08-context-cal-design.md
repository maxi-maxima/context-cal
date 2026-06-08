# Context Cal Design

## Research Basis

AI coding workflows now rely on agent-visible instruction files, MCP servers, and tool-specific rule files. Official Codex material describes `AGENTS.md` as project guidance for coding agents, while MCP documentation describes tools, prompts, and resources as context exposed to models. The practical gap is not another model runner or security scanner: teams need a quick way to see how heavy, duplicated, and tool-specific their agent context has become.

## Product

`context-cal` is a local-first CLI that audits a repository's AI-agent context surface. It estimates the token budget consumed by instruction files and MCP configuration, reports repeated rules, flags tool-specific leakage, and gives concrete "move this to references or nested rules" recommendations.

## Target User

The primary user is a developer or team adopting Codex, Claude Code, Cursor, Gemini CLI, Copilot coding agents, and MCP servers at the same time. They want a deterministic check they can run locally or in CI without API keys.

## Non-Goals

- No model calls.
- No live MCP handshake.
- No secret scanning or exploit simulation; that overlaps with `mcp-fire-drill`.
- No automatic rewrite in v0.1.

## CLI Surface

- `context-cal scan [path] --out reports --budget 8000`
- `context-cal demo --out reports`

## Scan Targets

- `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`
- `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`
- `.cursor/rules/**/*`
- `.mcp.json`, `mcp.json`, `.vscode/mcp.json`, `.cursor/mcp.json`

## Analysis

- Estimate tokens with a documented heuristic.
- Score total "context calories" from tokens, duplicate rules, broad MCP menus, and high-risk phrasing.
- Emit findings with severity, file, line, evidence, and recommendation.
- Grade A-F and set status `pass`, `warn`, or `fail`.

## Reports

- Console summary for humans.
- JSON for automation.
- Markdown for pull requests.
- HTML for screenshots and sharing.

## Verification

Unit tests cover token estimation, target discovery, findings, scoring, and report rendering. CLI demo is run during verification to ensure the package works from built JavaScript.
