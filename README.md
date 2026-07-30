# sadist

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
npm install --save-dev sadist ts-pattern typescript eslint
# or
pnpm add -D sadist ts-pattern typescript eslint
```

Then add to your `eslint.config.mjs`:

```js
import strict from "sadist/config/strict";
export default [...strict];
```

## License

[Mozilla Public License 2.0](https://mozilla.org/MPL/2.0/) — behaves like MIT when you
`npm install` and use it as-is: no copyleft obligation on your code. Only
applies if you modify sadist's own source files. See [LICENSE](LICENSE) for
full terms.
