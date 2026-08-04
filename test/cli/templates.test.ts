import { describe, expect, it } from "vitest";
import {
  eslintConfigTemplate,
  gateFullScriptTemplate,
  preCommitTemplate,
  prePushTemplate,
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
  it("runs npm run gate by default for npm manager", () => {
    expect(preCommitTemplate()).toBe("npm run gate\n");
  });

  it("checks pnpm and falls back to npm for pnpm manager", () => {
    const template = preCommitTemplate("pnpm");
    expect(template).toBe(
      "if command -v pnpm >/dev/null 2>&1; then\n  pnpm run gate\nelse\n  npm run gate\nfi\n",
    );
  });

  it("checks yarn and falls back to npm for yarn manager", () => {
    const template = preCommitTemplate("yarn");
    expect(template).toBe(
      "if command -v yarn >/dev/null 2>&1; then\n  yarn gate\nelse\n  npm run gate\nfi\n",
    );
  });
});

describe("prePushTemplate", () => {
  it("runs npm run gate:full by default for npm manager", () => {
    expect(prePushTemplate()).toBe("npm run gate:full\n");
  });

  it("checks pnpm and falls back to npm for pnpm manager", () => {
    const template = prePushTemplate("pnpm");
    expect(template).toBe(
      "if command -v pnpm >/dev/null 2>&1; then\n  pnpm run gate:full\nelse\n  npm run gate:full\nfi\n",
    );
  });

  it("checks yarn and falls back to npm for yarn manager", () => {
    const template = prePushTemplate("yarn");
    expect(template).toBe(
      "if command -v yarn >/dev/null 2>&1; then\n  yarn gate:full\nelse\n  npm run gate:full\nfi\n",
    );
  });
});

describe("gateFullScriptTemplate", () => {
  it("runs npm run gate && npm run build by default", () => {
    expect(gateFullScriptTemplate()).toBe("npm run gate && npm run build");
  });

  it("runs pnpm run gate && pnpm run build for pnpm", () => {
    expect(gateFullScriptTemplate("pnpm")).toBe("pnpm run gate && pnpm run build");
  });

  it("runs yarn gate && yarn build for yarn", () => {
    expect(gateFullScriptTemplate("yarn")).toBe("yarn gate && yarn build");
  });
});

