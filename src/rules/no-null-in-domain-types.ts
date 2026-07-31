import type { Rule } from "eslint";

const noNullInDomainTypes = {
  meta: {
    type: "problem" as const,
    docs: {
      description:
        "No null or undefined anywhere in domain code (src/adapters/ is exempted via config, not by this rule). Use Option<T> instead.",
    },
    schema: [],
  },
  create(context: Rule.RuleContext) {
    function report(kind: string) {
      return (node: Rule.Node) => {
        context.report({
          node,
          message: `No ${kind} in domain code. Use Option<T> instead.`,
        });
      };
    }
    return {
      TSNullKeyword: report("null"),
      TSUndefinedKeyword: report("undefined"),
    };
  },
} satisfies Rule.RuleModule;

export default noNullInDomainTypes;
