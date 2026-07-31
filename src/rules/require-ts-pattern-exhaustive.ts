import type { Rule } from "eslint";
import { hasSadistExceptionNear } from "./_shared/sadist-exception.js";

const MATCH_FUNCTION = "match";
const WITH_METHOD = "with";
const EXHAUSTIVE_METHOD = "exhaustive";

type MemberExpr = Rule.Node & { object?: Rule.Node; property?: { type?: string; name?: string } };
type CallExpr = Rule.Node & { callee?: Rule.Node; parent?: Rule.Node };

// eslint-disable-next-line sadist/no-null-in-domain-types
function getMethodName(callee: Rule.Node | undefined): string | null {
  if (callee?.type !== "MemberExpression") return null;
  const member = callee as MemberExpr;
  if (member.property?.type !== "Identifier" || !member.property.name) return null;
  return member.property.name;
}

// eslint-disable-next-line sadist/no-null-in-domain-types
function isMatchCall(node: Rule.Node | undefined): boolean {
  if (node?.type !== "CallExpression") return false;
  const callee = (node as CallExpr).callee;
  return callee?.type === "Identifier" && callee.name === MATCH_FUNCTION;
}

// eslint-disable-next-line sadist/no-null-in-domain-types
function isWithCall(node: Rule.Node | undefined): boolean {
  // eslint-disable-next-line sadist/no-null-in-domain-types
  return getMethodName((node as CallExpr | undefined)?.callee) === WITH_METHOD;
}

// eslint-disable-next-line sadist/no-null-in-domain-types
function isTsPatternChain(obj: Rule.Node | undefined): boolean {
  let current = obj;
  while (isWithCall(current)) {
    const callee = (current as CallExpr).callee as MemberExpr;
    current = callee.object;
  }
  return isMatchCall(current);
}

function isOutermostCall(node: CallExpr): boolean {
  const parent = node.parent;
  if (parent?.type !== "MemberExpression") return true;
  return (parent as MemberExpr).object !== node;
}

const requireTsPatternExhaustive = {
  meta: {
    type: "problem" as const,
    docs: {
      description:
        "Every ts-pattern chain must terminate in .exhaustive(). Catches .otherwise() and a chain left with no terminal call at all.",
    },
    schema: [],
  },
  create(context: Rule.RuleContext) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    return {
      CallExpression(node: Rule.Node) {
        const call = node as CallExpr;
        if (!isOutermostCall(call)) return;
        const methodName = getMethodName(call.callee);
        if (methodName === null || methodName === EXHAUSTIVE_METHOD) return;
        if (!isTsPatternChain((call.callee as MemberExpr).object)) return;
        if (hasSadistExceptionNear(sourceCode, node)) return;
        context.report({
          node,
          message: `ts-pattern chain ends with "${methodName}", not .exhaustive(). Add the missing case(s) and call .exhaustive().`,
        });
      },
    };
  },
} satisfies Rule.RuleModule;

export default requireTsPatternExhaustive;
