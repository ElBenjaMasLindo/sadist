import type { Rule } from "eslint";

type TypeParams = {
  params: Array<{ name: { name: string } }>;
};

const noSingleUseGenerics = {
  meta: {
    type: "problem" as const,
    docs: { description: "No generic type parameter used only once." },
    schema: [],
  },
  create(context: Rule.RuleContext) {
    function check(
      node: Rule.Node & { typeParameters?: TypeParams },
    ) {
      if (!node.typeParameters) return;
      const sourceCode =
        context.sourceCode ?? context.getSourceCode();
      const fullText = sourceCode.getText(node);
      for (const param of node.typeParameters.params) {
        const name = param.name.name;
        const matches =
          fullText.match(new RegExp(`\\b${name}\\b`, "g")) ?? [];
        if (matches.length <= 2) {
          context.report({
            node,
            message: `Generic "${name}" is used only once. Remove it or use it in more than one place.`,
          });
        }
      }
    }
    return {
      FunctionDeclaration: check,
      FunctionExpression: check,
      ArrowFunctionExpression: check,
    };
  },
} satisfies Rule.RuleModule;

export default noSingleUseGenerics;
