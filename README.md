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
```

Then add to your `eslint.config.mjs`:

```js
import strict from "sadist/config/strict";
export default [...strict];
```

## For agents

If you're generating code programmatically (LLM, codegen, or otherwise),
read [docs/SKILL.md](docs/SKILL.md) first. It's the complete rule set in
one page.

## License

MPL-2.0 — see [LICENSE](LICENSE).
