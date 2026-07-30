import strict from "./dist/config/strict.js";

export default [
  ...strict,
  {
    ignores: ["dist/**", "node_modules/**", "examples/**"]
  }
];
