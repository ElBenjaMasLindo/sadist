import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import type { Linter } from "eslint";
import { rules as sadistRules } from "../rules/index.js";

type EslintPlugin = NonNullable<Linter.Config["plugins"]>[string];
const tsPluginTyped: EslintPlugin = tsPlugin as never;

const domainRules: Linter.RulesRecord = {
  "sadist/no-null-in-domain-types": "error",
  "sadist/no-primitive-obsession": "error",
  "sadist/no-single-use-generics": "error",
  "sadist/no-throw-outside-adapters": "error",
  "sadist/require-ts-pattern-exhaustive": "error",
  "sadist/no-ts-suppressions": "error",
  "@typescript-eslint/no-explicit-any": "error",
  "@typescript-eslint/no-non-null-assertion": "error",
  "@typescript-eslint/ban-ts-comment": "error",
  "no-restricted-syntax": [
    "error",
    { selector: "ClassDeclaration", message: "No classes in domain logic. Use functions and discriminated unions." },
    { selector: "ClassExpression", message: "No classes in domain logic. Use functions and discriminated unions." },
  ],
  complexity: ["error", 6],
  "max-lines-per-function": ["error", 20],
  "max-params": ["error", 3],
};

const strict: Linter.Config[] = [
  {
    files: ["**/*.generated.ts", "**/generated/**"],
    ignores: [],
    rules: {},
  },
  {
    files: ["src/**/*.ts"],
    ignores: ["src/adapters/**", "**/*.generated.ts", "**/generated/**"],
    languageOptions: { parser: tsParser },
    plugins: { sadist: { rules: sadistRules }, "@typescript-eslint": tsPluginTyped },
    rules: domainRules,
  },
  {
    files: ["src/adapters/**/*.ts"],
    ignores: ["**/*.generated.ts", "**/generated/**"],
    languageOptions: { parser: tsParser },
    plugins: { sadist: { rules: sadistRules } },
    rules: {
      "sadist/no-primitive-obsession": "error",
      complexity: ["error", 6],
      "max-lines-per-function": ["error", 20],
      "max-params": ["error", 3],
    },
  },
];

export default strict;
