# Discord.js v14 Hybrid Template Bot

A production-ready Discord bot template built with **Discord.js v14.25.1**, featuring a hybrid command system (prefix + slash), configurable message output formats (embed / Components V2 / plain text), comprehensive event handling, and MongoDB integration.

## Features

- **Discord.js v14.25.1** — Pinned for stability, with native V2 component builders
- **Hybrid Command System** — Single command file handles both `!ping` prefix and `/ping` slash commands
- **3 Message Output Formats** — Per-guild configurable: traditional embeds, Components V2, or plain text
- **22+ Event Handlers** — Guild, member, voice, moderation, message, automod, channel, and role events
- **30+ Commands** — Across 5 categories: info, config, moderation, utility, and dev
- **MongoDB Integration** — Unified guild schema for prefix, message type, logging, welcome/farewell, autorole
- **Custom Emoji System** — Config-driven custom emojis with unicode fallbacks
- **Warning System** — Database-backed member warnings with moderator tracking
- **Snipe System** — Recovers last deleted message per channel
- **Pagination Utility** — Button-based page navigation for lists
- **Message Builder** — Utility to generate all 3 formats from a single builder chain
- **Anti-Crash Handlers** — Process-level error catching with logger integration
- **Rotating Presence** — Dynamic bot status cycling

## Requirements

- **Node.js v18+** — [nodejs.org](https://nodejs.org/)
- **MongoDB** — [mongodb.com](https://www.mongodb.com/)
- **Discord Bot Token** — [Discord Developer Portal](https://discord.com/developers/applications)

## Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/CharlesNaig/Discord.js-v14-Hybrid-Template-Bot.git
   cd Discord.js-v14-Hybrid-Template-Bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   TOKEN=your_bot_token
   CLIENT_ID=your_client_id
   OWNER_ID=your_discord_id
   MONGO_URL=your_mongodb_url
   PREFIX=!
   GUILD_ID=your_dev_guild_id
   PRODUCTION=false
   DEFAULT_MESSAGE_TYPE=embed
   ```

4. **Start the bot:**
   ```bash
   npm start
   ```

## Commands

### Info
| Command | Description |
|---------|-------------|
| `ping` | Check bot and API latency |
| `about` | Bot information and links |
| `help` | Command list or specific command details |
| `stats` | Bot statistics and system info |

### Config
| Command | Description |
|---------|-------------|
| `prefix` | Change the server prefix |
| `messagetype` | Set message format (embed/componentsv2/message) |
| `setlog` | Configure logging channel |
| `setwelcome` | Configure welcome messages |
| `setfarewell` | Configure farewell messages |

### Moderation
| Command | Description |
|---------|-------------|
| `ban` | Ban a member |
| `kick` | Kick a member |
| `timeout` | Timeout a member |
| `purge` | Bulk delete messages |
| `slowmode` | Set channel slowmode |
| `lock` | Lock/unlock a channel |
| `warn` | Warn a member |
| `warnings` | View member warnings |

### Utility
| Command | Description |
|---------|-------------|
| `avatar` | Display user avatar |
| `userinfo` | User information |
| `serverinfo` | Server information |
| `roleinfo` | Role information |
| `channelinfo` | Channel information |
| `membercount` | Member count breakdown |
| `invite` | Bot invite link |
| `uptime` | Bot uptime |
| `snipe` | Last deleted message |
| `poll` | Create a reaction poll |

### Developer
| Command | Description |
|---------|-------------|
| `eval` | Evaluate JavaScript code |
| `reload` | Reload commands |
| `leaveguild` | Leave a guild by ID |
| `guilds` | List all guilds |
| `emit` | Emit test events |
| `shutdown` | Gracefully shut down |

## Project Structure

```
src/
├── commands/
│   ├── config/        # Prefix, MessageType, SetLog, SetWelcome, SetFarewell
│   ├── dev/           # Eval, Reload, LeaveGuild, Guilds, Emit, Shutdown
│   ├── info/          # Ping, About, Help, Stats
│   ├── moderation/    # Ban, Kick, Timeout, Purge, Slowmode, Lock, Warn, Warnings
│   └── utility/       # Avatar, UserInfo, ServerInfo, RoleInfo, ChannelInfo, etc.
├── events/
│   ├── AutoMod/       # AutoModAction
│   ├── Channel/       # ChannelCreate, ChannelDelete, ChannelUpdate
│   ├── Client/        # InteractionCreate, MessageCreate, ready
│   ├── Guild/         # GuildCreate, GuildDelete, GuildUpdate
│   ├── Member/        # GuildMemberAdd, GuildMemberRemove, GuildMemberUpdate
│   ├── Message/       # MessageDelete, MessageUpdate
│   ├── Moderation/    # GuildBanAdd, GuildBanRemove
│   ├── Role/          # RoleCreate, RoleDelete, RoleUpdate
│   └── Voice/         # VoiceStateUpdate
├── schemas/
│   ├── Guild.js       # Unified guild settings
│   └── Warning.js     # Member warnings
├── structures/
│   ├── Client.js      # Extended Discord Client
│   ├── Command.js     # Command base class
│   ├── ComponentHandler.js # Button/SelectMenu/Modal handler
│   ├── Context.js     # Unified context wrapper (3-format routing)
│   ├── Event.js       # Event base class
│   └── Logger.js      # Signale-based logger
├── utils/
│   ├── emoji.js       # getEmoji() + StatusEmojis
│   ├── formatters.js  # formatUptime, formatBytes, truncate, timestamp, etc.
│   ├── messageBuilder.js # MessageBuilder (builds all 3 formats)
│   ├── pagination.js  # Button-based paginator
│   └── resolveColor.js # Hex/number to decimal color
├── config.js          # Configuration (colors, emojis, links)
└── index.js           # Entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit with clear messages
4. Submit a pull request

## License

[GPL License](LICENSE)

