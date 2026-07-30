import type { Rule } from "eslint";

type TSPropertyNode = Rule.Node & {
  key?: Record<string, unknown>;
  typeAnnotation?: { typeAnnotation?: { type: string } };
};

function getIdName(node: TSPropertyNode): string | null {
  const key = node.key as { name?: string } | undefined;
  return key?.name?.endsWith("Id") ? key.name : null;
}

function isBarePrimitive(node: TSPropertyNode): boolean {
  return node.typeAnnotation?.typeAnnotation?.type === "TSStringKeyword"
    || node.typeAnnotation?.typeAnnotation?.type === "TSNumberKeyword";
}

function isBarePrimitiveId(node: TSPropertyNode): string | null {
  const name = getIdName(node);
  if (!name) return null;
  return isBarePrimitive(node) ? name : null;
}

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
      TSPropertySignature(node: TSPropertyNode) {
        const idName = isBarePrimitiveId(node);
        if (idName) {
          context.report({
            node,
            message: `Property "${idName}" is a bare primitive. Use a branded type: string & { readonly __brand: "${idName}" }.`,
          });
        }
      },
    };
  },
} satisfies Rule.RuleModule;

export default noPrimitiveObsession;
