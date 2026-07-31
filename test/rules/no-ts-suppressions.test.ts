import { RuleTester } from "eslint";
import tsParser from "@typescript-eslint/parser";
import { describe, it } from "vitest";
import rule from "../../src/rules/no-ts-suppressions.js";

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: "module", parser: tsParser },
});

describe("no-ts-suppressions", () => {
  it("passes RuleTester cases", () => {
    ruleTester.run("no-ts-suppressions", rule, {
      valid: [
        { code: `const x: string = "hello";` },
        { code: `const x = "hello" as string;` },
        { code: `const x = foo as string;` },
        { code: `// sadist-exception: TICKET-123\nconst x = foo as unknown as string;` },
      ],
      invalid: [
        { code: `const x = foo as unknown as string;`, errors: 1 },
      ],
    });
  });
});
