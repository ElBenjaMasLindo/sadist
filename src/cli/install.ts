import { match, P } from "ts-pattern";
import { VERSION } from "./version.js";
import {
  hasDep,
  pathExists,
  readPkg,
  readText,
  writeText,
} from "./files.js";
import { addCmd, detectPkgManager, exec, isGitRepo } from "./process.js";
import { applySkill, planSkill } from "./skill.js";
import {
  eslintConfigTemplate,
  gateFullScriptTemplate,
  gitignoreTemplate,
  preCommitTemplate,
  prePushTemplate,
  tsconfigTemplate,
} from "./templates.js";
import type {
  InstallFlags,
  InstallPlan,
  MissingDep,
  PkgJson,
  Result,
} from "./types.js";

const GATE_SCRIPT = "eslint . && tsc --noEmit";
const PREPARE_SCRIPT = "husky";

type PlanCtx = {
  readonly pkg: PkgJson;
  readonly flags: InstallFlags;
  readonly pkgManager: "pnpm" | "yarn" | "npm";
  readonly out: PlanOut;
};

export function buildPlan(
  pkg: PkgJson,
  flags: InstallFlags,
): Result<InstallPlan, string> {
  const pkgManager = detectPkgManager();
  const missing = computeMissing(pkg, flags);
  const out = emptyOut();
  const ctx: PlanCtx = { pkg, flags, pkgManager, out };
  collectPlans(ctx);
  return ok({
    pkgManager,
    missing,
    willCreate: out.create,
    willWarn: out.warn,
  });
}

type PlanOut = { create: string[]; warn: string[] };

function emptyOut(): PlanOut {
  return { create: [], warn: [] };
}

function collectPlans(ctx: PlanCtx): void {
  planEslint(ctx.out);
  planTsconfig(ctx.flags, ctx.out);
  planGateScript(ctx);
  planModuleType(ctx.pkg, ctx.out);
  planHusky(ctx.flags, ctx.pkg, ctx.out);
  planGitignore(ctx.out);
  planSkill(ctx.out);
}

function planEslint(out: PlanOut): void {
  if (!pathExists("eslint.config.mjs")) {
    out.create.push("eslint.config.mjs");
    return;
  }
  out.warn.push(
    "eslint.config.mjs already exists; add 'import strict from \"sadist/config/strict\"' and spread ...strict manually",
  );
}

function planTsconfig(flags: InstallFlags, out: PlanOut): void {
  if (flags.noTsconfig) return;
  if (!pathExists("tsconfig.json")) {
    out.create.push("tsconfig.json");
    return;
  }
  out.warn.push(
    "tsconfig.json already exists; ensure strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes are enabled",
  );
}

function planGateScript(ctx: PlanCtx): void {
  planOneScript(ctx, "gate", GATE_SCRIPT);
  planOneScript(ctx, "gate:full", gateFullScriptTemplate(ctx.pkgManager));
}

function planOneScript(
  ctx: PlanCtx,
  name: string,
  expected: string,
): void {
  const current = ctx.pkg.scripts[name];
  if (!current) {
    ctx.out.create.push(`package.json#scripts.${name}`);
    return;
  }
  if (current !== expected) {
    ctx.out.warn.push(
      `package.json#scripts.${name} exists with value "${current}"; expected "${expected}"`,
    );
  }
}

function planModuleType(pkg: PkgJson, out: PlanOut): void {
  if (pkg.type.some === false) {
    out.warn.push("package.json missing \"type\": \"module\"");
    return;
  }
  if (pkg.type.value !== "module") {
    out.warn.push(
      `package.json#type is "${pkg.type.value}"; expected "module"`,
    );
  }
}

function planHusky(flags: InstallFlags, pkg: PkgJson, out: PlanOut): void {
  if (flags.noHusky) return;
  planHook(".husky/pre-commit", out);
  planHook(".husky/pre-push", out);
  planPrepare(pkg, out);
}

function planHook(file: string, out: PlanOut): void {
  if (!pathExists(file)) {
    out.create.push(file);
  } else {
    out.warn.push(`${file} already exists`);
  }
}

function planPrepare(pkg: PkgJson, out: PlanOut): void {
  const prep = pkg.scripts["prepare"];
  if (!prep) {
    out.create.push("package.json#scripts.prepare");
  } else if (prep !== PREPARE_SCRIPT) {
    out.warn.push(
      `package.json#scripts.prepare is "${prep}"; expected "${PREPARE_SCRIPT}"`,
    );
  }
}

function planGitignore(out: PlanOut): void {
  if (!pathExists(".gitignore")) {
    out.create.push(".gitignore");
    return;
  }
  out.warn.push(".gitignore already exists; review recommended entries");
}

