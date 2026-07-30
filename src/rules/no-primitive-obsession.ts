import type { Rule } from "eslint";

const noPrimitiveObsession = {
  meta: {
    type: "problem" as const,
    docs: {
      description:
        "ID properties must use branded types, not bare primitives.",
    },
    schema: [],
  },
  create(context: Rule.RuleContext) {
    return {
      TSPropertySignature(node: Rule.Node & { key?: Record<string, unknown>; typeAnnotation?: { typeAnnotation?: { type: string } } }) {
        const key = node.key as { name?: string } | undefined;
        if (!key?.name || !key.name.endsWith("Id")) return;
        const inner = node.typeAnnotation?.typeAnnotation;
        if (
          inner?.type === "TSStringKeyword" ||
          inner?.type === "TSNumberKeyword"
        ) {
          context.report({
            node,
            message: `Property "${key.name}" is a bare primitive. Use a branded type: string & { readonly __brand: "${key.name}" }.`,
          });
        }
      },
    };
  },
} satisfies Rule.RuleModule;

export default noPrimitiveObsession;
