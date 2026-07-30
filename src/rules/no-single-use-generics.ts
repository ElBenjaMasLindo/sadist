import type { Rule } from "eslint";

type TypeParams = {
  params: Array<{ name: { name: string } }>;
};

type GenericNode = Rule.Node & { typeParameters?: TypeParams };

function check(context: Rule.RuleContext, node: GenericNode): void {
  if (!node.typeParameters) return;
  const fullText = (context.sourceCode ?? context.getSourceCode()).getText(node);
  for (const param of node.typeParameters.params) {
    const name = param.name.name;
    const matches = fullText.match(new RegExp(`\\b${name}\\b`, "g")) ?? [];
    if (matches.length <= 2) {
      context.report({
        node,
        message: `Generic "${name}" is used only once. Remove it or use it in more than one place.`,
      });
    }
  }
}

const noSingleUseGenerics = {
  meta: {
    type: "problem" as const,
    docs: { description: "No generic type parameter used only once." },
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
