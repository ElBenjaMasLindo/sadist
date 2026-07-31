import type { Rule } from "eslint";

const noThrowOutsideAdapters = {
  meta: {
    type: "problem" as const,
    docs: {
      description:
        "No throw statements in domain code (src/adapters/ is exempted via config, not by this rule). Return a Result instead.",
    },
    schema: [],
  },
  create(context: Rule.RuleContext) {
    return {
      ThrowStatement(node: Rule.Node) {
        context.report({ node, message: "No throw in domain code. Return a Result instead." });
      },
    };
  },
} satisfies Rule.RuleModule;

export default noThrowOutsideAdapters;
