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
        { code: "function f() { return 1; }" },
      ],
      invalid: [
        { code: "throw new Error('x');", errors: 1 },
        { code: "function f() { throw new Error('x'); }", errors: 1 },
      ],
    });
  });
});
