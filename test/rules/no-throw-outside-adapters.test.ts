/* eslint-disable sadist/no-throw-outside-adapters */
import { RuleTester } from "eslint";
import { describe, it } from "vitest";
import rule from "../../src/rules/no-throw-outside-adapters.js";

describe("no-throw-outside-adapters", () => {
  it("passes RuleTester cases", () => {
    const ruleTester = new RuleTester({
      languageOptions: { ecmaVersion: 2022, sourceType: "module" },
    });
    ruleTester.run("no-throw-outside-adapters", rule, {
      valid: [
        {
          code: "throw new Error('x');",
          filename: "src/adapters/db.ts",
        },
      ],
      invalid: [
        {
          code: "throw new Error('x');",
          filename: "src/domain/user.ts",
          errors: 1,
        },
      ],
    });
  });
});
