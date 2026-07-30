import { RuleTester } from "eslint";
import tsParser from "@typescript-eslint/parser";
import { describe, it } from "vitest";
import rule from "../../src/rules/no-null-in-domain-types.js";

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: "module", parser: tsParser },
});

describe("no-null-in-domain-types", () => {
  it("passes RuleTester cases", () => {
    ruleTester.run("no-null-in-domain-types", rule, {
      valid: [
        { code: "type User = { name: string };", filename: "src/domain/user.ts" },
      ],
      invalid: [
        { code: "type User = { name: string | null };", filename: "src/domain/user.ts", errors: 1 },
        { code: "interface User { name: string | null }", filename: "src/domain/user.ts", errors: 1 },
        { code: "type User = { name: string | undefined };", filename: "src/domain/user.ts", errors: 1 },
      ],
    });
  });
});
