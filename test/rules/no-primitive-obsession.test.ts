/* eslint-disable sadist/no-primitive-obsession, sadist/no-throw-outside-adapters, sadist/no-null-in-domain-types, sadist/no-single-use-generics */
import { RuleTester } from "eslint";
import tsParser from "@typescript-eslint/parser";
import { describe, it } from "vitest";
import rule from "../../src/rules/no-primitive-obsession.js";

describe("no-primitive-obsession", () => {
  it("passes RuleTester cases", () => {
    const ruleTester = new RuleTester({
      languageOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        parser: tsParser,
      },
    });
    ruleTester.run("no-primitive-obsession", rule, {
      valid: [
        {
          code: "type User = { userId: string & { readonly __brand: 'UserId' } }",
        },
        {
          code: "interface User { name: string }",
        },
      ],
      invalid: [
        {
          code: "type User = { userId: string }",
          errors: 1,
        },
        {
          code: "interface User { orderId: number }",
          errors: 1,
        },
      ],
    });
  });
});
