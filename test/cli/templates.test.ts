import { describe, expect, it } from "vitest";
import {
  eslintConfigTemplate,
  gitignoreTemplate,
  preCommitTemplate,
  tsconfigTemplate,
} from "../../src/cli/templates.js";

describe("eslintConfigTemplate", () => {
  it("imports sadist strict config", () => {
    expect(eslintConfigTemplate).toContain(
      "import strict from \"sadist/config/strict\"",
    );
  });

  it("spreads the strict config", () => {
    expect(eslintConfigTemplate).toContain("...strict");
  });

  it("configures TypeScript parser for src", () => {
    expect(eslintConfigTemplate).toContain("@typescript-eslint/parser");
    expect(eslintConfigTemplate).toContain("src/**/*.ts");
  });
});

describe("tsconfigTemplate", () => {
  it("enables strict mode", () => {
    expect(tsconfigTemplate).toContain('"strict": true');
  });

  it("enables noUncheckedIndexedAccess", () => {
    expect(tsconfigTemplate).toContain('"noUncheckedIndexedAccess": true');
  });

  it("enables exactOptionalPropertyTypes", () => {
    expect(tsconfigTemplate).toContain('"exactOptionalPropertyTypes": true');
  });
});

describe("preCommitTemplate", () => {
  it("runs npm run gate by default", () => {
    expect(preCommitTemplate()).toContain("npm run gate");
  });

  it("runs pnpm run gate for pnpm", () => {
    expect(preCommitTemplate("pnpm")).toContain("pnpm run gate");
  });

  it("runs yarn gate for yarn", () => {
    expect(preCommitTemplate("yarn")).toContain("yarn gate");
  });
});

describe("gitignoreTemplate", () => {
  it("ignores node_modules", () => {
    expect(gitignoreTemplate).toContain("node_modules/");
  });

  it("ignores dist", () => {
    expect(gitignoreTemplate).toContain("dist/");
  });

  it("ignores .env files", () => {
    expect(gitignoreTemplate).toContain(".env");
  });
});
