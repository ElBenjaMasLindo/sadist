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
