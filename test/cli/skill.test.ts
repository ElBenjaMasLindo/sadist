import { describe, expect, it } from "vitest";
import { applySkill, extractVersion } from "../../src/cli/skill.js";

describe("extractVersion", () => {
  it("parses version from frontmatter", () => {
    const r = extractVersion('---\nmetadata:\n  version: "0.3.0"\n---\nbody');
    expect(r.some).toBe(true);
    if (r.some) expect(r.value).toBe("0.3.0");
  });

  it("returns none when version line missing", () => {
    const r = extractVersion('---\nname: foo\n---\nbody');
    expect(r.some).toBe(false);
  });

  it("returns none when metadata block missing", () => {
    const r = extractVersion("# heading\nbody");
    expect(r.some).toBe(false);
  });
});

describe("applySkill (dry-run)", () => {
  it("returns dry-run without touching the filesystem", () => {
    const r = applySkill({ force: false, dryRun: true });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe("dry-run");
  });
});
