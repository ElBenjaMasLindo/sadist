import { RuleTester } from "eslint";
import { describe, it } from "vitest";
import rule from "../../src/rules/no-throw-outside-adapters.js";

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: "module" },
});

describe("no-throw-outside-adapters", () => {
  it("passes RuleTester cases", () => {
    ruleTester.run("no-throw-outside-adapters", rule, {
      valid: [
        { code: "throw new Error('x');", filename: "src/adapters/db.ts" },
      ],
      invalid: [
        { code: "throw new Error('x');", filename: "src/domain/user.ts", errors: 1 },
      ],
    });
  });
});
