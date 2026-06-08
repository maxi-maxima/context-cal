import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

export async function createDemoWorkspace(root: string): Promise<void> {
  await mkdir(join(root, ".cursor", "rules"), { recursive: true });
  await mkdir(join(root, ".vscode"), { recursive: true });
  await writeFile(
    join(root, "AGENTS.md"),
    [
      "# Agent Guidance",
      "",
      "- Run npm test before commits.",
      "- Always read every file in the repository before answering.",
      "- Claude Code must use the Task tool for every step.",
      "- Keep changes scoped to the request."
    ].join("\n")
  );
  await writeFile(
    join(root, "CLAUDE.md"),
    ["# Claude Guidance", "", "- Run npm test before commits.", "- Prefer concise status updates."].join("\n")
  );
  await writeFile(
    join(root, ".cursor", "rules", "frontend.md"),
    ["Use accessible controls.", "Avoid oversized hero sections in internal tools."].join("\n")
  );
  await writeFile(
    join(root, ".vscode", "mcp.json"),
    JSON.stringify(
      {
        mcpServers: {
          filesystem: {},
          browser: {},
          github: {},
          postgres: {},
          slack: {},
          docs: {}
        }
      },
      null,
      2
    )
  );
}
