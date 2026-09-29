# Status rotation recovery — 2026-09-30

## Verified cause

The schema stores status text in `name` and enablement in `enabled`. This template's field names matched, but ready and `/status` duplicated the rotation implementation. Both stored a timer on `global.statusInterval`, applied presence without awaiting/catching API errors, and only initialized from a once-only `clientReady` event. The two copies could diverge and one client could clear another client's timer.

## Change

- Added `src/utils/statusRotation.js` as the shared startup/reload path; `/status` add, remove, edit, toggle, reload, and clear continue to call it.
- Used a per-client timer and a consistent 15-second interval.
- Reapplied rotation on `clientReady` and `shardResume`.
- Validated saved activity types and Twitch/YouTube streaming URLs. Invalid rows are logged/skipped; failed presence updates are logged and retried on later ticks.
- No schema migration or new dependency was needed.

## Validation

Node syntax checks for changed files and `git diff --check` passed. Live Discord Gateway reconnect behavior was not tested.

## Related repositories reviewed

- Filipino-nay: already centralized, schema-aligned, per-client, and has shard-resume reapply.
- Filipino-kuya and TAM AI Discord: no saved bot status rotation found.
- pinoylang-guild-manager: same root issue confirmed (`active`/`text` in ready against `enabled`/`name` schema), plus duplicated global timer and no resume handler.
