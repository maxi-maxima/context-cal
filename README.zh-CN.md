<div align="center">

# Context Cal

**给 AI 编程 Agent 用的 Lighthouse：审计仓库里的上下文预算。**

[![npm package](https://img.shields.io/badge/npm-context--cal-red)](https://www.npmjs.com/package/context-cal)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-brightgreen)](https://nodejs.org)

[English](README.md)

</div>

现在的 AI 编程工具会读取很多“给 agent 看的上下文”：`AGENTS.md`、`CLAUDE.md`、`GEMINI.md`、Cursor rules、Copilot instructions、MCP 配置。

这些上下文有价值，但也很容易变成隐形负债：

- 同一条规则在 5 个文件里重复
- Claude/Cursor/Codex 专属规则混进共享的 `AGENTS.md`
- 写了“先读完整个仓库”这种昂贵指令
- MCP server 菜单太大，工具选择噪音变多
- agent 说明文件越来越长，但没人审查

`context-cal` 把这些问题变成一个本地、确定性、可接入 CI 的报告。

不需要 API key。不调用模型。不需要云账号。不上传遥测。

## 30 秒演示

```bash
npx context-cal demo
```

示例输出：

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

演示会生成：

- `reports/context-cal.json`
- `reports/context-cal.md`
- `reports/context-cal.html`

## 扫描你的仓库

```bash
npx context-cal scan . --budget 8000 --out reports
```

退出码：

- `0`：通过或有警告
- `1`：失败
- `2`：CLI 或配置错误

更严格的单文件限制：

```bash
npx context-cal scan . --budget 6000 --max-file-tokens 1200
```

直接输出 JSON：

```bash
npx context-cal scan . --json
```

## 扫描范围

| 类型 | 文件 |
| --- | --- |
| 共享 agent 指南 | `AGENTS.md`、嵌套 `AGENTS.md` |
| 工具专属指南 | `CLAUDE.md`、`GEMINI.md`、`.cursorrules`、`.windsurfrules` |
| Cursor rules | `.cursor/rules/**/*` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| MCP 配置 | `.mcp.json`、`mcp.json`、`.vscode/mcp.json`、`.cursor/mcp.json` |

默认忽略 `node_modules`、`dist`、`build`、`coverage`、`.git`、`.next`、`.turbo`、`.venv`、`reports`。

## 会检查什么

| 规则 | 意义 |
| --- | --- |
| `oversized-context-file` | 说明文件过大，会挤占任务上下文。 |
| `duplicate-instruction` | 重复规则容易漂移，也浪费上下文。 |
| `tool-specific-leakage` | 共享 `AGENTS.md` 不应该塞入只有某个工具理解的规则。 |
| `broad-context-loading` | “先读完整个仓库”通常昂贵且低效。 |
| `large-mcp-menu` | 常驻 MCP server 太多，会增加工具选择噪音。 |

## Context Calories

`context-cal` 使用确定性启发式：

```text
context calories =
  估算 instruction tokens
  + 发现项严重程度分
  + 重复规则分
  + MCP server 菜单分
  + 超预算惩罚
```

它不是 tokenizer 替代品，而是工程预算检查。你可以在改动前后各跑一次，判断 agent 上下文是变轻了还是变重了。

## 为什么做这个

Agent context 已经变成真实的工程表面：

- `AGENTS.md` 把自己定义成给 coding agent 看的 README，并建议大 monorepo 使用嵌套文件。
- GitHub Copilot 支持仓库级、自定义路径级和 agent instruction 文件。
- MCP server 会暴露 tools、resources、prompts，能力很强，但也可能增加上下文噪音。

Web 性能有 Lighthouse，agent context 也需要一个轻量反馈回路。

## GitHub Action

把 `templates/github-action.yml` 复制到 `.github/workflows/context-cal.yml`。

```yaml
- name: Audit agent context budget
  run: npx context-cal scan . --budget 8000 --out reports
```

## 它不是安全扫描器

`context-cal` 关注的是上下文预算、重复、过宽指令和可维护性。

如果你要检查 prompt injection、secret、权限或 MCP 攻击面，应使用安全扫描或演练工具。

## 开发

```bash
npm install
npm run check
npm run dev -- demo
```

## 参考

- [AGENTS.md](https://agents.md/index)
- [GitHub Copilot custom-instructions support](https://docs.github.com/en/copilot/reference/custom-instructions-support)
- [MCP resources](https://modelcontextprotocol.io/docs/concepts/resources)
- [MCP prompts](https://modelcontextprotocol.io/docs/concepts/prompts)

## License

MIT
