import { describe, expect, it } from "vitest";
import { coercePkg, hasDep, requireString, requireObject, optString, stringRecord } from "../../src/cli/files.js";
import type { PkgJson } from "../../src/cli/types.js";

describe("coercePkg / errors", () => {
  it("non-object root", () => {
    expect(coercePkg("nope").ok).toBe(false);
  });
  it("null root", () => {
    expect(coercePkg(null).ok).toBe(false);
  });
  it("missing name", () => {
    expect(coercePkg({ version: "1.0.0", scripts: {} }).ok).toBe(false);
  });
  it("missing version", () => {
    expect(coercePkg({ name: "x", scripts: {} }).ok).toBe(false);
  });
  it("missing scripts", () => {
    expect(coercePkg({ name: "x", version: "1.0.0" }).ok).toBe(false);
  });
});

describe("coercePkg / success", () => {
  it("full pkg", () => {
    const r = coercePkg({
      name: "x",
      version: "1.0.0",
      scripts: { test: "vitest" },
      dependencies: { foo: "1.0.0" },
      devDependencies: { bar: "2.0.0" },
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.name).toBe("x");
      expect(r.value.version).toBe("1.0.0");
      expect(r.value.scripts).toEqual({ test: "vitest" });
      expect(r.value.dependencies).toEqual({ foo: "1.0.0" });
      expect(r.value.devDependencies).toEqual({ bar: "2.0.0" });
    }
  });
});

const pkg: PkgJson = {
  name: "x",
  version: "1.0.0",
  type: { some: false },
  scripts: {},
  dependencies: { foo: "1.0.0" },
  devDependencies: { bar: "2.0.0" },
  root: {},
};

describe("hasDep", () => {
  it("prod", () => {
    expect(hasDep(pkg, "foo")).toBe(true);
  });
  it("dev", () => {
    expect(hasDep(pkg, "bar")).toBe(true);
  });
  it("missing", () => {
    expect(hasDep(pkg, "baz")).toBe(false);
  });
});

describe("requireString", () => {
  it("error when non-string", () => {
    expect(requireString({ x: 1 }, "x").ok).toBe(false);
  });
  it("ok when string", () => {
    const r = requireString({ x: "hi" }, "x");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe("hi");
  });
});

describe("requireObject", () => {
  it("error when non-object", () => {
    expect(requireObject({ x: "nope" }, "x").ok).toBe(false);
  });
  it("error when null", () => {
    expect(requireObject({ x: null }, "x").ok).toBe(false);
  });
  it("ok when object", () => {
    expect(requireObject({ x: { a: 1 } }, "x").ok).toBe(true);
  });
});

describe("optString", () => {
  it("none for non-string", () => {
    expect(optString(1).some).toBe(false);
  });
  it("some for string", () => {
    const r = optString("hi");
    expect(r.some).toBe(true);
    if (r.some) expect(r.value).toBe("hi");
  });
});

describe("stringRecord", () => {
  it("filters non-strings", () => {
    expect(stringRecord({ a: "x", b: 1, c: "y" })).toEqual({ a: "x", c: "y" });
  });
  it("empty for non-object", () => {
    expect(stringRecord(null)).toEqual({});
    expect(stringRecord("x")).toEqual({});
  });
});
