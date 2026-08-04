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

export function preCommitTemplate(pkgManager: "pnpm" | "yarn" | "npm" = "npm"): string {
  if (pkgManager === "pnpm") return "pnpm run gate\n";
  if (pkgManager === "yarn") return "yarn gate\n";
  return "npm run gate\n";
}

export function prePushTemplate(pkgManager: "pnpm" | "yarn" | "npm" = "npm"): string {
  if (pkgManager === "pnpm") return "pnpm run gate:full\n";
  if (pkgManager === "yarn") return "yarn gate:full\n";
  return "npm run gate:full\n";
}

export function gateFullScriptTemplate(pkgManager: "pnpm" | "yarn" | "npm" = "npm"): string {
  if (pkgManager === "pnpm") return "pnpm run gate && pnpm run build";
  if (pkgManager === "yarn") return "yarn gate && yarn build";
  return "npm run gate && npm run build";
}

export const gitignoreTemplate = `# dependencies
node_modules/
.pnpm-store/

# build output
dist/

# environment
.env
.env.*

# editor
.vscode/
.idea/
.zed/

# os
.DS_Store
Thumbs.db
`;
