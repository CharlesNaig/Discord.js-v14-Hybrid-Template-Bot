# Project Context

- Project: Discord.js v14 Hybrid Template Bot
- Type: Node.js ES module Discord bot template
- Current task: standardize the Canvas dependency on `@napi-rs/canvas`.
- Status: `@napi-rs/canvas` is declared as `^1.0.7`; pnpm lockfile resolves `1.0.9`.
- Canvas source usage: none currently present in `src/`; future renderers should import from `@napi-rs/canvas`.
- Validation: `pnpm install --frozen-lockfile`, the `@napi-rs/canvas` import/createCanvas smoke test, and `git diff --check` passed.
