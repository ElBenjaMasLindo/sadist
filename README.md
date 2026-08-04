# sadist

[![npm version](https://img.shields.io/npm/v/sadist.svg)](https://www.npmjs.com/package/sadist)
[![CI](https://github.com/ElBenjaMasLindo/sadist/actions/workflows/ci.yml/badge.svg)](https://github.com/ElBenjaMasLindo/sadist/actions/workflows/ci.yml)
[![license](https://img.shields.io/github/license/ElBenjaMasLindo/sadist.svg)](LICENSE)

A sadistic TypeScript gate that holds your commit hostage until the code is no longer a liability.

`sadist` combines strict `tsc` compilation, exhaustive pattern matching via `ts-pattern`, and a small set of architectural ESLint rules into a single pre-commit gate. Code either passes all three layers or it doesn't get committed — there is no partial pass, no warning-only mode, no override flag for convenience.

## Why

`any`, silent `null`, unhandled `catch` blocks, and `class` abuse are the most common sources of preventable bugs in TypeScript codebases. This isn't a style linter that nudges; it's a structural gate that refuses to compile or lint code that leaves room for them — see [docs/SKILL.md](docs/SKILL.md) for the complete rule set and honest coverage (this gate does not, and cannot, catch business-logic bugs; only structural ones).

## Install

```bash
npm install --save-dev sadist
# or
pnpm add -D sadist
```

Requires `typescript >=5.4` and `eslint >=9` as peer dependencies (likely already in your project).

## Quickstart (Experimental CLI)

```bash
npx sadist install
# or
pnpm dlx sadist install
```

Flags:

| Flag | Effect |
|------|--------|
| `--no-husky` | Skip pre-commit hook setup |
| `--no-tsconfig` | Skip `tsconfig.json` creation |
| `--force` | Overwrite existing files |
| `--dry-run` | Print the plan, don't apply changes |

Run `sadist --help` for the full list.

`install` also copies the agent skill file into the project

### `sadist skill`

Installs or updates the sadist agent skill file, if you want to handle it separately, Use this to add or refresh the skill without running the full installer.

```bash
npx sadist skill
# or
pnpm dlx sadist skill
```

Flags:

| Flag | Effect |
|------|--------|
| `--force` | Overwrite the existing skill file without prompting |
| `--dry-run` | Print the plan, don't apply changes |
| `--help` | Show help |

If the file exists with a different version, you'll be prompted `Overwrite with vX.Y.Z? [y/N]`. Press `y` to confirm or any other key to skip.

The C.L.I installation process may, in semi-rare cases, fail. If that happens, follow the manual setup below.

## Manual Setup

### 1. ESLint config

Create `eslint.config.mjs`:

```js
import strict from "sadist/config/strict";
export default [...strict];
```

### 2. Gate script

Add a gate script to `package.json`:

```json
{
  "scripts": {
    "gate": "eslint . && tsc --noEmit"
  }
}
```

### 3. Run the gate

```bash
npm run gate
```

If it passes, commit. If it fails, fix the errors first.

## Usage

Example violation of `no-null-in-domain-types`:

```ts
// ❌ Fails the gate
type User = {
  id: string;
  email: string | null;
};
```

Error output:

```
src/user.ts:3:10 - error: No null in domain code. Use Option<T> instead.
```

Fix with `Option<T>`:

```ts
// ✅ Passes the gate
import { Option } from "sadist";

type User = {
  id: string;
  email: Option<string>;
};
```

## API

### Rules

| Rule | What it blocks |
|------|----------------|
| `no-throw-outside-adapters` | `throw` statements outside `src/adapters/` |
| `no-null-in-domain-types` | `null`/`undefined` anywhere in domain code (not just inside named types) |
| `no-single-use-generics` | Generic type parameters used fewer than two places (counted via AST, not text) |
| `no-primitive-obsession` | Raw primitives (`string`, `number`) under ID-named properties; recognizes `id`, `user_id`, `userID`, and nested wrappers like `Option<string>` |
| `require-ts-pattern-exhaustive` | `ts-pattern` chains that end in `.otherwise()` or have no terminal call — must end in `.exhaustive()` |
| `no-ts-suppressions` | `as unknown as X` double casts (with `// sadist-exception: SADIST-123` escape hatch) |
| `@typescript-eslint/no-explicit-any` | `any` type usage |
| `@typescript-eslint/no-non-null-assertion` | `!` non-null assertions |
| `@typescript-eslint/ban-ts-comment` | `@ts-ignore`, `@ts-expect-error` (with `// sadist-exception: SADIST-123` escape hatch) |
| `no-restricted-syntax` | `class` declarations and expressions (with `// sadist-exception: SADIST-123` escape hatch) |
| `complexity` | Cyclomatic complexity > 6 |
| `max-lines-per-function` | Functions > 20 lines |
| `max-params` | Functions > 3 parameters |

### Config

```js
import strict from "sadist/config/strict";
export default [...strict];
```

Enables all rules as errors. No warning-only mode, no partial overrides.

## Versioning

`0.x` — breaking changes allowed in MINOR versions. `1.0.0` means a public API commitment; don't expect it until the rule set is stable.

## Known limitations

- Does not catch business-logic bugs (only structural ones)
- No autofix for architectural violations (by design)
- Assumes `src/adapters/` directory exists for throw statements

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for rules on adding new rules and pre-PR checks.

## License

[MIT](LICENSE) © 2026 ElBenjaMasLindo and contributors

