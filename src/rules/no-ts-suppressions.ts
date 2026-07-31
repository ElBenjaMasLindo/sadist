import type { Rule } from "eslint";
import { hasSadistExceptionNear } from "./_shared/sadist-exception.js";

type AsExpr = Rule.Node & {
  expression?: Rule.Node;
  typeAnnotation?: { type?: string; typeName?: { name?: string } };
};

function isUnknownType(ta: AsExpr["typeAnnotation"]): boolean {
  if (!ta) return false;
  if (ta.type === "TSUnknownKeyword") return true;
  return ta.type === "TSTypeReference" && ta.typeName?.name === "unknown";
}

function isDoubleUnknownCast(node: AsExpr): boolean {
  // eslint-disable-next-line sadist/no-null-in-domain-types
  const inner = node.expression as AsExpr | undefined;
  return inner ? isUnknownType(inner.typeAnnotation) : false;
}

const noTsSuppressions = {
  meta: {
    type: "problem" as const,
    docs: {
      description:
        "No 'as unknown as X' double casts. @ts-ignore and @ts-expect-error are handled by @typescript-eslint/ban-ts-comment, not this rule.",
    },
    schema: [],
  },
  create(context: Rule.RuleContext) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    return {
      TSAsExpression(node: Rule.Node) {
        const asNode = node as AsExpr;
        if (!isDoubleUnknownCast(asNode)) return;
        if (hasSadistExceptionNear(sourceCode, node)) return;
        context.report({ node, message: "No 'as unknown as X'. Parse the value or add sadist-exception." });
      },
    };
  },
} satisfies Rule.RuleModule;

export default noTsSuppressions;
