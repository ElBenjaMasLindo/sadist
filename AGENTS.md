# Releases
- Commits: [Conventional Commits](https://www.conventionalcommits.org/).
- Version in `package.json`. CHANGELOG follows [Keep a Changelog](https://keepachangelog.com/).
- Bump: edit `version` + add `CHANGELOG.md` entry. Move `[Unreleased]` → version header before publish.
- Run `pnpm run build` before release.
- SemVer: `0.x` → breaking in MINOR. `1.0.0` → stable API.

# Code
- Smallest diff. Never touch unrelated code. No new deps without request. Follow `src/` patterns.
- Gate must stay green: husky runs `pnpm run gate` on commit and `pnpm run gate:full` on push. CI runs build + lint + test on push/PR.

# Adding Rules
Per `CONTRIBUTING.md`:
- Keep rule count stable: remove/merge existing or justify growth.
- One paragraph max in `docs/SKILL.md`.
- New rule → tests in `test/rules/` + update `docs/SKILL.md`.

# Build
- `pnpm build` → `tsc -p tsconfig.build.json` (src/ → dist/).
- `prepublishOnly` auto-builds. Never bypass.
- `dist/` in .gitignore, shipped via npm `files`.
- TS: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`. ES2022, NodeNext, ESM.

# Design Philosophy
> "There are two ways of constructing a software design: One way is to make it so simple that there are obviously no deficiencies, and the other way is to make it so complicated that there are no obvious deficiencies. Find solutions so simple that they obviously can't fail."
> "If the solution is clearly superior as a mathematical algorithm, use it."
> "Simplicity is prerequisite for reliability."
> "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away."
> "To ask the right question is already half the solution of a problem."
> "Take as much time as you need; time isn't a problem, but the result is."
