# Contributing

Any pull request that adds a new rule must do one of the following in its description:
- Remove or merge an existing rule to keep the total count stable, or
- Explicitly justify why the total number of rules should grow this time.

Rules must fit in one line inside `docs/SKILL.md`. If your rule needs more
than one paragraph to explain, it's not ready.

Run before opening a PR:
```bash
npm run build && npm run lint && npm test
```
