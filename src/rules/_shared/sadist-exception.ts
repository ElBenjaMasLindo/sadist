import type { Rule } from "eslint";

const SADIST_EXCEPTION_RE = /sadist-exception:\s*(?:[A-Z][A-Z0-9]+-\d+|#\d+)\b/;

// eslint-disable-next-line complexity
export function hasSadistExceptionNear(
  sourceCode: Rule.RuleContext["sourceCode"],
  node: Rule.Node,
): boolean {
  const start = node.loc?.start.line;
  const end = node.loc?.end.line;
  if (start === undefined || end === undefined) return false;
  for (const comment of sourceCode.getAllComments()) {
    if (!comment.loc) continue;
    const commentLine = comment.loc.end.line;
    if (commentLine < start - 1 || commentLine > end) continue;
    if (SADIST_EXCEPTION_RE.test(comment.value)) return true;
  }
  return false;
}
