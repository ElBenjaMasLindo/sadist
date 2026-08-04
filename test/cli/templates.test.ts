import { describe, expect, it } from "vitest";
import {
  eslintConfigTemplate,
  gateFullScriptTemplate,
  gitignoreTemplate,
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

describe("prePushTemplate", () => {
  it("runs npm run gate:full by default", () => {
    expect(prePushTemplate()).toContain("npm run gate:full");
  });

  it("runs pnpm run gate:full for pnpm", () => {
    expect(prePushTemplate("pnpm")).toContain("pnpm run gate:full");
  });

  it("runs yarn gate:full for yarn", () => {
    expect(prePushTemplate("yarn")).toContain("yarn gate:full");
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
