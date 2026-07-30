# sadist

[![License: MPL-2.0](https://img.shields.io/badge/License-MPL--2.0-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/sadist.svg)](https://www.npmjs.com/package/sadist)
[![CI](https://github.com/ElBenjaMasLindo/sadist/actions/workflows/ci.yml/badge.svg)](https://github.com/ElBenjaMasLindo/sadist/actions/workflows/ci.yml)

A merciless TypeScript code quality gate.

`sadist` combines strict `tsc` compilation, exhaustive pattern matching via
`ts-pattern`, and a small set of architectural ESLint rules into a single
pre-commit gate. Code either passes all three layers or it doesn't get
committed — there is no partial pass, no warning-only mode, no override
flag for convenience.

## Why

`any`, silent `null`, unhandled `catch` blocks, and `class` abuse are the
most common sources of preventable bugs in TypeScript codebases. This isn't
a style linter that nudges; it's a structural gate that refuses to compile
or lint code that leaves room for them — see
[docs/SKILL.md](docs/SKILL.md) for the complete rule set and
honest coverage (this gate does not, and cannot, catch business-logic bugs;
only structural ones).

## Install

```bash
npm install --save-dev sadist
# or
pnpm add -D sadist
```

Requires `typescript >=5.4` and `eslint >=9` as peer dependencies (likely already in your project).

Create `eslint.config.mjs`:

```js
import strict from "sadist/config/strict";
export default [...strict];
```

Add a gate script to `package.json`:

```json
{
  "scripts": {
    "lax": "eslint . && tsc --noEmit"
  }
}
```

Run the gate:

```bash
npm run lax
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
src/user.ts:3:10 - error: Domain types must not contain null or undefined. Use Option<T> instead.
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
| `no-any-in-domain-types` | `any` in type aliases, interfaces, function signatures |
| `no-null-in-domain-types` | `null`/`undefined` in type aliases, interfaces, properties |
| `no-primitive-obsession` | Raw primitives (`string`, `number`, `boolean`) in object properties |
| `no-throw-outside-adapters` | `throw` statements outside `src/adapters/` |

### Config

```js
import strict from "sadist/config/strict";
export default [...strict];
```

Enables all 4 rules as errors. No warning-only mode, no partial overrides.

## Versioning

`0.x` — breaking changes allowed in MINOR versions. `1.0.0` means a public API commitment; don't expect it until the rule set is stable.

## Known limitations

- Does not catch business-logic bugs (only structural ones)
- Requires `ts-pattern` for exhaustive pattern matching (not enforced by rules)
- No autofix for architectural violations (by design)
- Assumes `src/adapters/` directory exists for throw statements

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for rules on adding new rules and pre-PR checks.

## License

[Mozilla Public License 2.0](https://mozilla.org/MPL/2.0/) — behaves like MIT when you
`npm install` and use it as-is: no copyleft obligation on your code. Only
applies if you modify sadist's own source files. See [LICENSE](LICENSE) for
full terms.
