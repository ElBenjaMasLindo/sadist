import type { Rule } from "eslint";

const noNullInDomainTypes = {
  meta: {
    type: "problem" as const,
    docs: {
      description:
        "No null or undefined in type aliases or interfaces outside src/adapters/.",
    },
    schema: [],
  },
  create(context: Rule.RuleContext) {
    const filename = context.filename ?? context.getFilename();
    if (filename.includes("/adapters/")) return {};
    return {
      "TSTypeAliasDeclaration TSNullKeyword"(node: Rule.Node) {
        context.report({
          node,
          message: "No null in domain types. Use Option<T> instead.",
        });
      },
      "TSTypeAliasDeclaration TSUndefinedKeyword"(node: Rule.Node) {
        context.report({
          node,
          message:
            "No undefined in domain types. Use Option<T> instead.",
        });
      },
      "TSInterfaceDeclaration TSNullKeyword"(node: Rule.Node) {
        context.report({
          node,
          message: "No null in domain types. Use Option<T> instead.",
        });
      },
      "TSInterfaceDeclaration TSUndefinedKeyword"(node: Rule.Node) {
        context.report({
          node,
          message:
            "No undefined in domain types. Use Option<T> instead.",
        });
      },
    };
  },
} satisfies Rule.RuleModule;

export default noNullInDomainTypes;
