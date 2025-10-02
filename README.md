# Discord.js v14 Hybrid Template Bot

A modern, feature-rich Discord bot template built with Discord.js v14, designed to provide a solid foundation for creating powerful and engaging Discord applications. This template leverages a hybrid command system, combining the flexibility of prefix commands with the efficiency of slash commands, and integrates MongoDB for persistent data storage.

## Features

- **Discord.js v14.22.1:** Utilizes the latest version of the Discord.js library, ensuring access to the newest features and improvements.
- **Hybrid Command System:** Supports both prefix-based and slash commands, offering flexibility for users and developers.
- **MongoDB Integration:** Seamlessly integrates with MongoDB for storing and managing persistent data such as custom prefixes, user settings, and more.
- **Event-Driven Architecture:** Employs an event-driven architecture for efficient and scalable bot behavior.
- **Modular Command Structure:** Organizes commands into separate categories for easy maintenance and scalability.
- **Developer Commands:** Includes powerful developer commands for bot management, debugging, and evaluation.
- **Informative Commands:** Provides users with essential information about the bot, its status, and available commands.
- **Configuration Commands:** Allows administrators to customize bot settings, such as the command prefix.
- **Comprehensive Error Handling:** Implements robust error handling to ensure bot stability and provide informative error messages.
- **Ready-to-use Template:** Designed as a starting point, allowing developers to quickly build and customize their Discord bots.
- **Slash Command Autocompletion:** Enhances user experience with autocompletion for slash commands, guiding users to available options.
- **Context Menus:** Adds functionality with context menu commands, enabling specific actions on messages or users through right-click menus.

## Requirements

- **Node.js v18 or higher:** Ensure you have Node.js version 18 or higher installed. You can download it from [nodejs.org](https://nodejs.org/).
- **MongoDB:** A MongoDB database is required for persistent data storage. You can set up a free MongoDB Atlas cluster at [mongodb.com](https://www.mongodb.com/).

## Setup

1. **Clone the Repository:**
   env
   TOKEN=your_bot_token
   CLIENT_ID=your_client_id
   OWNER_ID=your_discord_id
   MONGO_URL=your_mongodb_url
   PREFIX=!
   - **`ping`:** Check bot latency.
  
  Description: Changes the bot prefix for prefix commands. Requires Manage Guild permission.
  Usage: /prefix <new prefix> or !prefix <new prefix>
  Example: /prefix ? or !prefix ?
  ### Developer Commands

- **`eval <code>`:** Evaluate JavaScript code.
  ## Project Structure


src/
├── commands/          # Command files
│   ├── config/       # Configuration commands
│   │   └── prefix.js # Command to change the bot's prefix
│   ├── dev/          # Developer commands
│   │   ├── eval.js   # Command to evaluate JavaScript code
│   │   ├── leave-guild.js # Command to make the bot leave a guild
│   │   └── reload.js # Command to reload bot commands
│   └── info/         # Information commands
│       ├── about.js  # Command to display information about the bot
│       ├── help.js   # Command to display available commands
│       ├── ping.js   # Command to check the bot's latency
│       └── stats.js  # Command to display bot statistics
├── events/           # Event handlers
│   └── Client/       # Client events
│       ├── interactionCreate.js # Handles interactions such as slash commands and buttons
│       └── ready.js  # Emitted when the bot is ready
├── schemas/          # MongoDB schemas
│   └── Guild.js      # Schema for storing guild-specific settings, like custom prefixes
├── structures/       # Core bot structures
│   ├── Client.js     # Bot client
│   ├── Command.js    # Command structure
│   ├── Context.js    # Context wrapper
│   ├── Event.js      # Event structure
│   └── Logger.js     # Logger utility
├── config.js         # Configuration loader
└── index.js          # Entry point
> **Description of Directories:**
>
> -   `commands/`: Contains all the command files for the bot. Each subdirectory represents a category of commands.
> -   `events/`: Contains event handlers for various Discord events.
> -   `schemas/`: Contains MongoDB schemas for data models.
> -   `structures/`: Contains core bot structures and classes.

## Contributing

We welcome contributions to enhance this template! Here's how you can contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with clear, descriptive messages.
4.  Submit a pull request to the main branch.

> Please ensure your code adheres to the project's coding standards and includes appropriate documentation and tests.

## Code of Conduct

Please review and adhere to our [Code of Conduct](link-to-code-of-conduct.md) to ensure a welcoming and inclusive environment for everyone.

> Replace `link-to-code-of-conduct.md` with a link to your code of conduct file.

## License

This project is licensed under the GPL License. See the [LICENSE](LICENSE) file for details.

## Support

For support, join our Discord server or open an issue on GitHub.

> -   [Discord Support Server](your_discord_invite_link)
> -   [GitHub Issues](your_github_issues_link)
