# Discord.js v14 Hybrid Template Bot - Copilot Instructions

## `📋` Project Overview
This is a **Discord.js v14 Hybrid Command Bot** supporting both **prefix commands** and **slash commands** from a single file. The bot uses MongoDB for persistent storage, event-driven architecture, and modular command structure.

**Repository:** https://github.com/CharlesNaig/Discord.js-v14-Hybrid-Template-Bot

---

## `🏗️` Project Structure

```
src/
├── commands/              # Command files (hybrid: prefix + slash)
│   ├── config/           # Configuration commands
│   │   └── prefix.js     # Change bot prefix
│   ├── dev/              # Developer-only commands
│   │   ├── eval.js       # Evaluate JavaScript code
│   │   ├── leave-guild.js # Leave a guild
│   │   └── reload.js     # Reload commands
│   └── info/             # Information commands
│       ├── about.js      # Bot information
│       ├── help.js       # Command list
│       ├── ping.js       # Latency check
│       └── stats.js      # Bot statistics
├── events/               # Event handlers
│   └── Client/
│       ├── interactionCreate.js  # Handle interactions
│       └── ready.js              # Bot ready event
├── schemas/              # MongoDB schemas
│   └── Guild.js          # Guild settings (custom prefix, etc.)
├── structures/           # Core bot classes
│   ├── Client.js         # Extended Discord Client
│   ├── Command.js        # Command base class
│   ├── Context.js        # Unified context wrapper
│   ├── Event.js          # Event base class
│   └── Logger.js         # Logging utility (ALREADY IMPLEMENTED)
├── config.js             # Configuration loader
└── index.js              # Entry point
```

---

## `⚙️` Core Concepts

### `🔹` Hybrid Commands
- **Single file** handles BOTH prefix commands (`!ping`) and slash commands (`/ping`)
- Commands extend the `Command` class from `src/structures/Command.js`
- Use `Context` wrapper to unify message/interaction handling

### `🔹` Context Wrapper (`src/structures/Context.js`)
Provides unified interface for both command types:
- `context.reply()` - Reply to command
- `context.author` - Command author
- `context.guild` - Guild object
- `context.channel` - Channel object
- `context.isInteraction` - Check if slash command
- `context.deferred` - Check if interaction deferred

### `🔹` Logger (`src/structures/Logger.js`)
**ALREADY IMPLEMENTED** - Use existing logger methods:
- `Logger.info(message)` - General information
- `Logger.success(message)` - Success messages
- `Logger.error(message)` - Error messages
- `Logger.warn(message)` - Warnings
- `Logger.debug(message)` - Debug info

---

## `📝` Command Creation Guidelines

### `✅` Command Template
```javascript
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Command = require('../../structures/Command');

module.exports = class ExampleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'example',
      description: 'Example command description',
      category: 'info', // config, dev, info, moderation, etc.
      aliases: ['ex', 'demo'],
      usage: 'example [option]',
      examples: ['example', 'example test'],
      permissions: {
        user: [PermissionFlagsBits.SendMessages],
        bot: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks]
      },
      ownerOnly: false,
      guildOnly: true,
      cooldown: 3000 // milliseconds
    });
  }

  // Slash command data
  data = new SlashCommandBuilder()
    .setName('example')
    .setDescription('Example command description')
    .addStringOption(option =>
      option.setName('input')
        .setDescription('Your input')
        .setRequired(false)
    );

  // Main execution (works for both prefix and slash)
  async execute(context, args) {
    try {
      // Get option from slash or args from prefix
      const input = context.isInteraction 
        ? context.interaction.options.getString('input')
        : args[0];

      const embed = {
        color: 0x5865F2,
        title: `\`✅\` Success`,
        description: `Input received: ${input || 'None'}`,
        timestamp: new Date(),
        footer: {
          text: `Requested by ${context.author.tag}`,
          icon_url: context.author.displayAvatarURL()
        }
      };

      await context.reply({ embeds: [embed] });
    } catch (error) {
      this.client.logger.error(`Error in example command: ${error.message}`);
      await context.reply({ 
        content: `\`❌\` An error occurred!`,
        ephemeral: true 
      });
    }
  }
};
```

---

## `🎨` Aesthetic Embed Guidelines

### `✅` Proper Emoji Usage in Embeds
```javascript
// ✅ CORRECT: Use backticks with emoji inside
{
  title: `\`✅\` Command Successful`,
  description: `\`🎉\` Welcome! Here are the features:\n\n\`📊\` Statistics\n\`⚙️\` Settings\n\`🔧\` Tools`,
  fields: [
    { name: `\`👤\` User Info`, value: 'Details here', inline: true },
    { name: `\`🌐\` Server`, value: 'Server name', inline: true }
  ]
}

// ❌ WRONG: Raw emoji without backticks
{
  title: "✅ Command Successful", // Don't do this
  description: "🎉 Welcome!" // Don't do this
}
```

const COLORS = {
  PRIMARY: 0x5865F2,   // Discord Blurple
  GOLD: 0xf2e05c,      // Gold/Yellow
  SUCCESS: 0x57F287,   // Green
  WARNING: 0xFEE75C,   // Yellow
  ERROR: 0xED4245,     // Red
  INFO: 0x00A8FC,      // Blue
  DARK: 0x2C2F33,      // Dark gray
  LIGHT: 0xECEFF4      // Light gray
};

// Usage
const embed = {
  color: COLORS.SUCCESS,
  title: `\`✅\` Operation Complete`
};
### `✅` Embed Structure Examples
```javascript
// Information Embed
{
  color: 0x5865F2,
  author: {
    name: 'Bot Name',
    icon_url: client.user.displayAvatarURL()
  },
  title: `\`📊\` Server Statistics`,
  description: `Here's your server information`,
  fields: [
    { name: `\`👥\` Members`, value: `${guild.memberCount}`, inline: true },
    { name: `\`💬\` Channels`, value: `${guild.channels.cache.size}`, inline: true },
    { name: `\`🎭\` Roles`, value: `${guild.roles.cache.size}`, inline: true }
  ],
  thumbnail: { url: guild.iconURL({ dynamic: true }) },
  timestamp: new Date(),
  footer: {
    text: `Requested by ${user.tag}`,
    icon_url: user.displayAvatarURL()
  }
}

// Error Embed
{
  color: 0xED4245,
  title: `\`❌\` Error Occurred`,
  description: `\`⚠️\` ${error.message}`,
  fields: [
    { name: `\`🔍\` Details`, value: 'Error details here' }
  ],
  timestamp: new Date()
}

