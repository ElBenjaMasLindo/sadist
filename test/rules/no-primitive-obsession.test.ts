import { RuleTester } from "eslint";
import tsParser from "@typescript-eslint/parser";
import { describe, it } from "vitest";
import rule from "../../src/rules/no-primitive-obsession.js";

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: "module", parser: tsParser },
});

describe("no-primitive-obsession", () => {
  it("passes RuleTester cases", () => {
    ruleTester.run("no-primitive-obsession", rule, {
      valid: [
        { code: "type UserId = string & { readonly __brand: 'UserId' }; type User = { userId: UserId }" },
        { code: "interface User { name: string }" },
      ],
      invalid: [
        { code: "type User = { userId: string }", errors: 1 },
        { code: "interface User { orderId: number }", errors: 1 },
      ],
    });
  });
});