export function printPlan(plan: InstallPlan): void {
  process.stdout.write(`\n[plan] package manager: ${plan.pkgManager}\n`);
  printSection("install", plan.missing, formatDep);
  printSection("create", plan.willCreate, formatCreate);
  printSection("warn", plan.willWarn, formatWarn);
  process.stdout.write("\n");
}

function printSection<T>(
  label: string,
  items: readonly T[],
  fmt: (t: T) => string,
): void {
  if (items.length === 0) {
    process.stdout.write(`[plan] ${label}: (none)\n`);
    return;
  }
  process.stdout.write(`[plan] ${label}:\n`);
  for (const it of items) process.stdout.write(`  ${fmt(it)}\n`);
}

function formatDep(d: { name: string; class: string; range: string }): string {
  return `- ${d.name} (${d.class}) ${d.range}`;
}

function formatCreate(f: string): string {
  return `+ ${f}`;
}

function formatWarn(w: string): string {
  return `! ${w}`;
}

export function installMissing(
  plan: InstallPlan,
  flags: InstallFlags,
): Result<string, string> {
  if (flags.dryRun) return { ok: true, value: "dry-run" };
  return installByClass(plan.pkgManager, plan.missing);
}

function installByClass(
  pkg: "pnpm" | "yarn" | "npm",
  missing: readonly MissingDep[],
): Result<string, string> {
  const r1 = runClass(pkg, missing, "dev");
  if (!r1.ok) return r1;
  return runClass(pkg, missing, "prod");
}

function runClass(
  pkg: "pnpm" | "yarn" | "npm",
  missing: readonly MissingDep[],
  klass: "dev" | "prod",
): Result<string, string> {
  const deps = missing.filter((d) => d.class === klass).map((d) => `${d.name}@${d.range}`);
  if (deps.length === 0) return { ok: true, value: "noop" };
  const [cmd, args] = addCmd(pkg, klass, deps);
  return exec(cmd, args);
}

export function applyConfigs(
  flags: InstallFlags,
  force: boolean,
): Result<string, string> {
  if (flags.dryRun) return { ok: true, value: "dry-run" };
  return writeAllConfigs({ flags, force });
}

type WriteCtx = { flags: InstallFlags; force: boolean };

function writeAllConfigs(ctx: WriteCtx): Result<string, string> {
  const r1 = maybeWrite(ctx, "tsconfig.json", tsconfigTemplate);
  if (!r1.ok) return r1;
  const r2 = maybeWrite(ctx, "eslint.config.mjs", eslintConfigTemplate);
  if (!r2.ok) return r2;
  return maybeWrite(ctx, ".gitignore", gitignoreTemplate);
}

function maybeWrite(
  ctx: WriteCtx,
  file: string,
  content: string,
): Result<string, string> {
  return match(mustWrite(ctx, file))
    .with(true, () => writeText(file, content))
    .with(false, () => ok("skip"))
    .exhaustive();
}

function mustWrite(ctx: WriteCtx, file: string): boolean {
  if (ctx.flags.noTsconfig && file === "tsconfig.json") return false;
  return ctx.force || !pathExists(file);
}

export function applyPackageJson(
  pkg: PkgJson,
  flags: InstallFlags,
  pkgManager: "pnpm" | "yarn" | "npm" = detectPkgManager(),
): Result<string, string> {
  if (flags.dryRun) return { ok: true, value: "dry-run" };
  const currentPkgR = readPkg();
  if (!currentPkgR.ok) return currentPkgR;
  const next = buildNextPkg(currentPkgR.value, flags, pkgManager);
  const json = `${JSON.stringify(next, null, 2)}\n`;
  return writeText("package.json", json);
}

function buildNextPkg(
  pkg: PkgJson,
  flags: InstallFlags,
  pkgManager: "pnpm" | "yarn" | "npm",
): Record<string, unknown> {
  const scripts = mergeScripts(pkg, flags, pkgManager);
  return {
    ...pkg.root,
    type: pkg.type.some ? pkg.type.value : "module",
    scripts,
  };
}

function mergeScripts(
  pkg: PkgJson,
  flags: InstallFlags,
  pkgManager: "pnpm" | "yarn" | "npm",
): Record<string, string> {
  const scripts: Record<string, string> = { ...pkg.scripts };
  if (!scripts["gate"]) scripts["gate"] = GATE_SCRIPT;
  if (!scripts["gate:full"]) {
    scripts["gate:full"] = gateFullScriptTemplate(pkgManager);
  }
  if (!flags.noHusky && !scripts["prepare"]) {
    scripts["prepare"] = PREPARE_SCRIPT;
  }
  return scripts;
}

export function applyHusky(
  flags: InstallFlags,
  pkgManager: "pnpm" | "yarn" | "npm" = "npm",
): Result<string, string> {
  if (flags.noHusky) return { ok: true, value: "skipped" };
  if (flags.dryRun) return { ok: true, value: "dry-run" };
  return writeHuskyHook(pkgManager);
}