// Success with Progress
{
  color: 0x57F287,
  title: `\`✅\` Task Complete`,
  description: [
    `\`📝\` **Status:** Completed`,
    `\`⏱️\` **Duration:** 2.5s`,
    `\`📊\` **Progress:** ████████████ 100%`
  ].join('\n'),
  timestamp: new Date()
}
```

### `✅` Message Formatting
```javascript
// Simple text responses
await context.reply(`\`✅\` Command executed successfully!`);
await context.reply(`\`❌\` Permission denied!`);
await context.reply(`\`⏳\` Processing... Please wait.`);

// Multi-line formatting
const message = [
  `\`📋\` **Command List**`,
  ``,
  `\`🔧\` **Utility**`,
  `• \`ping\` - Check bot latency`,
  `• \`stats\` - View statistics`,
  ``,
  `\`⚙️\` **Config**`,
  `• \`prefix\` - Change prefix`
].join('\n');
```

---

## `🎯` Best Practices

### `✅` DO
- Use the **Context wrapper** for unified responses
- Use **Logger** (already implemented) for all logging
- Store **guild-specific data** in MongoDB via schemas
- Add **permission checks** in command options
- Use **ephemeral replies** for error messages
- Add **cooldowns** to prevent spam
- Validate **user input** before processing
- Use **try-catch blocks** for error handling
- Keep commands in **appropriate categories**
- Use **backticks with emojis** (`\`✅\``) for aesthetic messages

### `❌` DON'T
- Don't use `console.log()` - use **Logger** instead
- Don't hardcode **config values** - use `config.js` or `.env`
- Don't forget to handle **both prefix and slash** in execute()
- Don't use raw emojis without backticks in embeds
- Don't create new logging systems - **Logger.js exists**
- Don't repeat code - create **utility functions**
- Don't expose sensitive data in error messages
- Don't forget to check **bot permissions** before actions

---

## `🔍` Debugging Workflow

### `1️⃣` Testing Phase
```javascript
// Use logger for testing
this.client.logger.debug(`Testing command: ${this.name}`);
this.client.logger.debug(`Args received: ${JSON.stringify(args)}`);

// Test both command types
// Prefix: !command arg1 arg2
// Slash: /command option1:value option2:value
```

### `2️⃣` Error Handling
```javascript
try {
  // Command logic
} catch (error) {
  this.client.logger.error(`[${this.name}] ${error.message}`);
  this.client.logger.error(error.stack);
  
  await context.reply({ 
    content: `\`❌\` An error occurred: ${error.message}`,
    ephemeral: true 
  });
}
```

### `3️⃣` Permission Debugging
```javascript
// Check bot permissions
const botPerms = context.channel.permissionsFor(context.guild.members.me);
if (!botPerms.has(PermissionFlagsBits.EmbedLinks)) {
  this.client.logger.warn(`Missing EmbedLinks permission in ${context.guild.name}`);
  return context.reply(`\`⚠️\` I need 'Embed Links' permission!`);
}
```

---

## `📚` Documentation References

### `🔗` Official Resources
- **Discord.js v14 Guide:** https://discordjs.guide/
- **Discord.js Docs:** https://discord.js.org/docs/packages/discord.js/14.16.3
- **Discord API Docs:** https://discord.com/developers/docs/intro
- **MongoDB Docs:** https://www.mongodb.com/docs/manual/

### `🔗` Command Handling
- **Slash Commands:** https://discordjs.guide/slash-commands/
- **Permissions:** https://discordjs.guide/popular-topics/permissions.html
- **Embeds:** https://discordjs.guide/popular-topics/embeds.html
- **Buttons & Menus:** https://discordjs.guide/message-components/

---

## `💡` Planning & Suggestions

### `✅` When User Suggests Bad Ideas
**BE DIRECT. DON'T SUGAR COAT.**

```
❌ BAD IDEA: "Let's store passwords in plain text!"
✅ RESPONSE: "No. That's a security vulnerability. Use bcrypt for hashing."

❌ BAD IDEA: "Let's use eval() for user input!"
✅ RESPONSE: "Absolutely not. eval() with user input is a critical security risk. Use a proper command parser."

❌ BAD IDEA: "Let's fetch data every second!"
✅ RESPONSE: "That will hit rate limits and crash the bot. Use caching with reasonable intervals (30s minimum)."

❌ BAD IDEA: "Let's not validate input!"
✅ RESPONSE: "That will cause crashes. Always validate input before processing."
```

### `✅` Alternative Suggestions
When rejecting an idea, **always provide a better alternative**:

```
❌ User: "Store API keys in the code"
✅ You: "Use environment variables (.env file) instead. Never commit secrets to git."

❌ User: "Use MongoDB for caching"
✅ You: "Use Discord.js Collection or Node-Cache for temporary data. MongoDB is for persistent data only."

❌ User: "Create a separate file for each emoji"
✅ You: "Create a centralized config object or constants file for all emojis."
```

---

## `🔥` Common Issues & Solutions

### `⚠️` Issue: Command Not Found
```javascript
// Solution: Check command registration
this.client.logger.debug(`Loaded commands: ${this.client.commands.map(c => c.name).join(', ')}`);
```

### `⚠️` Issue: Interaction Failed
```javascript
// Solution: Always reply within 3 seconds
await context.interaction.deferReply(); // If processing takes time
// ... long operation ...
await context.interaction.editReply({ content: 'Done!' });
```

### `⚠️` Issue: Permission Errors
```javascript
// Solution: Check both user and bot permissions
if (!context.member.permissions.has(this.permissions.user)) {
  return context.reply(`\`❌\` You lack required permissions!`);
}

const botMember = context.guild.members.me;
if (!botMember.permissions.has(this.permissions.bot)) {
  return context.reply(`\`❌\` I lack required permissions!`);
}
```

---

## `📌` File Location Guide

### `➕` Adding New Command
1. Choose category: `src/commands/{category}/`
2. Create file: `commandname.js`
3. Extend `Command` class
4. Implement `data` (SlashCommandBuilder)
5. Implement `execute(context, args)`

### `➕` Adding New Event
1. Location: `src/events/Client/`
2. Extend `Event` class from `src/structures/Event.js`
3. Set event name and handler

### `➕` Adding Database Schema
1. Location: `src/schemas/`
2. Use Mongoose schema format
3. Export model

### `➕` Adding Utility Function
1. Create: `src/utils/` directory if not exists
2. Export functions for reuse

---

## `🎨` Emoji Reference

### `✅` Status Emojis
- `\`✅\`` - Success
- `\`❌\`` - Error/Failure
- `\`⚠️\`` - Warning
- `\`⏳\`` - Loading/Processing
- `\`🔄\`` - Refresh/Reload
- `\`✨\`` - New/Special

### `📊` Information Emojis
- `\`📊\`` - Statistics
- `\`📝\`` - Details/Notes
- `\`📋\`` - List
- `\`📌\`` - Pin/Important
- `\`🔍\`` - Search
- `\`💡\`` - Tip/Idea

