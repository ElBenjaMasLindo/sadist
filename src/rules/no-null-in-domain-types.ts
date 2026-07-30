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

    function report(msg: string) {
      return (node: Rule.Node) => {
        context.report({
          node,
          message: `No ${msg} in domain types. Use Option<T> instead.`,
        });
      };
    }

    return {
      "TSTypeAliasDeclaration TSNullKeyword": report("null"),
      "TSTypeAliasDeclaration TSUndefinedKeyword": report("undefined"),
      "TSInterfaceDeclaration TSNullKeyword": report("null"),
      "TSInterfaceDeclaration TSUndefinedKeyword": report("undefined"),
    };
  },
} satisfies Rule.RuleModule;

export default noNullInDomainTypes;
