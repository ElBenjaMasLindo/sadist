import { RuleTester } from "eslint";
import tsParser from "@typescript-eslint/parser";
import { describe, it } from "vitest";
import rule from "../../src/rules/require-ts-pattern-exhaustive.js";

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: "module", parser: tsParser },
});

describe("require-ts-pattern-exhaustive", () => {
  it("passes RuleTester cases", () => {
    ruleTester.run("require-ts-pattern-exhaustive", rule, {
      valid: [
        { code: `match(1).with(1, () => "a").with(2, () => "b").exhaustive();` },
      ],
      invalid: [
        { code: `match(1).with(1, () => "a").with(2, () => "b").otherwise(() => "c");`, errors: 1 },
        { code: `match(1).with(1, () => "a").with(2, () => "b");`, errors: 1 },
      ],
    });
  });
});