### `⚙️` Configuration Emojis
- `\`⚙️\`` - Settings
- `\`🔧\`` - Tools/Utility
- `\`🛠️\`` - Maintenance
- `\`🔐\`` - Security
- `\`🔑\`` - Access/Key
- `\`🚀\`` - Launch/Start

### `👥` User/Social Emojis
- `\`👤\`` - User
- `\`👥\`` - Users/Members
- `\`🎭\`` - Roles
- `\`💬\`` - Chat/Channel
- `\`🌐\`` - Server/Global
- `\`📢\`` - Announcement

---

## `🚀` Quick Start Checklist

- [ ] Read repository structure
- [ ] Understand Context wrapper usage
- [ ] Use existing Logger.js (DON'T create new logging)
- [ ] Follow hybrid command pattern
- [ ] Use backtick emoji format (`\`emoji\``)
- [ ] Add proper error handling
- [ ] Test both prefix AND slash commands
- [ ] Check permissions before actions
- [ ] Use MongoDB for persistent data only
- [ ] Reference Discord.js v14 documentation

---

# `🎨` Discord Components V2 Integration

## `📋` Overview
The bot now supports **Discord Components V2** for creating modern, visually appealing message layouts using containers, media galleries, text displays, and more.

**Components V2 Repository:** https://github.com/ZarScape/discord.js-v14-v2-template

---

## `🏗️` Components V2 Structure

```
src/
├── slashCommands/
│   └── V2 Components/         # V2 component examples
│       ├── button-1.js        # Primary button examples
│       ├── button-2.js        # Secondary/Link buttons
│       ├── button-3.js        # Advanced button patterns
│       ├── file-components.js # File attachments
│       ├── media-gallery.js   # Image/video carousels
│       ├── menu.js            # Channel select menus
│       ├── section.js         # Section with thumbnails
│       ├── separator.js       # Visual dividers
│       ├── text-display.js    # Markdown text displays
│       └── v2-components.js   # All components example
├── config/
│   └── config.json            # Bot config (colors, emojis)
└── assets/                    # Local images/media
```

---

## `🔧` Components V2 Builders

### `📦` Available Builders
```javascript
const {
  ContainerBuilder,      // Main container wrapper
  TextDisplayBuilder,    // Markdown text displays
  SectionBuilder,        // Text with thumbnails/buttons
  MediaGalleryBuilder,   // Image/video carousels
  MediaGalleryItemBuilder, // Individual gallery items
  SeparatorBuilder,      // Visual dividers
  ButtonBuilder,         // Interactive buttons
  ActionRowBuilder,      // Button/menu rows
  ChannelSelectMenuBuilder, // Channel selection
  FileBuilder,           // File attachments
  MessageFlags          // V2 flag required
} = require('discord.js');
```

---

## `📝` Step-by-Step Conversion: Embed → Components V2

### `1️⃣` Analyze Existing Embed
Identify key components:
- **Title** → TextDisplayBuilder with `#` heading
- **Description** → Multiple TextDisplayBuilder components
- **Fields** → TextDisplayBuilder with formatting
- **Images/Thumbnails** → MediaGalleryBuilder
- **Color** → setAccentColor() on ContainerBuilder
- **Footer** → TextDisplayBuilder at bottom

### `2️⃣` Initialize Container
```javascript
const container = new ContainerBuilder()
  .setAccentColor(0xfe96a0); // Hex to decimal: #fe96a0 → 0xfe96a0
```

### `3️⃣` Add Media (Banner/Images)
```javascript
container.addMediaGalleryComponents(
  new MediaGalleryBuilder().addItems(
    new MediaGalleryItemBuilder().setURL("https://your-image-url.png")
  )
);
```

**Best Practices:**
- Place banners at the top
- Use high-quality images (890x445px recommended)
- Ensure direct image URLs (ending in .png, .jpg, etc.)

### `4️⃣` Add Title/Header
```javascript
container.addTextDisplayComponents(
  new TextDisplayBuilder().setContent("# `📜` Your Title Here")
);
```

**Formatting Options:**
- `#` = Large heading (H1)
- `##` = Medium heading (H2)
- `###` = Small heading (H3)

### `5️⃣` Add Separator (Optional)
```javascript
container.addSeparatorComponents(
  new SeparatorBuilder()
    .setDivider(true)
    .setSpacing(SeparatorSpacingSize.Small)
);
```

**Spacing Options:**
- `SeparatorSpacingSize.Small`
- `SeparatorSpacingSize.Medium`
- `SeparatorSpacingSize.Large`

### `6️⃣` Convert Description & Fields
```javascript
container.addTextDisplayComponents(
  new TextDisplayBuilder().setContent("## **Section Title**"),
  new TextDisplayBuilder().setContent(
    "<:icon:123456789> **Rule 01)** Your rule text here."
  ),
  new TextDisplayBuilder().setContent(
    "<:icon:123456789> **Rule 02)** Another rule here."
  ),
  new TextDisplayBuilder().setContent(
    "<:icon:123456789> **Rule 03)** Final rule in this section."
  )
);
```

**Text Formatting Guidelines:**
- Use custom emojis for bullets: `<:emoji_name:emoji_id>`
- Bold important text: `**text**`
- Add `\u200b` for blank spacing between sections
- Group related content in single `addTextDisplayComponents()` call

### `7️⃣` Handle Multiple Sections
```javascript
container
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent("## **Section 1**"),
    new TextDisplayBuilder().setContent("Content for section 1...")
  )
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent("\u200b"), // Blank space
    new TextDisplayBuilder().setContent("## **Section 2**"),
    new TextDisplayBuilder().setContent("Content for section 2...")
  );
```

### `8️⃣` Add Footer Images/Dividers
```javascript
container.addMediaGalleryComponents(
  new MediaGalleryBuilder().addItems(
    new MediaGalleryItemBuilder().setURL("https://your-divider-image.png")
  )
);
```

### `9️⃣` Send Components V2 Message
```javascript
await channel.send({
  flags: MessageFlags.IsComponentsV2, // REQUIRED
  components: [container],
});
```

**Important Notes:**
- Always include `flags: MessageFlags.IsComponentsV2`
- Multiple containers can be sent in same message
- Regular text content: `content: "Your text"`

### `🔟` Add Navigation Buttons (Optional)
```javascript
const row = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setLabel("Section 1")
      .setStyle(ButtonStyle.Link)
      .setEmoji("123456789")
      .setURL(`https://discord.com/channels/${guildId}/${channelId}/${messageId}`)
  );

await channel.send({
  content: "Quick Navigation:",
  components: [row],
});
```

---

## `🔄` Full Conversion Example

### `❌` Original Embed
```javascript
const embed = new EmbedBuilder()
  .setTitle("📜 Server Rules")
  .setColor("#fe96a0")
  .setImage("https://banner.png")
  .setDescription("Welcome to our server!")
  .addFields(
    { name: "Rule 1", value: "Be respectful" },
    { name: "Rule 2", value: "No spam" }
  );

