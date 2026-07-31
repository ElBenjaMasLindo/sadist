import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const pkgPath = resolve(here, "..", "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
const version = pkg.version;
if (typeof version !== "string" || version.length === 0) {
  throw new Error(`scripts/version.mjs: package.json#version missing or empty`);
}
const out = resolve(here, "..", "src", "cli", "version.ts");
writeFileSync(out, `export const VERSION = ${JSON.stringify(version)};\n`);

const skillPath = resolve(here, "..", "docs", "SKILL.md");
const skill = readFileSync(skillPath, "utf-8");
const versionRe = /(?<=metadata:\n)  version: "[^"]*"/;
if (!versionRe.test(skill)) {
  throw new Error(`scripts/version.mjs: version line not found in docs/SKILL.md`);
}
writeFileSync(skillPath, skill.replace(versionRe, `  version: ${JSON.stringify(version)}`));
