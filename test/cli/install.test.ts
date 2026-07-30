import { describe, expect, it } from "vitest";
import { applyConfigs, applyHusky, applyPackageJson } from "../../src/cli/install.js";
import type { InstallFlags, PkgJson } from "../../src/cli/types.js";

const baseFlags: InstallFlags = {
  noHusky: false,
  noTsconfig: false,
  force: false,
  dryRun: true,
};

const basePkg: PkgJson = {
  name: "x",
  version: "1.0.0",
  type: { some: true, value: "module" },
  scripts: {},
  dependencies: {},
  devDependencies: {},
  root: { name: "x", version: "1.0.0" },
};

describe("applyPackageJson (dry-run)", () => {
  it("does not write to disk and reports dry-run", () => {
    const r = applyPackageJson(basePkg, baseFlags);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe("dry-run");
  });
});

describe("applyConfigs (dry-run)", () => {
  it("does not write to disk and reports dry-run", () => {
    const r = applyConfigs(baseFlags, false);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe("dry-run");
  });
});

describe("applyHusky", () => {
  it("returns skipped when noHusky is true", () => {
    const flags: InstallFlags = { ...baseFlags, noHusky: true, dryRun: false };
    const r = applyHusky(flags);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe("skipped");
  });

  it("returns dry-run when dryRun is true and husky enabled", () => {
    const flags: InstallFlags = { ...baseFlags, dryRun: true };
    const r = applyHusky(flags);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe("dry-run");
  });
});