await channel.send({ embeds: [embed] });
```

### `✅` Converted to Components V2
```javascript
const { 
  ContainerBuilder, 
  TextDisplayBuilder, 
  MediaGalleryBuilder, 
  MediaGalleryItemBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags 
} = require('discord.js');

const container = new ContainerBuilder()
  .setAccentColor(0xfe96a0)
  .addMediaGalleryComponents(
    new MediaGalleryBuilder().addItems(
      new MediaGalleryItemBuilder().setURL("https://banner.png")
    )
  )
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent("# `📜` Server Rules")
  )
  .addSeparatorComponents(
    new SeparatorBuilder()
      .setDivider(true)
      .setSpacing(SeparatorSpacingSize.Small)
  )
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent("Welcome to our server!"),
    new TextDisplayBuilder().setContent("\u200b"),
    new TextDisplayBuilder().setContent("## **Rule 1**"),
    new TextDisplayBuilder().setContent("Be respectful"),
    new TextDisplayBuilder().setContent("\u200b"),
    new TextDisplayBuilder().setContent("## **Rule 2**"),
    new TextDisplayBuilder().setContent("No spam")
  );

await channel.send({
  flags: MessageFlags.IsComponentsV2,
  components: [container],
});
```

---

## `📊` Conversion Mapping Table

| Embed Element | Components V2 Equivalent |
|---------------|-------------------------|
| `setTitle()` | `TextDisplayBuilder` with `#` heading |
| `setDescription()` | Multiple `TextDisplayBuilder` components |
| `setColor()` | `setAccentColor()` (hex to decimal) |
| `setImage()` | `MediaGalleryBuilder` with `MediaGalleryItemBuilder` |
| `addFields()` | Series of `TextDisplayBuilder` components |
| `setFooter()` | `TextDisplayBuilder` at the end |
| `setThumbnail()` | `SectionBuilder` with thumbnail |

---

## `🎨` Components V2 Command Template

```javascript
const { SlashCommandBuilder, MessageFlags, ContainerBuilder, TextDisplayBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('v2example')
    .setDescription('Example V2 component command'),

  async execute(interaction) {
    try {
      const container = new ContainerBuilder()
        .setAccentColor(0x5865F2)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent("# `✅` Example V2 Component"),
          new TextDisplayBuilder().setContent("\u200b"),
          new TextDisplayBuilder().setContent("This is a **V2 component** example!"),
          new TextDisplayBuilder().setContent(`\`👤\` User: ${interaction.user.tag}`),
          new TextDisplayBuilder().setContent(`\`🌐\` Guild: ${interaction.guild.name}`)
        );

      await interaction.reply({
        flags: MessageFlags.IsComponentsV2,
        components: [container],
      });
    } catch (error) {
      console.error(`Error in v2example: ${error.message}`);
      await interaction.reply({ 
        content: `\`❌\` An error occurred!`,
        ephemeral: true 
      });
    }
  }
};
```

---

## `🎯` Components V2 Best Practices

### `✅` DO
- Use `MessageFlags.IsComponentsV2` for all V2 messages
- Group related `TextDisplayBuilder` components together
- Use visual hierarchy with heading sizes (#, ##, ###)
- Add `\u200b` for blank lines between sections
- Use custom emojis for bullets and icons
- Ensure image URLs are direct links
- Test rendering before deployment
- Use consistent accent colors for related sections
- Place banner images at the top
- Convert hex colors to decimal format

### `❌` DON'T
- Don't forget `MessageFlags.IsComponentsV2`
- Don't use raw embed objects with V2 components
- Don't overcrowd containers (keep it readable)
- Don't use broken image URLs
- Don't skip color conversion (hex → decimal)
- Don't ignore visual spacing
- Don't mix V1 and V2 in same message

---

## `🔥` Components V2 Troubleshooting

### `⚠️` Issue: Text appears cluttered
**Solution:** Add more `\u200b` spacing between sections

```javascript
container.addTextDisplayComponents(
  new TextDisplayBuilder().setContent("Section 1"),
  new TextDisplayBuilder().setContent("\u200b"), // Add space
  new TextDisplayBuilder().setContent("Section 2")
);
```

### `⚠️` Issue: Colors don't match
**Solution:** Convert hex colors correctly to decimal

```javascript
// Correct conversion
const hex = "#fe96a0";
const decimal = 0xfe96a0;
container.setAccentColor(decimal);
```

### `⚠️` Issue: Images don't display
**Solution:** Ensure URLs are direct links (end in .png, .jpg, etc.)

```javascript
// ✅ CORRECT
"https://example.com/image.png"

// ❌ WRONG
"https://example.com/image-page"
```

### `⚠️` Issue: Message fails to send
**Solution:** Verify `MessageFlags.IsComponentsV2` is included

```javascript
await channel.send({
  flags: MessageFlags.IsComponentsV2, // Don't forget this!
  components: [container],
});
```

---

## `🚀` Hybrid Bot + Components V2 Integration

### `✅` Using V2 in Hybrid Commands
```javascript
const { SlashCommandBuilder, MessageFlags, ContainerBuilder, TextDisplayBuilder, PermissionFlagsBits } = require('discord.js');
const Command = require('../../structures/Command');

