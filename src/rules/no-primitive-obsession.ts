import type { Rule } from "eslint";
import { containsPrimitiveKeyword } from "./_shared/ast-walk.js";

type TSPropertyNode = Rule.Node & {
  key?: { type?: string; name?: string };
  typeAnnotation?: { typeAnnotation?: Rule.Node };
};

// eslint-disable-next-line complexity, sadist/no-null-in-domain-types
function getIdName(node: TSPropertyNode): string | null {
  const name = node.key?.name;
  if (!name) return null;
  if (name.toLowerCase() === "id") return name;
  if (/[a-z]Id$/.test(name)) return name;
  if (/_id$/.test(name)) return name;
  if (/ID$/.test(name)) return name;
  return null;
}

const noPrimitiveObsession = {
  meta: {
    type: "problem" as const,
    docs: {
      description:
        "ID properties must use branded types, not bare primitives. Applies everywhere, including src/adapters/: ID mixups are most dangerous exactly at I/O boundaries, not less.",
    },
    schema: [],
  },
  create(context: Rule.RuleContext) {
    return {
      TSPropertySignature(node: TSPropertyNode) {
        const idName = getIdName(node);
        if (!idName) return;
        const typeNode = node.typeAnnotation?.typeAnnotation;
        if (!typeNode || !containsPrimitiveKeyword(typeNode)) return;
        context.report({
          node,
          message: `Property "${idName}" wraps a bare string/number. Use a branded type: string & { readonly __brand: "${idName}" }.`,
        });
      },
    };
  },
} satisfies Rule.RuleModule;

export default noPrimitiveObsession;
