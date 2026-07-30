/* eslint-disable sadist/no-single-use-generics, sadist/no-throw-outside-adapters, sadist/no-null-in-domain-types */
import { RuleTester } from "eslint";
import tsParser from "@typescript-eslint/parser";
import { describe, it } from "vitest";
import rule from "../../src/rules/no-single-use-generics.js";

describe("no-single-use-generics", () => {
  it("passes RuleTester cases", () => {
    const ruleTester = new RuleTester({
      languageOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        parser: tsParser,
      },
    });
    ruleTester.run("no-single-use-generics", rule, {
      valid: [
        { code: "function id<T>(x: T): T { return x; }" },
        { code: "function pair<T>(a: T, b: T): T { return a; }" },
      ],
      invalid: [
        {
          code: "function wrap<T>(x: string): string { return x; }",
          errors: 1,
        },
      ],
    });
  });
});
