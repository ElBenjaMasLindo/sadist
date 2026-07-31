import type { Rule } from "eslint";

type AnyNode = Record<string, unknown> & { type?: string };

const SKIP_KEYS = new Set(["parent", "loc", "range", "start", "end"]);

function isNodeLike(value: unknown): value is AnyNode {
  return typeof value === "object" && value !== null && typeof (value as AnyNode).type === "string";
}

function walk(node: unknown, visit: (n: AnyNode) => void): void {
  if (Array.isArray(node)) {
    for (const item of node) walk(item, visit);
    return;
  }
  if (!isNodeLike(node)) return;
  visit(node);
  for (const key of Object.keys(node)) {
    if (SKIP_KEYS.has(key)) continue;
    walk(node[key], visit);
  }
}

export function countTypeReferences(root: Rule.Node, typeName: string): number {
  let count = 0;
  walk(root, (n) => {
    if (n.type === "TSTypeReference") {
      const ref = n as { typeName?: { name?: string } };
      if (ref.typeName?.name === typeName) count += 1;
    }
  });
  return count;
}

export function containsPrimitiveKeyword(root: Rule.Node): boolean {
  let found = false;
  walk(root, (n) => {
    if (n.type === "TSStringKeyword" || n.type === "TSNumberKeyword") found = true;
  });
  return found;
}
