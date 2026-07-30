import strict from "./dist/config/strict.js";
import tsParser from "@typescript-eslint/parser";

export default [
  ...strict,
  {
    files: ["**/*.ts"],
    languageOptions: { parser: tsParser },
  },
  {
    ignores: ["dist/**", "node_modules/**", "examples/**"],
  },
];
