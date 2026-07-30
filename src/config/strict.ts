import type { Linter } from "eslint";
import { rules } from "../rules/index.js";

const strictConfig: Linter.Config[] = [
  {
    plugins: {
      sadist: { rules },
    },
    rules: {
      "sadist/no-throw-outside-adapters": "error",
      "sadist/no-null-in-domain-types": "error",
      "sadist/no-single-use-generics": "error",
      "sadist/no-primitive-obsession": "error",
      complexity: ["error", 6],
      "max-lines-per-function": ["error", 20],
      "max-params": ["error", 3],
      "no-restricted-syntax": [
        "error",
        {
          selector: "ClassDeclaration",
          message:
            "No classes in domain logic. Use functions and discriminated unions.",
        },
        {
          selector: "ClassExpression",
          message:
            "No classes in domain logic. Use functions and discriminated unions.",
        },
        {
          selector: "TSAnyKeyword",
          message: "No any. Use a specific type.",
        },
        {
          selector: "TSNonNullExpression",
          message: "No non-null assertions (!). Handle the nullable case explicitly.",
        },
      ],
    },
  },
];

export default strictConfig;