module.exports = class V2ExampleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'v2info',
      description: 'Display info using V2 components',
      category: 'info',
      aliases: ['v2', 'components'],
      usage: 'v2info',
      permissions: {
        bot: [PermissionFlagsBits.SendMessages]
      },
      guildOnly: true
    });
  }

  data = new SlashCommandBuilder()
    .setName('v2info')
    .setDescription('Display information using Components V2');

  async execute(context, args) {
    try {
      // Create V2 container
      const container = new ContainerBuilder()
        .setAccentColor(0x5865F2)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent("# `📊` Server Information"),
          new TextDisplayBuilder().setContent("\u200b"),
          new TextDisplayBuilder().setContent(`\`👥\` **Members:** ${context.guild.memberCount}`),
          new TextDisplayBuilder().setContent(`\`💬\` **Channels:** ${context.guild.channels.cache.size}`),
          new TextDisplayBuilder().setContent(`\`🎭\` **Roles:** ${context.guild.roles.cache.size}`),
          new TextDisplayBuilder().setContent("\u200b"),
          new TextDisplayBuilder().setContent(`\`👤\` Requested by ${context.author.tag}`)
        );

      // Send with V2 flag
      await context.reply({
        flags: MessageFlags.IsComponentsV2,
        components: [container],
      });

      this.client.logger.success(`V2 info sent in ${context.guild.name}`);
    } catch (error) {
      this.client.logger.error(`Error in v2info: ${error.message}`);
      await context.reply({
        content: `\`❌\` Failed to display V2 components!`,
        ephemeral: true
      });
    }
  }
};
```

### `✅` Combining Traditional Embeds with V2
```javascript
async execute(context, args) {
  // Check if user wants V2 format
  const useV2 = context.isInteraction 
    ? context.interaction.options.getBoolean('v2') 
    : args.includes('--v2');

  if (useV2) {
    // Send V2 components
    const container = new ContainerBuilder()
      .setAccentColor(0x5865F2)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("# `✅` V2 Format"),
        new TextDisplayBuilder().setContent("This is a V2 component!")
      );

    return await context.reply({
      flags: MessageFlags.IsComponentsV2,
      components: [container],
    });
  } else {
    // Send traditional embed
    const embed = {
      color: 0x5865F2,
      title: `\`✅\` Traditional Format`,
      description: 'This is a traditional embed!'
    };

    return await context.reply({ embeds: [embed] });
  }
}
```

---

## `🎨` Advanced V2 Patterns

### `✅` Multi-Container Layout
```javascript
// Create multiple containers for complex layouts
const header = new ContainerBuilder()
  .setAccentColor(0x5865F2)
  .addMediaGalleryComponents(
    new MediaGalleryBuilder().addItems(
      new MediaGalleryItemBuilder().setURL("https://banner.png")
    )
  )
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent("# `📋` Main Title")
  );

const content = new ContainerBuilder()
  .setAccentColor(0x57F287)
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent("## `📊` Section 1"),
    new TextDisplayBuilder().setContent("Content here...")
  );

const footer = new ContainerBuilder()
  .setAccentColor(0x2C2F33)
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent(`\`⏰\` Last updated: ${new Date().toLocaleString()}`)
  );

await channel.send({
  flags: MessageFlags.IsComponentsV2,
  components: [header, content, footer],
});
```

### `✅` Interactive V2 with Buttons
```javascript
const container = new ContainerBuilder()
  .setAccentColor(0x5865F2)
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent("# `⚙️` Server Settings"),
    new TextDisplayBuilder().setContent("\u200b"),
    new TextDisplayBuilder().setContent("Choose an option below:")
  );

const row = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('settings_prefix')
      .setLabel('Change Prefix')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('⚙️'),
    new ButtonBuilder()
      .setCustomId('settings_logs')
      .setLabel('Log Channel')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('📝'),
    new ButtonBuilder()
      .setCustomId('settings_reset')
      .setLabel('Reset Config')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('🔄')
  );

await channel.send({
  flags: MessageFlags.IsComponentsV2,
  components: [container, row],
});
```

### `✅` V2 with Section Builder
```javascript
const container = new ContainerBuilder()
  .setAccentColor(0x5865F2);

// Add section with thumbnail
const section = new SectionBuilder()
  .setTitle("User Profile")
  .setDescription("View user information")
  .setThumbnail(user.displayAvatarURL());

container.addSectionComponents(section);

await channel.send({
  flags: MessageFlags.IsComponentsV2,
  components: [container],
});
```

### `✅` Dynamic V2 Content
```javascript
async execute(context, args) {
  const guild = context.guild;
  
  // Build dynamic content
  const container = new ContainerBuilder()
    .setAccentColor(0x5865F2)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent("# `📊` Live Statistics")
    );

  // Add separator
  container.addSeparatorComponents(
    new SeparatorBuilder()
      .setDivider(true)
      .setSpacing(SeparatorSpacingSize.Small)
  );

  // Dynamic stats
  const stats = [
    `\`👥\` **Total Members:** ${guild.memberCount}`,
    `\`🤖\` **Bots:** ${guild.members.cache.filter(m => m.user.bot).size}`,
    `\`🟢\` **Online:** ${guild.members.cache.filter(m => m.presence?.status === 'online').size}`,
    `\`💬\` **Text Channels:** ${guild.channels.cache.filter(c => c.type === 0).size}`,
    `\`🔊\` **Voice Channels:** ${guild.channels.cache.filter(c => c.type === 2).size}`,
  ];

  container.addTextDisplayComponents(
    ...stats.map(stat => new TextDisplayBuilder().setContent(stat))
  );

  await context.reply({
    flags: MessageFlags.IsComponentsV2,
    components: [container],
  });
}
```

---

## `📦` Creating Reusable V2 Components

### `✅` Create Utility File
**Location:** `src/utils/v2Components.js`

```javascript
const {
  ContainerBuilder,
  TextDisplayBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize
} = require('discord.js');

class V2ComponentUtils {
  /**
   * Create a standard header container
   * @param {string} title - Header title
   * @param {string} bannerURL - Optional banner image URL
   * @param {number} color - Accent color in decimal
   */
  static createHeader(title, bannerURL = null, color = 0x5865F2) {
    const container = new ContainerBuilder().setAccentColor(color);

    if (bannerURL) {
      container.addMediaGalleryComponents(
        new MediaGalleryBuilder().addItems(
          new MediaGalleryItemBuilder().setURL(bannerURL)
        )
      );
    }

    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`# ${title}`)
    );

    return container;
  }

  /**
   * Create an info section with fields
   * @param {string} title - Section title
   * @param {Object} fields - Key-value pairs for info
   * @param {number} color - Accent color
   */
  static createInfoSection(title, fields, color = 0x5865F2) {
    const container = new ContainerBuilder().setAccentColor(color);

    const textComponents = [
      new TextDisplayBuilder().setContent(`## **${title}**`),
      new TextDisplayBuilder().setContent("\u200b")
    ];

    for (const [key, value] of Object.entries(fields)) {
      textComponents.push(
        new TextDisplayBuilder().setContent(`\`${key}\` ${value}`)
      );
    }

    container.addTextDisplayComponents(...textComponents);
    return container;
  }

  /**
   * Create an error container
   * @param {string} errorMessage - Error message to display
   */
  static createError(errorMessage) {
    return new ContainerBuilder()
      .setAccentColor(0xED4245)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("# `❌` Error"),
        new TextDisplayBuilder().setContent("\u200b"),
        new TextDisplayBuilder().setContent(`\`⚠️\` ${errorMessage}`)
      );
  }

  /**
   * Create a success container
   * @param {string} message - Success message
   */
  static createSuccess(message) {
    return new ContainerBuilder()
      .setAccentColor(0x57F287)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("# `✅` Success"),
        new TextDisplayBuilder().setContent("\u200b"),
        new TextDisplayBuilder().setContent(message)
      );
  }

  /**
   * Add divider separator
   */
  static createDivider(spacing = SeparatorSpacingSize.Small) {
    return new SeparatorBuilder()
      .setDivider(true)
      .setSpacing(spacing);
  }
}

