import { readFileSync, readSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { match, P } from "ts-pattern";
import { pathExists, readText, writeText } from "./files.js";
import type { Option, Result, SkillFlags } from "./types.js";
import { VERSION } from "./version.js";

export const SKILL_PATH = ".agents/skills/sadist/SKILL.md";

type PlanOut = { create: string[]; warn: string[] };

export function planSkill(out: PlanOut): void {
  if (!pathExists(SKILL_PATH)) {
    out.create.push(SKILL_PATH);
    return;
  }
  const r = readText(SKILL_PATH);
  if (!r.ok) {
    out.warn.push(`${SKILL_PATH} cannot be read: ${r.error}`);
    return;
  }
  const current = extractVersion(r.value);
  if (current.some && current.value === VERSION) {
    out.warn.push(`${SKILL_PATH} already exists and is up to date (v${VERSION})`);
    return;
  }
  const from = current.some ? `v${current.value}` : "unknown version";
  out.warn.push(`${SKILL_PATH} already exists (${from}); new version v${VERSION}`);
}

export function extractVersion(content: string): Option<string> {
  const m = content.match(/metadata:\n\s+version: "([^"]+)"/);
  return m && m[1] ? { some: true, value: m[1] } : { some: false };
}

function readShippedSkill(): Result<string, string> {
  const here = dirname(fileURLToPath(import.meta.url));
  try {
    const path = resolve(here, "..", "..", "docs", "SKILL.md");
    return { ok: true, value: readFileSync(path, "utf-8") };
  } catch (e) {
    return { ok: false, error: `cannot read shipped skill: ${String(e)}` };
  }
}

function promptOverwrite(fromVersion: string): boolean {
  if (!process.stdin.isTTY) return false;
  const from = fromVersion.length > 0 ? `v${fromVersion}` : "unknown";
  process.stdout.write(
    `${SKILL_PATH} already exists (${from}). Overwrite with v${VERSION}? [y/N] `,
  );
  return readStdinYes();
}

function readStdinYes(): boolean {
  const buf = Buffer.alloc(1);
  const fd = process.stdin.fd ?? 0;
  try {
    const n = readSync(fd, buf, 0, 1, null);
    return n > 0 && (buf[0] === 0x79 || buf[0] === 0x59);
  } catch {
    return false;
  }
}

export function applySkill(flags: SkillFlags): Result<string, string> {
  if (flags.dryRun) return { ok: true, value: "dry-run" };
  if (!pathExists(SKILL_PATH)) return writeFresh();
  const existingR = readText(SKILL_PATH);
  if (!existingR.ok) return existingR;
  const current = extractVersion(existingR.value);
  if (isCurrentVersion(current)) return { ok: true, value: "up-to-date" };
  if (!shouldOverwrite(flags.force, current)) {
    return { ok: true, value: "skipped" };
  }
  return writeFresh();
}

function isCurrentVersion(current: Option<string>): boolean {
  return current.some && current.value === VERSION;
}

function shouldOverwrite(force: boolean, current: Option<string>): boolean {
  if (force) return true;
  const from = current.some ? current.value : "";
  return promptOverwrite(from);
}

function writeFresh(): Result<string, string> {
  const s = readShippedSkill();
  if (!s.ok) return s;
  const w = writeText(SKILL_PATH, s.value);
  return w.ok ? { ok: true, value: "wrote" } : w;
}

export function runSkillCommand(argv: readonly string[]): Result<string, string> {
  const flagsR = parseSkillFlags(argv);
  if (!flagsR.ok) return flagsR;
  const out: PlanOut = { create: [], warn: [] };
  planSkill(out);
  printPlan(out);
  return applySkill(flagsR.value);
}

function parseSkillFlags(argv: readonly string[]): Result<SkillFlags, string> {
  const flags: { -readonly [K in keyof SkillFlags]: SkillFlags[K] } = {
    force: false,
    dryRun: false,
  };
  for (const a of argv) {
    const r = parseOne(a, flags);
    if (!r.ok) return r;
  }
  return { ok: true, value: flags };
}

type SkillFlagsMut = { -readonly [K in keyof SkillFlags]: SkillFlags[K] };

function parseOne(
  flag: string,
  flags: SkillFlagsMut,
): Result<SkillFlags, string> {
  return match(flag)
    .with("--force", () => okMut(flags, "force"))
    .with("--dry-run", () => okMut(flags, "dryRun"))
    .with("--help", (): Result<SkillFlags, string> => {
      printSkillHelp();
      process.exit(0);
      return { ok: true, value: flags };
    })
    .with(P.string, (f) => ({
      ok: false as const,
      error: `unknown flag: ${f}`,
    }))
    .exhaustive();
}

function okMut<K extends keyof SkillFlags>(
  flags: SkillFlagsMut,
  key: K,
): Result<SkillFlags, string> {
  flags[key] = true as SkillFlags[K];
  return { ok: true, value: flags };
}

function printPlan(out: PlanOut): void {
  process.stdout.write("\n[plan] create:\n");
  if (out.create.length === 0) process.stdout.write("  (none)\n");
  for (const f of out.create) process.stdout.write(`  + ${f}\n`);
  process.stdout.write("[plan] warn:\n");
  if (out.warn.length === 0) process.stdout.write("  (none)\n");
  for (const w of out.warn) process.stdout.write(`  ! ${w}\n`);
  process.stdout.write("\n");
}

function printSkillHelp(): void {
  process.stdout.write(
    [
      "sadist skill - install the sadist skill file into the current project",
      "",
      "usage: sadist skill [flags]",
      "",
      "flags:",
      "  --force        overwrite existing skill file without prompting",
      "  --dry-run      print plan without applying changes",
      "  --help         show this help",
      "",
    ].join("\n"),
  );
}
