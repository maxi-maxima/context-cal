export function estimateTokens(text: string): number {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return 0;
  }

  const latinWords = trimmed.match(/[A-Za-z0-9_./:-]+/g) ?? [];
  const cjkChars = trimmed.match(/[\u3400-\u9fff]/g) ?? [];
  const symbolRuns = trimmed.match(/[^\sA-Za-z0-9_./:\-\u3400-\u9fff]+/g) ?? [];
  const codeSeparators = trimmed.match(/[./:-]/g) ?? [];

  return latinWords.length + Math.ceil(cjkChars.length / 1.6) + symbolRuns.length + codeSeparators.length;
}
