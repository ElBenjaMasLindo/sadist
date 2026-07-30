import { describe, expect, it } from "vitest";
import { match } from "ts-pattern";
import { ok, err } from "../../src/cli/types.js";

describe("ok", () => {
  it("wraps a value in success", () => {
    const r = ok("hello");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe("hello");
  });
});

describe("err", () => {
  it("wraps an error in failure", () => {
    const r = err("nope");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("nope");
  });
});

describe("ts-pattern on Result", () => {
  it("matches exhaustively", () => {
    const r = ok(42);
    const out = match(r)
      .with({ ok: true }, (v) => `value=${String(v.value)}`)
      .with({ ok: false }, (e) => `error=${e.error}`)
      .exhaustive();
    expect(out).toBe("value=42");
  });
});