module.exports = V2ComponentUtils;
```

### `✅` Using V2 Utils in Commands
```javascript
const Command = require('../../structures/Command');
const V2ComponentUtils = require('../../utils/v2Components');
const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = class ServerInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'serverinfo',
      description: 'Display server information',
      category: 'info'
    });
  }

  data = new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Display server information');

  async execute(context, args) {
    try {
      const guild = context.guild;

      // Use utility functions
      const header = V2ComponentUtils.createHeader(
        '`🌐` Server Information',
        guild.iconURL({ size: 1024 }),
        0x5865F2
      );

      const info = V2ComponentUtils.createInfoSection('Details', {
        '`👥` Members:': guild.memberCount.toString(),
        '`💬` Channels:': guild.channels.cache.size.toString(),
        '`🎭` Roles:': guild.roles.cache.size.toString(),
        '`📅` Created:': guild.createdAt.toLocaleDateString()
      }, 0x5865F2);

      await context.reply({
        flags: MessageFlags.IsComponentsV2,
        components: [header, info],
      });

      this.client.logger.success(`Server info displayed for ${guild.name}`);
    } catch (error) {
      this.client.logger.error(`Error in serverinfo: ${error.message}`);
      
      const errorContainer = V2ComponentUtils.createError(
        'Failed to retrieve server information'
      );

      await context.reply({
        flags: MessageFlags.IsComponentsV2,
        components: [errorContainer],
        ephemeral: true
      });
    }
  }
};
```

---

## `🎯` V2 Components Best Practices Summary

### `✅` Design Principles
1. **Visual Hierarchy** - Use heading sizes appropriately (#, ##, ###)
2. **Consistent Colors** - Match accent colors with message context
3. **Proper Spacing** - Use `\u200b` generously between sections
4. **Quality Media** - Use high-resolution images with direct URLs
5. **Grouped Content** - Batch related TextDisplayBuilder components
6. **Error Handling** - Always wrap V2 sends in try-catch blocks
7. **Reusability** - Create utility functions for common patterns
8. **Testing** - Preview components before production deployment

### `✅` Performance Tips
- **Cache Images** - Use consistent image URLs for caching
- **Minimize Containers** - Combine related content when possible
- **Lazy Loading** - Load heavy media only when needed
- **Defer Replies** - Use `deferReply()` for complex V2 builds

### `✅` Accessibility
- **Clear Text** - Use readable fonts and sizes
- **Color Contrast** - Ensure text stands out against backgrounds
- **Alt Text** - Describe media content in adjacent text
- **Mobile-Friendly** - Test on mobile Discord clients

---

## `📞` Final Integration Notes

### `🔗` Combining Hybrid Bot + Components V2
1. **Use Context wrapper** for both traditional embeds and V2
2. **Logger.js** works seamlessly with V2 commands
3. **MongoDB schemas** can store V2 preferences per guild
4. **Permission checks** apply equally to V2 messages
5. **Cooldowns** function identically for V2 commands

### `🔗` Migration Strategy
1. **Phase 1:** Keep existing embed commands working
2. **Phase 2:** Create V2 versions with `--v2` flag option
3. **Phase 3:** Add user/guild preference system
4. **Phase 4:** Gradually default to V2 for new features
5. **Phase 5:** Maintain backwards compatibility

### `🔗` When to Use V2 vs Traditional Embeds
**Use Components V2 for:**
- ✅ Rich visual layouts with banners
- ✅ Multi-section documentation
- ✅ Interactive dashboards
- ✅ Server rules and announcements
- ✅ Complex data displays
- ✅ Image galleries and media

**Use Traditional Embeds for:**
- ✅ Simple information messages
- ✅ Quick error/success responses
- ✅ Logs and notifications
- ✅ Temporary status updates
- ✅ Legacy compatibility
- ✅ Bot-to-bot messages

---

## `🚀` Complete V2 Checklist

- [ ] Import required V2 builders
- [ ] Add `MessageFlags.IsComponentsV2` flag
- [ ] Convert hex colors to decimal
- [ ] Use direct image URLs
- [ ] Add proper spacing with `\u200b`
- [ ] Implement error handling
- [ ] Test on mobile and desktop
- [ ] Create reusable V2 utilities
- [ ] Document custom V2 patterns
- [ ] Update command help text
- [ ] Log V2 usage with Logger.js
- [ ] Test with Context wrapper
- [ ] Verify permissions before sending
- [ ] Consider backwards compatibility

---

## `📚` Additional V2 Resources


### `🔗` Color Palette for V2
```javascript
const V2_COLORS = {
  PRIMARY: 0xf2e05c,    // Discord Blurple
  SUCCESS: 0x57F287,    // Green
  WARNING: 0xFEE75C,    // Yellow
  ERROR: 0xED4245,      // Red
  INFO: 0x00A8FC,       // Blue
  DARK: 0x2C2F33,       // Dark Gray
  LIGHT: 0xECEFF4,      // Light Gray
  PINK: 0xFE96A0,       // Soft Pink
  PURPLE: 0x9B59B6,     // Purple
  ORANGE: 0xE67E22,     // Orange
};
```

---

## `🎓` Learning Path

### `1️⃣` Beginner Level
- [ ] Understand hybrid command structure
- [ ] Use Context wrapper correctly
- [ ] Master Logger.js usage
- [ ] Create basic traditional embeds
- [ ] Handle permissions properly

### `2️⃣` Intermediate Level
- [ ] Convert embeds to V2 components
- [ ] Create multi-container layouts
- [ ] Add interactive buttons with V2
- [ ] Build reusable V2 utilities
- [ ] Implement error handling patterns

### `3️⃣` Advanced Level
- [ ] Design complex V2 dashboards
- [ ] Create dynamic V2 content systems
- [ ] Optimize V2 performance
- [ ] Build hybrid embed/V2 commands
- [ ] Implement guild preferences for V2

---

Interaction Buttons Examples:
```javascript
const row = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setLabel("✅ Primary Action")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setLabel("⚙️ Secondary Action")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setLabel("❌ Danger Action")
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setLabel("🔗 Link Button")
      .setStyle(ButtonStyle.Link)
      .setURL("https://example.com")
  );
