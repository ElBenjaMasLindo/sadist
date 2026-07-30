import type { Rule } from "eslint";

const noThrowOutsideAdapters: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: { description: "No throw statements outside src/adapters/." },
    schema: [],
  },
  create(context) {
    const filename = context.filename ?? context.getFilename();
    if (filename.includes("/adapters/")) return {};
    return {
      ThrowStatement(node) {
        context.report({
          node,
          message: "No throw outside src/adapters/. Return a Result instead.",
        });
      },
    };
  },
};

export default noThrowOutsideAdapters;
