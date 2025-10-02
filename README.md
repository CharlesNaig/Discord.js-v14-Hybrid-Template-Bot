# Discord Bot

A modern Discord bot built with Discord.js v14.22.1, featuring hybrid command support (both prefix and slash commands).

## Features

- ✅ Discord.js v14.22.1
- ✅ Hybrid command system (Prefix + Slash commands)
- ✅ MongoDB integration for persistent data
- ✅ Event-driven architecture
- ✅ Clean command structure
- ✅ Developer commands (eval, reload, etc.)
- ✅ Information commands (ping, stats, about, help)
- ✅ Configuration commands (prefix)
- ✅ Comprehensive error handling

## Requirements

- Node.js v18 or higher
- MongoDB (optional, for prefix customization)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your `.env` file:
   ```env
   TOKEN=your_bot_token
   CLIENT_ID=your_client_id
   OWNER_ID=your_discord_id
   MONGO_URL=your_mongodb_url
   PREFIX=!
   ```

4. Start the bot:
   ```bash
   npm start
   ```

## Commands

### Information Commands
- `ping` - Check bot latency
- `about` - Bot information
- `stats` - Bot statistics
- `help` - Display all commands

### Configuration Commands
- `prefix <new prefix>` - Change the bot prefix (requires Manage Guild permission)

### Developer Commands
- `eval <code>` - Evaluate JavaScript code
- `reload <command>` - Reload a command
- `leave-guild <server id>` - Leave a server

## Project Structure

```
src/
├── commands/          # Command files
│   ├── config/       # Configuration commands
│   ├── dev/          # Developer commands
│   └── info/         # Information commands
├── events/           # Event handlers
│   └── Client/       # Client events
├── schemas/          # MongoDB schemas
├── structures/       # Core bot structures
│   ├── Client.js     # Bot client
│   ├── Command.js    # Command structure
│   ├── Context.js    # Context wrapper
│   ├── Event.js      # Event structure
│   └── Logger.js     # Logger utility
├── config.js         # Configuration loader
└── index.js          # Entry point
```

## License

GPL

## Support

For support, join our Discord server or open an issue on GitHub.
