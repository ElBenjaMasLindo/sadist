# sadist

A zero-mercy TypeScript gate for LLM-generated code.

`sadist` combines strict `tsc` compilation, exhaustive pattern matching via
`ts-pattern`, and a small set of architectural ESLint rules into a single
pre-commit gate. Code either passes all three layers or it doesn't get
committed — there is no partial pass, no warning-only mode, no override
flag for convenience.

## Why

LLMs default to the statistical mode of TypeScript: `any`, silent `null`,
classes, unhandled `catch` blocks. This isn't a style linter that nudges;
it's a structural gate that refuses to compile or lint code that leaves
room for the bugs that gate is built to eliminate — see
[docs/philosophy.md](docs/philosophy.md) for the reasoning and its
honest limits (this gate does not, and cannot, catch business-logic bugs;
only structural ones).

## Install

```bash
npm install --save-dev sadist ts-pattern typescript eslint
npx sadist init
```

`sadist init` writes `tsconfig.json`, `eslint.config.mjs`, and a Husky
pre-commit hook that runs `tsc --noEmit && eslint .` before every commit.

## For agents

If you're an LLM writing code against this repo, read
[docs/SKILL.md](docs/SKILL.md) first. It's the complete rule set in one
page.

## License

MPL-2.0 — see [LICENSE](LICENSE).
