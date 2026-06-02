<div align="center">

# Discord.js v14 Hybrid Template Bot

**A production-ready Discord bot template with hybrid commands, configurable message formats, and comprehensive event handling.**

[![Discord.js](https://img.shields.io/badge/discord.js-v14.25.1-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org)
[![Node.js](https://img.shields.io/badge/node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-v9-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue?style=for-the-badge)](LICENSE)

[Features](#-features) · [Setup](#-quick-start) · [Commands](#-commands) · [Structure](#-project-structure) · [Contributing](#-contributing)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Hybrid Commands** | Single command file handles both `!ping` prefix and `/ping` slash commands |
| **3 Message Formats** | Per-guild configurable output: Embeds, Components V2, or Message (plain text) |
| **33 Commands** | Across 5 categories — info, config, moderation, utility, and dev |
| **21 Event Handlers** | Guild, member, voice, moderation, message, automod, channel, and role events |
| **MongoDB Integration** | Unified guild schema for prefix, message type, logging, welcome/farewell, autorole |
| **Custom Emoji System** | Config-driven custom emojis with automatic unicode fallbacks |
| **Warning System** | Database-backed member warnings with moderator tracking |
| **Snipe System** | Recovers last deleted message per channel |
| **Pagination** | Button-based page navigation for list commands |
| **Message Builder** | Utility to generate all 3 formats from a single builder chain |
| **Anti-Crash Handlers** | Process-level error catching with logger integration |
| **Rotating Presence** | Dynamic bot status cycling on startup |

### Message Format Preview

The bot supports **3 output formats** configurable per guild via `/messagetype`:

| Embed (default) | Components V2 | Plain Text |
|:---:|:---:|:---:|
| Traditional rich embeds | Modern V2 containers with accent colors | Formatted text with backtick emojis |

---

## 📋 Requirements

| Dependency | Version | Link |
|------------|---------|------|
| Node.js | `>= 18` | [nodejs.org](https://nodejs.org/) |
| MongoDB | Any | [mongodb.com](https://www.mongodb.com/) |
| Discord Bot Token | — | [Developer Portal](https://discord.com/developers/applications) |

---

## 🚀 Quick Start

**1. Clone & install**
```bash
git clone https://github.com/CharlesNaig/Discord.js-v14-Hybrid-Template-Bot.git
cd Discord.js-v14-Hybrid-Template-Bot
pnpm install
```

**2. Configure environment**

Create a `.env` file in the project root:
```env
# Required
TOKEN=your_bot_token
CLIENT_ID=your_client_id
OWNER_ID=your_discord_id
MONGO_URL=your_mongodb_connection_string

# Optional
PREFIX=!
GUILD_ID=your_dev_guild_id
PRODUCTION=false
REGISTER_COMMANDS=false
DEFAULT_MESSAGE_TYPE=embed
DEFAULT_COLOR=#5865F2
SUPPORT_SERVER=https://discord.gg/your_invite
INVITE_LINK=https://discord.com/oauth2/authorize?client_id=YOUR_ID&permissions=8&scope=bot%20applications.commands
```

> **`PRODUCTION`** — Set to `true` to register slash commands globally. Set to `false` to register to `GUILD_ID` only (faster for development).
> **`REGISTER_COMMANDS`** — Leave this as `false` for normal bot startup. Set it to `true` only when you want to push slash command changes to Discord.

**3. Start the bot**
```bash
pnpm start       # Production
pnpm dev         # Development (nodemon)
```

---

## 🤖 Commands

### 📌 Info

| Command | Aliases | Description | Permissions |
|---------|---------|-------------|-------------|
| `ping` | `pong`, `latency` | Bot and API latency | — |
| `about` | `info`, `botinfo` | Bot information and links | — |
| `help` | `h`, `commands` | Command list or specific command details | — |
| `stats` | `status`, `statistics` | Bot statistics and system info | — |

### ⚙️ Config

| Command | Aliases | Description | Permissions |
|---------|---------|-------------|-------------|
| `prefix` | — | Change the server prefix | `ManageGuild` |
| `messagetype` | `msgtype`, `mt` | Set message format per guild | `ManageGuild` |
| `setlog` | `log`, `logging` | Configure logging channel | `ManageGuild` |
| `setwelcome` | `welcome` | Configure welcome messages | `ManageGuild` |
| `setfarewell` | `farewell`, `goodbye` | Configure farewell messages | `ManageGuild` |

### 🛡️ Moderation

| Command | Aliases | Description | Permissions |
|---------|---------|-------------|-------------|
| `ban` | `banish` | Ban a member with reason & DM | `BanMembers` |
| `kick` | `boot` | Kick a member with reason | `KickMembers` |
| `timeout` | `mute`, `to` | Timeout a member (10s–28d) | `ModerateMembers` |
| `purge` | `clear`, `prune` | Bulk delete messages (1–100) | `ManageMessages` |
| `slowmode` | `slow` | Set channel slowmode | `ManageChannels` |
| `lock` | `lockchannel` | Lock or unlock a channel | `ManageChannels` |
| `warn` | — | Warn a member (saved to DB) | `ModerateMembers` |
| `warnings` | `warns`, `infractions` | View a member's warnings | `ModerateMembers` |

### 🔧 Utility

| Command | Aliases | Description | Permissions |
|---------|---------|-------------|-------------|
| `avatar` | `av`, `pfp` | Display user avatar (global + server) | — |
| `userinfo` | `ui`, `whois` | Detailed user information | — |
| `serverinfo` | `si`, `guild` | Full server statistics | — |
| `roleinfo` | `ri`, `role` | Role details and permissions | — |
| `channelinfo` | `ci`, `channel` | Channel details and properties | — |
| `membercount` | `mc`, `members` | Member count with status breakdown | — |
| `invite` | `inv` | Bot invite and support links | — |
| `uptime` | `up` | Bot uptime since last restart | — |
| `snipe` | `s` | Last deleted message in channel | `ManageMessages` |
| `poll` | `vote` | Create a reaction poll (✅/❌) | `ManageMessages` |

### 🔒 Developer

| Command | Aliases | Description | Permissions |
|---------|---------|-------------|-------------|
| `eval` | `e` | Evaluate JavaScript code | Owner only |
| `reload` | `rl` | Reload all commands | Owner only |
| `leaveguild` | `lg` | Leave a guild by ID | Owner only |
| `guilds` | `servers` | List all guilds the bot is in | Owner only |
| `emit` | — | Emit a client event for testing | Owner only |
| `shutdown` | `die`, `stop` | Gracefully shut down the bot | Owner only |

---

## 📡 Event Handlers

| Category | Events | Description |
|----------|--------|-------------|
| **Client** | `ready`, `interactionCreate`, `messageCreate` | Core bot functionality |
| **Guild** | `guildCreate`, `guildDelete`, `guildUpdate` | Server join/leave/update tracking |
| **Member** | `guildMemberAdd`, `guildMemberRemove`, `guildMemberUpdate` | Welcome, farewell, autorole, role/nickname changes |
| **Voice** | `voiceStateUpdate` | Join/leave/move/mute/deafen logging |
| **Moderation** | `guildBanAdd`, `guildBanRemove` | Ban/unban logging with audit log lookup |
| **Message** | `messageDelete`, `messageUpdate` | Snipe storage, edit/delete logging |
| **AutoMod** | `autoModerationActionExecution` | AutoMod action logging |
| **Channel** | `channelCreate`, `channelDelete`, `channelUpdate` | Channel change logging |
| **Role** | `roleCreate`, `roleDelete`, `roleUpdate` | Role change logging |

---

## 📁 Project Structure

```
src/
├── commands/                   # 33 hybrid commands
│   ├── config/                 # Prefix, MessageType, SetLog, SetWelcome, SetFarewell
│   ├── dev/                    # Eval, Reload, LeaveGuild, Guilds, Emit, Shutdown
│   ├── info/                   # Ping, About, Help, Stats
│   ├── moderation/             # Ban, Kick, Timeout, Purge, Slowmode, Lock, Warn, Warnings
│   └── utility/                # Avatar, UserInfo, ServerInfo, RoleInfo, ChannelInfo, etc.
│
├── events/                     # 21 event handlers
│   ├── AutoMod/                # AutoModAction
│   ├── Channel/                # ChannelCreate, ChannelDelete, ChannelUpdate
│   ├── Client/                 # InteractionCreate, MessageCreate, ready
│   ├── Guild/                  # GuildCreate, GuildDelete, GuildUpdate
│   ├── Member/                 # GuildMemberAdd, GuildMemberRemove, GuildMemberUpdate
│   ├── Message/                # MessageDelete, MessageUpdate
│   ├── Moderation/             # GuildBanAdd, GuildBanRemove
│   ├── Role/                   # RoleCreate, RoleDelete, RoleUpdate
│   └── Voice/                  # VoiceStateUpdate
│
├── schemas/                    # MongoDB models
│   ├── Guild.js                # Unified guild settings
│   └── Warning.js              # Member warnings
│
├── structures/                 # Core classes
│   ├── Client.js               # Extended Discord Client (15 intents, 7 partials)
│   ├── Command.js              # Command base class
│   ├── ComponentHandler.js     # Button/SelectMenu/Modal handler base
│   ├── Context.js              # Unified context wrapper with 3-format routing
│   ├── Event.js                # Event base class
│   └── Logger.js               # Signale-based logger
│
├── utils/                      # Utility modules
│   ├── emoji.js                # getEmoji() + StatusEmojis
│   ├── formatters.js           # formatUptime, formatBytes, truncate, timestamp
│   ├── messageBuilder.js       # Build all 3 message formats at once
│   ├── pagination.js           # Button-based paginator
│   └── resolveColor.js         # Hex/number to decimal color
│
├── config.js                   # Colors, emojis, links configuration
└── index.js                    # Entry point
```

---

## 🛠️ Customization

### Custom Emojis

Replace `EMOJI_ID` placeholders in `src/config.js` with your actual emoji IDs. The bot uses `getEmoji()` which automatically falls back to unicode emojis when custom emojis aren't configured:

```js
// src/config.js
emojis: {
    success: "<:success:123456789>",  // Replace with your emoji ID
    error: "<:error:123456789>",
    // ...
}
```

### Colors

Customize embed and V2 accent colors in `src/config.js`:

```js
color: {
    default: "#5865F2",  // Discord Blurple
    error: "#ED4245",    // Red
    success: "#57F287",  // Green
    // ...
}
```

### Adding a New Command

Create a file in the appropriate `src/commands/{category}/` directory:

```js
import Command from "../../structures/Command.js";

export default class MyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mycommand',
            description: { content: 'Description', usage: '<arg>', examples: ['mycommand test'] },
            category: 'utility',
            cooldown: 3,
            permissions: { dev: false, client: ['SendMessages'], user: [] },
            slashCommand: true,
            options: [
                { name: "input", description: "Your input", type: 3, required: true },
            ],
        });
    }

    async run(ctx, args) {
        const input = ctx.isInteraction
            ? ctx.interaction.options.getString('input')
            : args.join(' ');

        // Use ctx.sendTypedMessage() for automatic 3-format routing
        return ctx.sendTypedMessage({
            embed: this.client.embed().setColor(this.client.color.success).setDescription(`Input: ${input}`),
            message: `Input: ${input}`,
        });
    }
}
```

---

## 📦 Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| [discord.js](https://discord.js.org) | `14.25.1` | Discord API library |
| [mongoose](https://mongoosejs.com) | `^9.0.0` | MongoDB ODM |
| [dotenv](https://github.com/motdotla/dotenv) | `^17.0.0` | Environment variables |
| [signale](https://github.com/klaudiosinani/signale) | `^1.4.0` | Console logging |

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/my-feature`)
3. **Commit** with clear messages (`git commit -m "feat: add my feature"`)
4. **Push** to your branch (`git push origin feature/my-feature`)
5. **Open** a Pull Request

Please follow the existing code patterns — hybrid command structure, 3-format output via `ctx.sendTypedMessage()`, and use `Logger` instead of `console.log`.

---

## 📄 License

This project is licensed under the [Apache License 2.0](LICENSE).

---

<div align="center">

Made with ❤️ by [CharlesNaig](https://github.com/CharlesNaig)

⭐ Star this repo if you find it useful!

</div>

