import type { Rule } from "eslint";
import { countTypeReferences } from "./_shared/ast-walk.js";

type TypeParams = { params: Array<{ name: { name: string } }> };
type GenericNode = Rule.Node & { typeParameters?: TypeParams };

function check(context: Rule.RuleContext, node: GenericNode): void {
  if (!node.typeParameters) return;
  for (const param of node.typeParameters.params) {
    const name = param.name.name;
    if (countTypeReferences(node, name) <= 1) {
      context.report({
        node,
        message: `Generic "${name}" is used in fewer than two places. Remove it or use it in more than one place.`,
      });
    }
  }
}

const noSingleUseGenerics = {
  meta: {
    type: "problem" as const,
    docs: { description: "No generic type parameter used in fewer than two places." },
    schema: [],
  },
  create(context: Rule.RuleContext) {
    const visitor = (node: GenericNode) => check(context, node);
    return {
      FunctionDeclaration: visitor,
      FunctionExpression: visitor,
      ArrowFunctionExpression: visitor,
    };
  },
} satisfies Rule.RuleModule;

export default noSingleUseGenerics;
