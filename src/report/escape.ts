export function escapeMarkdownCell(value: string | number): string {
  return String(value).replaceAll("|", "\\|").replace(/\r?\n/g, " ");
}

export function escapeHtml(value: string | number): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}
