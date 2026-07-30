import sadist from "./dist/config/strict.js";

export default [
  ...sadist,
  {
    rules: {
      complexity: ["error", 6],
      "max-lines-per-function": ["error", 20],
      "max-params": ["error", 3],
      "no-restricted-syntax": [
        "error",
        {
          selector: "ClassDeclaration",
          message: "No classes in domain logic. Use functions and discriminated unions."
        },
        {
          selector: "ThrowStatement",
          message: "No throw outside src/adapters/. Return a Result instead."
        }
      ]
    }
  }
];
