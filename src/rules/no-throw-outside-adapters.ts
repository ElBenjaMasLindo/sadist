import type { Rule } from "eslint";

const noThrowOutsideAdapters = {
  meta: {
    type: "problem" as const,
    docs: { description: "No throw statements outside src/adapters/." },
    schema: [],
  },
  create(context: Rule.RuleContext) {
    const filename = context.filename ?? context.getFilename();
    if (filename.includes("/adapters/")) return {};
    return {
      ThrowStatement(node: Rule.Node) {
        context.report({
          node,
          message: "No throw outside src/adapters/. Return a Result instead.",
        });
      },
    };
  },
} satisfies Rule.RuleModule;

export default noThrowOutsideAdapters;