```

---

# `🔀` Configurable Message Type System

## `📋` Overview
The bot supports **3 configurable message output formats** per guild. Each guild can set their preferred `messageType` via the `!messagetype` / `/messagetype` command. All commands output in the guild's chosen format automatically.

## `🔧` Message Types

| Type | Config Key | Description |
|------|-----------|-------------|
| **Embed** | `embed` | Traditional Discord embeds (EmbedBuilder) — **default** |
| **Components V2** | `componentsv2` | Modern V2 containers (ContainerBuilder, TextDisplayBuilder, etc.) |
| **Message** | `message` | Plain formatted text with backtick emojis (`🔴`), bold, code blocks |

## `⚙️` Config Property
```javascript
// In src/config.js
defaultMessageType: process.env.DEFAULT_MESSAGE_TYPE || "embed",
messageTypes: ["embed", "componentsv2", "message"],
```

## `💾` Guild Schema Storage
```javascript
// In src/schemas/Guild.js
messageType: { 
    type: String, 
    enum: ['embed', 'componentsv2', 'message'], 
    default: 'embed' 
},
```

## `📝` Context Methods

### `ctx.getMessageType()`
Returns the guild's preferred message type string.
```javascript
const type = await ctx.getMessageType(); // "embed" | "componentsv2" | "message"
```

### `ctx.sendTypedMessage({ embed, componentsv2, message })`
**PRIMARY method for command responses.** Automatically routes to the correct format based on guild preference. Falls back gracefully if a format isn't provided.
```javascript
await ctx.sendTypedMessage({
    embed: myEmbed,              // EmbedBuilder instance
    componentsv2: [myContainer], // Array of ContainerBuilder instances
    message: "Plain text here",  // Formatted string with backtick emojis
});
```

### `ctx.editTypedMessage({ embed, componentsv2, message })`
Same as above, but edits the existing message.

## `✅` Command Template (3-Format Output)
```javascript
async run(ctx, args) {
    // Build all 3 formats
    const embed = this.client.embed()
        .setColor(this.client.color.success)
        .setTitle(`\`✅\` Pong!`)
        .addFields([
            { name: `\`🏓\` Bot Latency`, value: `\`${botLatency}ms\``, inline: true },
            { name: `\`📡\` API Latency`, value: `\`${apiLatency}ms\``, inline: true }
        ]);

    const container = new ContainerBuilder()
        .setAccentColor(resolveColor(this.client.color.success))
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`# \`✅\` Pong!`),
            new TextDisplayBuilder().setContent(`\`🏓\` **Bot Latency:** \`${botLatency}ms\``),
            new TextDisplayBuilder().setContent(`\`📡\` **API Latency:** \`${apiLatency}ms\``)
        );

    const message = [
        `\`✅\` **Pong!**`,
        `\`🏓\` Bot Latency: \`${botLatency}ms\``,
        `\`📡\` API Latency: \`${apiLatency}ms\``
    ].join('\n');

    return ctx.sendTypedMessage({ embed, componentsv2: [container], message });
}
```

## `🛠️` MessageBuilder Utility
Use `src/utils/messageBuilder.js` for simple responses that need all 3 formats:
```javascript
import { MessageBuilder } from '../../utils/messageBuilder.js';

const response = new MessageBuilder()
    .setTitle(`\`✅\` Success`)
    .setDescription('Operation completed.')
    .setColor(this.client.color.success)
    .addField(`\`⏱️\` Duration`, '2.5s', true)
    .build();

return ctx.sendTypedMessage(response);
// .build() returns { embed, componentsv2, message } automatically
```

## `❌` Fallback Behavior
If a command doesn't provide a format for the guild's preference:
- `componentsv2` requested but not provided → falls back to `embed`
- `message` requested but not provided → falls back to `embed`
- `embed` requested but not provided → falls back to `message`

---

# `📡` Comprehensive Event System

## `📋` Event Directory Structure
```
src/events/
├── Client/          → clientReady, interactionCreate, messageCreate
├── Guild/           → guildCreate, guildDelete, guildUpdate
├── Member/          → guildMemberAdd, guildMemberRemove, guildMemberUpdate
├── Voice/           → voiceStateUpdate
├── Moderation/      → guildBanAdd, guildBanRemove, auditLog
├── Message/         → messageDelete, messageUpdate, reactionAdd, reactionRemove
├── AutoMod/         → autoModerationActionExecution
├── Channel/         → channelCreate, channelDelete, channelUpdate
└── Role/            → roleCreate, roleDelete, roleUpdate
```

## `✅` Event Template
```javascript
import Event from '../../structures/Event.js';

export default class GuildCreate extends Event {
    constructor(...args) {
        super(...args, { name: 'guildCreate' });
    }
    async run(guild) {
        this.client.logger.info(`Joined guild: ${guild.name} (${guild.id})`);
        // Create default guild settings in DB
    }
}
```

## `⚡` All Supported Intents (v14.25.1)
```javascript
intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution,
    GatewayIntentBits.GuildMessagePolls,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
]
```

---

# `🔧` Utility Functions

## `📦` Available Utilities (`src/utils/`)

| File | Exports | Purpose |
|------|---------|---------|
| `resolveColor.js` | `resolveColor(color)` | Convert hex string/number to decimal for discord.js |
| `emoji.js` | `getEmoji(name, fallback)`, `StatusEmojis` | Config emoji with unicode fallback |
| `formatters.js` | `formatUptime()`, `formatBytes()`, `truncate()`, `timestamp()` | Common formatters |
| `messageBuilder.js` | `MessageBuilder` class | Build all 3 message formats at once |
| `pagination.js` | `Paginator` class | Button-based pagination for lists |

## `✅` Emoji Helper Usage
```javascript
import { getEmoji, StatusEmojis } from '../../utils/emoji.js';

// Custom emoji from config (falls back to unicode with backticks)
getEmoji('server', '🌐')    // Returns config.emojis.server or `🌐`
getEmoji('member', '👤')    // Returns config.emojis.member or `👤`