function writeHuskyHook(
  pkgManager: "pnpm" | "yarn" | "npm",
): Result<string, string> {
  if (!isGitRepo()) {
    return { ok: false, error: ".git not found; init a repo before husky" };
  }
  const r1 = writeHook(".husky/pre-commit", preCommitTemplate(pkgManager));
  if (!r1.ok) return r1;
  return writeHook(".husky/pre-push", prePushTemplate(pkgManager));
}

function writeHook(file: string, content: string): Result<string, string> {
  if (!pathExists(file)) {
    const r = writeText(file, content, 0o755);
    if (!r.ok) return r;
  }
  return { ok: true, value: "husky" };
}

export function runInstallCommand(
  argv: readonly string[],
): Result<string, string> {
  const flags = parseFlags(argv);
  if (!flags.ok) return flags;
  return runWith(flags.value);
}

function runWith(flags: InstallFlags): Result<string, string> {
  const pkgR = readPkg();
  if (!pkgR.ok) return pkgR;
  const planR = buildPlan(pkgR.value, flags);
  if (!planR.ok) return planR;
  printPlan(planR.value);
  return executeSteps(pkgR.value, planR.value, flags);
}

function executeSteps(
  pkg: PkgJson,
  plan: InstallPlan,
  flags: InstallFlags,
): Result<string, string> {
  const steps: readonly (() => Result<string, string>)[] = [
    () => installMissing(plan, flags),
    () => applyPackageJson(pkg, flags),
    () => applyConfigs(flags, flags.force),
    () => applySkill({ force: flags.force, dryRun: flags.dryRun }),
    () => applyHusky(flags, plan.pkgManager),
  ];
  for (const step of steps) {
    const r = step();
    if (!r.ok) return r;
  }
  return { ok: true, value: "done" };
}

function computeMissing(
  pkg: PkgJson,
  flags: InstallFlags,
): readonly MissingDep[] {
  const required: readonly MissingDep[] = [
    { name: "sadist", class: "dev", range: VERSION },
    { name: "typescript", class: "dev", range: "5.6.3" },
    { name: "eslint", class: "dev", range: "9.39.5" },
    { name: "@typescript-eslint/parser", class: "dev", range: "8.48.1" },
    { name: "@typescript-eslint/eslint-plugin", class: "dev", range: "8.48.1" },
    { name: "ts-pattern", class: "prod", range: "5.9.0" },
    ...(flags.noHusky
      ? []
      : [{ name: "husky", class: "dev" as const, range: "9.1.7" }]),
  ];
  return required.filter((d) => !hasDep(pkg, d.name));
}

function parseFlags(argv: readonly string[]): Result<InstallFlags, string> {
  const flags: { -readonly [K in keyof InstallFlags]: InstallFlags[K] } = {
    noHusky: false,
    noTsconfig: false,
    force: false,
    dryRun: false,
  };
  for (const a of argv) {
    const r = parseOne(a, flags);
    if (!r.ok) return r;
  }
  return { ok: true, value: flags };
}

function parseOne(
  flag: string,
  flags: { -readonly [K in keyof InstallFlags]: InstallFlags[K] },
): Result<{ [K in keyof InstallFlags]: InstallFlags[K] }, string> {
  return match(flag)
    .with("--no-husky", () => okMut(flags, "noHusky"))
    .with("--no-tsconfig", () => okMut(flags, "noTsconfig"))
    .with("--force", () => okMut(flags, "force"))
    .with("--dry-run", () => okMut(flags, "dryRun"))
    .with("--help", () => {
      printHelp();
      process.exit(0);
      return ok(flags);
    })
    .with(P.string, (f) => ({
      ok: false as const,
      error: `unknown flag: ${f}`,
    }))
    .exhaustive();
}

function ok<T>(value: T): { ok: true; value: T } {
  return { ok: true, value };
}

function okMut<K extends keyof InstallFlags>(
  flags: { -readonly [P in keyof InstallFlags]: InstallFlags[P] },
  key: K,
): Result<{ [P in keyof InstallFlags]: InstallFlags[P] }, string> {
  flags[key] = true as InstallFlags[K];
  return { ok: true, value: flags };
}

function printHelp(): void {
  process.stdout.write(
    [
      "sadist install - configure a project with the sadist gate",
      "",
      "usage: sadist install [flags]",
      "",
      "flags:",
      "  --no-husky     skip pre-commit hook setup",
      "  --no-tsconfig  skip tsconfig.json creation",
      "  --force        overwrite existing files",
      "  --dry-run      print plan without applying changes",
      "  --help         show this help",
      "",
    ].join("\n"),
  );
}
