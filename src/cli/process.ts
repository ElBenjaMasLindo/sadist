import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathExists } from "./files.js";
import type { PkgManager, Result } from "./types.js";

export function detectPkgManager(): PkgManager {
  if (pathExists("pnpm-lock.yaml")) return "pnpm";
  if (pathExists("yarn.lock")) return "yarn";
  return "npm";
}

export function exec(
  cmd: string,
  args: readonly string[],
): Result<string, string> {
  const r = spawnSync(cmd, args as string[], {
    cwd: process.cwd(),
    stdio: "inherit",
    encoding: "utf8",
  });
  if (r.status !== 0) {
    return {
      ok: false,
      error: `${cmd} ${args.join(" ")} exited with code ${String(r.status)}`,
    };
  }
  return { ok: true, value: "" };
}

export function addCmd(
  pkg: PkgManager,
  klass: "dev" | "prod",
  deps: readonly string[],
): readonly [string, string[]] {
  if (pkg === "pnpm") {
    const args = klass === "dev" ? ["add", "-D", ...deps] : ["add", ...deps];
    return ["pnpm", args];
  }
  if (pkg === "yarn") {
    const args = klass === "dev" ? ["add", "-D", ...deps] : ["add", ...deps];
    return ["yarn", args];
  }
  const args =
    klass === "dev"
      ? ["install", "--save-dev", ...deps]
      : ["install", "--save", ...deps];
  return ["npm", args];
}

export function isGitRepo(): boolean {
  return existsSync(resolve(process.cwd(), ".git"));
}
