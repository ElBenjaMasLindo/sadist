export const eslintConfigTemplate = `import strict from "sadist/config/strict";
import tsParser from "@typescript-eslint/parser";

export default [
  ...strict,
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
    },
  },
];
`;

export const tsconfigTemplate = `{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "declaration": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
`;

export function preCommitTemplate(
  pkgManager: "pnpm" | "yarn" | "npm" = "npm",
): string {
  if (pkgManager === "npm") return "npm run gate\n";
  const cmd = pkgManager === "yarn" ? "yarn gate" : "pnpm run gate";
  return `if command -v ${pkgManager} >/dev/null 2>&1; then\n  ${cmd}\nelse\n  npm run gate\nfi\n`;
}

export function prePushTemplate(
  pkgManager: "pnpm" | "yarn" | "npm" = "npm",
): string {
  if (pkgManager === "npm") return "npm run gate:full\n";
  const cmd = pkgManager === "yarn" ? "yarn gate:full" : "pnpm run gate:full";
  return `if command -v ${pkgManager} >/dev/null 2>&1; then\n  ${cmd}\nelse\n  npm run gate:full\nfi\n`;
}

export function gateFullScriptTemplate(pkgManager: "pnpm" | "yarn" | "npm" = "npm"): string {
  if (pkgManager === "pnpm") return "pnpm run gate && pnpm run build";
  if (pkgManager === "yarn") return "yarn gate && yarn build";
  return "npm run gate && npm run build";
}