// Status emojis (always unicode with backticks — for success/error/warning)
StatusEmojis.success  // `✅`
StatusEmojis.error    // `❌`
StatusEmojis.warning  // `⚠️`
StatusEmojis.loading  // `⏳`
```

---

# `📦` Discord.js v14.25.1 Native V2 Builders

## `⚠️` IMPORTANT: `src/types.js` is DELETED
Discord.js v14.25.1 provides native V2 component builders. **Do NOT use the old custom `types.js` classes.** They are obsolete.

## `✅` Use Native Imports
```javascript
import {
    ContainerBuilder,
    TextDisplayBuilder,
    SectionBuilder,
    MediaGalleryBuilder,
    MediaGalleryItemBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ThumbnailBuilder,
    FileBuilder,
    MessageFlags,
} from 'discord.js';
```

---

# `💾` Unified Guild Schema

## `📋` Schema Location: `src/schemas/Guild.js`
The old `prefix.js` and `247.js` schemas are merged into a single `Guild.js` schema:
```javascript
const GuildSettings = new Schema({
    _id: String,                          // Guild ID
    prefix: { type: String, default: '!' },
    messageType: { type: String, enum: ['embed', 'componentsv2', 'message'], default: 'embed' },
    logging: { enabled: Boolean, channel: String, events: { ... } },
    welcome: { enabled: Boolean, channel: String, message: String },
    farewell: { enabled: Boolean, channel: String, message: String },
    voiceSettings: { twentyFourSeven: Boolean, voiceChannel: String, textChannel: String },
    autoRole: { enabled: Boolean, roles: [String] },
}, { timestamps: true });
```

---

## `📌` Remember

**Core Principles:**
- ✅ **Use existing Logger.js** - Don't create new logging
- ✅ **Context wrapper** for all commands — use `ctx.sendTypedMessage()` for output
- ✅ **MessageFlags.IsComponentsV2** for V2 messages
- ✅ **Backtick emojis** for aesthetic formatting
- ✅ **3 message formats** — every command should support embed, componentsv2, message
- ✅ **`getEmoji()` / `StatusEmojis`** — use config emojis, fallback to unicode
- ✅ **Native V2 builders** — do NOT use old `types.js`, use discord.js imports
- ✅ **Guild.js schema** — unified guild settings (prefix, messageType, logging, etc.)
- ✅ **Be direct** with feedback - no sugar coating
- ✅ **Provide alternatives** when rejecting ideas
- ✅ **Test both** prefix and slash commands
- ✅ **Test all 3** message types per command
- ✅ **Document everything** clearly
- ✅ **NEVER use `console.log`** — use Logger exclusively

**Final Thoughts:**
This bot template combines the power of hybrid commands with the modern aesthetics of Components V2 and a configurable message type system. Use `ctx.sendTypedMessage()` as the primary output method. Use the right tool for the right job: traditional embeds for simple messages, V2 components for rich, interactive experiences, and plain messages for lightweight responses.

- Always prioritize user experience and clear feedback
- Keep code DRY (Don't Repeat Yourself) - extract reusable logic

Very important for ui of embeds is that use the config.emojis and config.colors values consistently to maintain a cohesive look and feel throughout the bot's messages.

Follow this ctx guidelines files ./structures/Context.js for context usage and ./utils/Logger.js for logging best practices.

```js
import { CommandInteraction, Message, MessageFlags } from "discord.js";

export default class Context {
    constructor(ctx, args) {
        this.ctx = ctx;
        this.isInteraction = ctx instanceof CommandInteraction;
        this.interaction = this.isInteraction ? ctx : null;
        this.message = this.isInteraction ? null : ctx;
        this.id = ctx.id;
        this.channelId = ctx.channelId;
        this.client = ctx.client;
        this.author = ctx instanceof Message ? ctx.author : ctx.user;
        this.channel = ctx.channel;
        this.guild = ctx.guild;
        this.createdAt = ctx.createdAt;
        this.createdTimestamp = ctx.createdTimestamp;
        this.member = ctx.member;
        this.setArgs(args);
    }
    setArgs(args) {
        if (this.isInteraction) {
            this.args = args ? args.map(arg => arg.value) : [];
        }
        else {
            this.args = args || [];
        }
    }
    sendMessage(content) {
        if(this.isInteraction) {
            this.msg = this.interaction.reply(content);
            return this.msg;
        } else {
            this.msg = this.message.channel.send(content);
            return this.msg;
        }
    }
    async editMessage(content) {
        if(this.isInteraction) {
            this.msg = await this.interaction.editReply(content);
            return this.msg;
        } else {
            this.msg = await this.msg.edit(content);
            return this.msg;
        }
    }
    async sendDeferMessage(content) {
        if (this.isInteraction) {
            this.msg = await this.interaction.deferReply({ fetchReply: true });
            return this.msg;
        } else {
            this.msg = await this.message.channel.send(content);
            return this.msg;
        }
    }
    async sendFollowUp(content) {
        if (this.isInteraction) {
            await this.interaction.followUp(content);
        } else {
            await this.channel.send(content);
        }
    }
    // ─── NEW: Get guild message type preference ───
    async getMessageType() {
        if (!this.guild) return this.client.config.defaultMessageType || 'embed';
        const settings = await this.client.getGuildSettings(this.guild.id);
        return settings?.messageType || this.client.config.defaultMessageType || 'embed';
    }
    // ─── NEW: Send with automatic message type routing ───
    async sendTypedMessage({ embed, componentsv2, message, ephemeral = false }) {
        const type = await this.getMessageType();
        switch (type) {
            case 'componentsv2':
                if (componentsv2) return this.sendMessage({ flags: MessageFlags.IsComponentsV2, components: Array.isArray(componentsv2) ? componentsv2 : [componentsv2], ...(ephemeral && { ephemeral: true }) });
                if (embed) return this.sendMessage({ embeds: [embed], ...(ephemeral && { ephemeral: true }) });
                break;
            case 'message':
                if (message) return this.sendMessage({ content: message, ...(ephemeral && { ephemeral: true }) });
                if (embed) return this.sendMessage({ embeds: [embed], ...(ephemeral && { ephemeral: true }) });
                break;
            case 'embed':
            default:
                if (embed) return this.sendMessage({ embeds: [embed], ...(ephemeral && { ephemeral: true }) });
                if (message) return this.sendMessage({ content: message, ...(ephemeral && { ephemeral: true }) });
                break;
        }
        return this.sendMessage({ content: message || '`❌` No content to display.', ...(ephemeral && { ephemeral: true }) });
    }
    // ─── NEW: Edit with automatic message type routing ───
    async editTypedMessage({ embed, componentsv2, message }) {
        const type = await this.getMessageType();
        switch (type) {
            case 'componentsv2':
                if (componentsv2) return this.editMessage({ flags: MessageFlags.IsComponentsV2, components: Array.isArray(componentsv2) ? componentsv2 : [componentsv2], content: null, embeds: [] });
                break;
            case 'message':
                if (message) return this.editMessage({ content: message, embeds: [], components: [] });
                break;
            case 'embed':
            default:
                if (embed) return this.editMessage({ embeds: [embed], content: null, components: [] });
                break;
        }
    }
}
```

# COPILOT RULES (Discord Emojis)
- When writing **Discord message content** (message.reply, channel.send, interaction.reply), wrap any **Unicode emoji** in backticks like: `✅`, `❌` or \`✅\`, \`❌\`.
- **Do NOT** wrap emojis in **console logs**, **button labels**, **select menus**, **IDs**, or anything that isn't raw message content.
- If a message mixes text + emoji, wrap **only** the emoji.
- Default: If it's a reply message → wrap. If it's a component/console → don't wrap.

Most important notes:
- can you do this for those unicode emojis that don't have back ticks like \`\` or ``
- Kindly use the discord custom emoji mostly from config.emojis for guild related messages. lessen the use of unicode emojis except for status messages like success, error, warning, loading etc. make sure read the comments on the side of the custom emojis of what they look like. 
- while the agent is running always include to check the console output logs if there currently running errors or warnings to avoid further issues.