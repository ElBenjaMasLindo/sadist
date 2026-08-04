# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Added `gate:full` script (`<pkgManager> run gate && <pkgManager> run build`) and `.husky/pre-push` hook.
- `sadist install`: CLI now automatically configures `package.json#scripts.gate:full` and `.husky/pre-push` alongside `gate` and `pre-commit` for all installed projects.

### Changed
- Relicensed project from MPL-2.0 to MIT.
- Updated `.husky/pre-commit` to execute `pnpm run gate`.

## [0.5.3] - 2026-07-31

### Fixed
- `sadist install`: move `applySkill` step before `applyHusky` so the skill is always installed even when husky setup fails due to a missing `.git` repository.

## [0.5.2] - 2026-07-31

### Removed
- `.npmrc`: removed redundant `public-hoist-pattern` config to avoid npm unknown config warnings during publish.

## [0.5.1] - 2026-07-31

### Fixed
- Skill template loading: embed `docs/SKILL.md` in memory at build time via `scripts/version.mjs` instead of reading from disk via relative paths at runtime, preventing `cannot read shipped skill` failures in npm-installed environments.
- Package publish script: updated `prepublishOnly` in `package.json` to use `npm run build` instead of `pnpm run build`.

## [0.5.0] - 2026-07-31

### Changed
- Renamed pre-commit script from `lax` to `gate` (breaking: consumers must rename `scripts.lax` to `scripts.gate` in their `package.json`).

## [0.4.0] - 2026-07-31

### Added
- `scripts/version.mjs`: now also syncs `package.json#version` into the `metadata.version` field of `docs/SKILL.md` during `prebuild`, keeping the published skill version in lockstep with the package.
- `sadist skill` subcommand: installs or updates `.agents/skills/sadist/SKILL.md` from the version shipped with the package. Compares the existing file's `metadata.version` with the package version: skip when up to date, prompt `[y/N]` on downgrade/upgrade, or overwrite with `--force`. Skips silently when stdin is not a TTY.
- `sadist install`: now also copies the skill file to `.agents/skills/sadist/SKILL.md` as part of the install flow, with the same version/prompt behavior. Use `sadist skill` to install the skill standalone.

### Changed
- `docs/SKILL.md`: now uses YAML frontmatter (`name`, `description`, `compatibility`, `license`, `metadata.version`) so the published skill file is self-describing and version-stamped.

## [0.3.0] - 2026-07-30

### Added
- `AGENTS.md` with project maintenance guidelines (releases, code, rules, build, design philosophy).
- `require-ts-pattern-exhaustive` rule: enforces `.exhaustive()` as the terminal call on `ts-pattern` chains. Catches both `.otherwise()` and chains with no terminal call.
- `no-ts-suppressions` rule: flags `as unknown as X` double casts only. `@ts-ignore` and `@ts-expect-error` are delegated to `@typescript-eslint/ban-ts-comment`.
- `_shared/sadist-exception.ts` utility: `sadist-exception:` comment check, requiring a real ticket format (`SADIST-123` or `#456`).
- `_shared/ast-walk.ts` utility: generic AST walker providing `countTypeReferences` and `containsPrimitiveKeyword` for rule code.
- `scripts/version.mjs`: pre-build script that reads `package.json#version` and writes `src/cli/version.ts`, replacing the hardcoded version in the CLI.

### Changed
- `README.md` restructured: added Quickstart (CLI) section, Manual Setup with numbered steps, and updated rules table.
- `no-null-in-domain-types`: now fires on any `null`/`undefined` keyword, not just inside named type aliases/interfaces. Inline `string | null` in function signatures is now caught.
- `no-primitive-obsession`: detects `id`, `user_id`, and `userID` (not just `userId`), and searches recursively inside `Option<T>` / `T[]` wrappers.
- `no-single-use-generics`: counts `TSTypeReference` via AST walk instead of regex on source text. Threshold lowered from `<= 2` to `<= 1`.
- `no-throw-outside-adapters`: removed inline `filename.includes("/adapters/")` check; the domain/adapters boundary now lives in config.
- `src/config/strict.ts`: domain/adapters boundary enforced by ESLint `files`/`ignores` globs, not by inline path checks inside each rule. Uses `@typescript-eslint/eslint-plugin` rules (`no-explicit-any`, `no-non-null-assertion`, `ban-ts-comment`) and `no-restricted-syntax` with `ClassDeclaration`/`ClassExpression` selectors, replacing the deleted custom rules.
- `src/rules/index.ts`: now exports 6 rules (`no-throw-outside-adapters`, `no-null-in-domain-types`, `no-single-use-generics`, `no-primitive-obsession`, `require-ts-pattern-exhaustive`, `no-ts-suppressions`).
- `src/cli/install.ts`: `computeMissing` reads the sadist version from `src/cli/version.ts` (generated at build time) instead of hardcoding `"0.1.0"`. Adds `@typescript-eslint/eslint-plugin` to the dev dependencies installed for the consumer.
- `package.json`: added `@typescript-eslint/eslint-plugin` (8.48.1) as a `dependency` so the config's plugin import resolves at consumer load time. Added `prebuild` script.
- `docs/SKILL.md`: removed the "Gate coverage" section; rule coverage is now visible directly in `src/config/strict.ts`.
- Tests updated to reflect new behavior: `no-primitive-obsession` (branded type via alias instead of inline intersection), `no-throw-outside-adapters` (filename exemption moved to config). New tests  added for `require-ts-pattern-exhaustive` and `no-ts-suppressions`.

## [0.2.0] - 2026-07-30

### Added
- `sadist install` CLI command for project onboarding (`sadist` / `npx sadist install`).
- CLI flags: `--dry-run`, `--force`, `--no-husky`, `--no-tsconfig`.
- Package manager detection (`pnpm`, `yarn`, `npm`).
- Automated configuration setup (`eslint.config.mjs`, `tsconfig.json`, `.husky/pre-commit`, `.gitignore`, `package.json#scripts.lax`).
- `prepublishOnly` script to ensure clean builds before publishing.

### Changed
- Project tagline updated to "A sadistic TypeScript gate that holds your commit hostage until the code is no longer a liability" across `README.md`, `package.json#description`, and CLI usage output. Added `gate` keyword to `package.json`.

## [0.1.0] - 2026-07-30

### Added
- Initial release: 4 architectural ESLint rules
  - `no-any-in-domain-types`
  - `no-null-in-domain-types`
  - `no-primitive-obsession`
  - `no-throw-outside-adapters`
- Strict ESLint config (`sadist/config/strict`)
- Pre-commit gate integration (build + lint + test)
- Example project (`examples/minimal-project`)
- CI workflow (GitHub Actions)


[Unreleased]: https://github.com/ElBenjaMasLindo/sadist/compare/v0.5.3...HEAD
[0.5.3]: https://github.com/ElBenjaMasLindo/sadist/compare/v0.5.2...v0.5.3
[0.5.2]: https://github.com/ElBenjaMasLindo/sadist/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/ElBenjaMasLindo/sadist/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/ElBenjaMasLindo/sadist/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/ElBenjaMasLindo/sadist/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/ElBenjaMasLindo/sadist/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/ElBenjaMasLindo/sadist/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/ElBenjaMasLindo/sadist/releases/tag/v0.1.0

