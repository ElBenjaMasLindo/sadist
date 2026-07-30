import { describe, expect, it } from "vitest";
import { addCmd, detectPkgManager, isGitRepo } from "../../src/cli/process.js";

describe("detectPkgManager", () => {
  it("returns a valid package manager identifier", () => {
    const r = detectPkgManager();
    expect(["pnpm", "yarn", "npm"]).toContain(r);
  });
});

describe("addCmd / pnpm", () => {
  it("dev", () => {
    const [cmd, args] = addCmd("pnpm", "dev", ["typescript"]);
    expect(cmd).toBe("pnpm");
    expect(args).toEqual(["add", "-D", "typescript"]);
  });
  it("prod", () => {
    const [cmd, args] = addCmd("pnpm", "prod", ["ts-pattern"]);
    expect(cmd).toBe("pnpm");
    expect(args).toEqual(["add", "ts-pattern"]);
  });
});

describe("addCmd / yarn", () => {
  it("dev", () => {
    const [cmd, args] = addCmd("yarn", "dev", ["typescript"]);
    expect(cmd).toBe("yarn");
    expect(args).toEqual(["add", "-D", "typescript"]);
  });
  it("prod", () => {
    const [cmd, args] = addCmd("yarn", "prod", ["ts-pattern"]);
    expect(cmd).toBe("yarn");
    expect(args).toEqual(["add", "ts-pattern"]);
  });
});

describe("addCmd / npm", () => {
  it("dev", () => {
    const [cmd, args] = addCmd("npm", "dev", ["typescript"]);
    expect(cmd).toBe("npm");
    expect(args).toEqual(["install", "--save-dev", "typescript"]);
  });
  it("prod", () => {
    const [cmd, args] = addCmd("npm", "prod", ["ts-pattern"]);
    expect(cmd).toBe("npm");
    expect(args).toEqual(["install", "--save", "ts-pattern"]);
  });
});

describe("isGitRepo", () => {
  it("true when .git exists", () => {
    expect(isGitRepo()).toBe(true);
  });
});
