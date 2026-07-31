export type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function ok<T>(value: T): { ok: true; value: T } {
  return { ok: true, value };
}

export function err<E>(error: E): { ok: false; error: E } {
  return { ok: false, error };
}

export type Option<T> = { some: true; value: T } | { some: false };

export type PkgManager = "pnpm" | "yarn" | "npm";

export type InstallFlags = {
  readonly noHusky: boolean;
  readonly noTsconfig: boolean;
  readonly force: boolean;
  readonly dryRun: boolean;
};

export type PkgJson = {
  readonly name: string;
  readonly version: string;
  readonly type: Option<string>;
  readonly scripts: Readonly<Record<string, string>>;
  readonly dependencies: Readonly<Record<string, string>>;
  readonly devDependencies: Readonly<Record<string, string>>;
  readonly root: Readonly<Record<string, unknown>>;
};

export type DepClass = "dev" | "prod";

export type MissingDep = {
  readonly name: string;
  readonly class: DepClass;
  readonly range: string;
};

export type InstallPlan = {
  readonly pkgManager: PkgManager;
  readonly missing: readonly MissingDep[];
  readonly willCreate: readonly string[];
  readonly willWarn: readonly string[];
};

export type SkillFlags = {
  readonly force: boolean;
  readonly dryRun: boolean;
};
