# Project Context

- Project: Discord.js v14 Hybrid Template Bot
- Type: Node.js ES module Discord bot template
- Current task: restore saved Discord status rotation at startup and Gateway reconnect.
- Status: startup and status command use shared `src/utils/statusRotation.js`; each client owns one 15-second interval, ready/resume reapplies persisted statuses, invalid saved activities are logged and skipped, and presence failures retry on a later tick.
- Status schema: `name`, `type`, `url`, `status`, and `enabled`; no data migration required.
- Other repositories reviewed: Filipino-nay already has this centralized/resume pattern; Filipino-kuya and TAM AI Discord have no saved rotation; pinoylang-guild-manager has the same schema/query mismatch and global timer defect.
- Validation: Node syntax checks for changed JavaScript files and `git diff --check` passed. Live Discord Gateway behavior remains unverified.
