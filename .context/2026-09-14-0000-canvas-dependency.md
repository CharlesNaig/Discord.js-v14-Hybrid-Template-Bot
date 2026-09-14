# Canvas dependency standardization

## Request

Use `@napi-rs/canvas` as the stable Canvas package instead of the faulty Canvas implementation.

## Change

- Added `@napi-rs/canvas` to `package.json` with the requested range `^1.0.7`.
- Updated `pnpm-lock.yaml`; pnpm resolved the range to `1.0.9`.
- No source migration was required because this checkout has no existing Canvas imports or renderer files.
- Validation passed with `pnpm install --frozen-lockfile`, a `createCanvas(2, 2)` import smoke test, and `git diff --check`.

## Follow-up

- Future Canvas code should import APIs from `@napi-rs/canvas`.
