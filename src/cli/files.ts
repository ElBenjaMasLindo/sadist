import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { type Option, type PkgJson, type Result, ok } from "./types.js";

export function pathExists(rel: string): boolean {
  return existsSync(resolve(process.cwd(), rel));
}

export function readText(rel: string): Result<string, string> {
  try {
    const content = readFileSync(resolve(process.cwd(), rel), "utf8");
    return { ok: true, value: content };
  } catch (e) {
    return { ok: false, error: `cannot read ${rel}: ${String(e)}` };
  }
}

export function writeText(
  rel: string,
  content: string,
  mode?: number,
): Result<string, string> {
  try {
    const fullPath = resolve(process.cwd(), rel);
    mkdirSync(dirname(fullPath), { recursive: true });
    if (typeof mode === "number") {
      writeFileSync(fullPath, content, { encoding: "utf8", mode });
    } else {
      writeFileSync(fullPath, content, "utf8");
    }
    return { ok: true, value: rel };
  } catch (e) {
    return { ok: false, error: `cannot write ${rel}: ${String(e)}` };
  }
}

export function readPkg(): Result<PkgJson, string> {
  const raw = readText("package.json");
  if (!raw.ok) return raw;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw.value);
  } catch (e) {
    return { ok: false, error: `package.json is not valid JSON: ${String(e)}` };
  }
  return coercePkg(parsed);
}

export function coercePkg(value: unknown): Result<PkgJson, string> {
  if (typeof value !== "object" || value === null) {
    return { ok: false, error: "package.json root must be an object" };
  }
  const v = value as Record<string, unknown>;
  const name = requireString(v, "name");
  if (!name.ok) return name;
  const version = requireString(v, "version");
  if (!version.ok) return version;
  const scripts = requireObject(v, "scripts");
  if (!scripts.ok) return scripts;
  return ok(buildPkg({ root: v, name: name.value, version: version.value, scripts: scripts.value }));
}

export type PkgSeed = {
  root: Record<string, unknown>;
  name: string;
  version: string;
  scripts: Record<string, unknown>;
};

function buildPkg(seed: PkgSeed): PkgJson {
  return {
    name: seed.name,
    version: seed.version,
    type: optString(seed.root["type"]),
    scripts: stringRecord(seed.scripts),
    dependencies: stringRecord(seed.root["dependencies"] ?? {}),
    devDependencies: stringRecord(seed.root["devDependencies"] ?? {}),
    root: seed.root,
  };
}

export function requireString(
  v: Record<string, unknown>,
  key: string,
): Result<string, string> {
  if (typeof v[key] !== "string") {
    return { ok: false, error: `package.json missing string '${key}'` };
  }
  return { ok: true, value: v[key] as string };
}

export function requireObject(
  v: Record<string, unknown>,
  key: string,
): Result<Record<string, unknown>, string> {
  const val = v[key];
  if (typeof val !== "object" || val === null) {
    return { ok: false, error: `package.json missing '${key}' object` };
  }
  return { ok: true, value: val as Record<string, unknown> };
}

export function optString(v: unknown): Option<string> {
  return typeof v === "string" ? { some: true, value: v } : { some: false };
}

export function stringRecord(v: unknown): Record<string, string> {
  if (typeof v !== "object" || v === null) return {};
  const out: Record<string, string> = {};
  for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
    if (typeof val === "string") out[k] = val;
  }
  return out;
}

export function hasDep(
  pkg: PkgJson,
  name: string,
): boolean {
  return name in pkg.dependencies || name in pkg.devDependencies;
}
