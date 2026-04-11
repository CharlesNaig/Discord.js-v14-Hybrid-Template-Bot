// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║                     COMMAND TEMPLATE — Quick Reference                      ║
// ║  This file is a comprehensive guide for creating hybrid commands.           ║
// ║  Copy this file into the appropriate category folder and rename it.         ║
// ║  e.g. src/commands/utility/MyCommand.js                                    ║
// ╚══════════════════════════════════════════════════════════════════════════════╝
//
// ┌─────────────────────────── TABLE OF CONTENTS ──────────────────────────────┐
// │  1. Imports & Setup                                                        │
// │  2. Constructor Options (all properties explained)                         │
// │  3. The run() Method — Hybrid Command Execution                            │
// │  4. Three Message Formats (embed / componentsv2 / message)                 │
// │  5. Slash Command Option Types Reference                                   │
// │  6. Common Patterns & Examples                                             │
// │     a. Fetching users (slash vs prefix)                                    │
// │     b. Deferred replies (loading states)                                   │
// │     c. Error handling                                                      │
// │     d. Database interaction (Guild schema)                                 │
// │     e. Permission-gated commands                                           │
// │     f. Pagination / follow-ups                                             │
// │  7. Emoji & Color Reference                                                │
// │  8. Available Utility Functions                                            │
// └────────────────────────────────────────────────────────────────────────────┘

// ═══════════════════════════════════════════════════════════════════════════════
// 1. IMPORTS — Always use ES Module syntax (import/export)
// ═══════════════════════════════════════════════════════════════════════════════

import Command from "../../structures/Command.js";

// Discord.js V2 component builders — only import what you need
import {
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    // MediaGalleryBuilder,      // For images / banners
    // MediaGalleryItemBuilder,  // Individual gallery items
    // SectionBuilder,           // Section with thumbnail
    // ActionRowBuilder,         // For buttons / select menus
    // ButtonBuilder,            // Buttons
    // ButtonStyle,              // Button styles (Primary, Secondary, Danger, Success, Link)
    // ChannelType,              // For channel type comparisons
    // PermissionFlagsBits,      // For checking specific permissions
} from "discord.js";

// Emoji helpers — use getEmoji() for custom emojis with unicode fallback
// StatusEmojis are pre-wrapped unicode emojis for status messages
import { getEmoji, StatusEmojis } from "../../utils/emoji.js";

// Color resolver — converts hex strings ("#5865F2") to decimal for V2 containers
import { resolveColor } from "../../utils/resolveColor.js";

// Formatter utilities — common formatting helpers
// import { formatUptime, formatBytes, truncate, timestamp, formatNumber, capitalize } from "../../utils/formatters.js";

// Guild schema — for database operations (only import if needed)
// import GuildSettings from "../../schemas/Guild.js";

// ═══════════════════════════════════════════════════════════════════════════════
// 2. CLASS DEFINITION — Every command is a class extending Command
// ═══════════════════════════════════════════════════════════════════════════════
//
// File naming: PascalCase (e.g. MyCommand.js)
// Class naming: PascalCase matching file name
// Export: Always use `export default`

export default class Template extends Command {
    constructor(client) {
        super(client, {
            // ──────────────────────────────────────────────────────────────────
            // REQUIRED PROPERTIES
            // ──────────────────────────────────────────────────────────────────

            // name: The primary command name (lowercase, no spaces)
            // This is used for both prefix (!template) and slash (/template)
            name: 'template',

            // description: Object with content, usage, and examples
            //   content  → Shows in /help and slash command description
            //   usage    → Shows argument format in help (< > = required, [ ] = optional)
            //   examples → Array of example usages (shown in help command)
            description: {
                content: 'A template command showing all available patterns',
                usage: '<required_arg> [optional_arg]',
                examples: [
                    'template hello',
                    'template hello world',
                    'template @user reason for something',
                ],
            },

            // category: Must match the folder name this file lives in
            // Available: 'info', 'config', 'dev', 'moderation', 'utility'
            // (or create a new folder under src/commands/ for a new category)
            category: 'utility',

            // ──────────────────────────────────────────────────────────────────
            // OPTIONAL PROPERTIES (with defaults)
            // ──────────────────────────────────────────────────────────────────

            // aliases: Alternative names for prefix commands (slash always uses `name`)
            // Default: []
            aliases: ['tmpl', 'example'],

            // cooldown: Seconds between uses per user
            // Default: 3
            cooldown: 5,

            // args: If true, the command handler will reject if no arguments provided (prefix only)
            // Default: false
            args: false,

            // guildOnly: If true, command cannot be used in DMs
            // Default: true
            guildOnly: true,

            // disabled: If true, command is loaded but won't execute
            // Default: false
            disabled: false,

            // permissions:
            //   dev    → If true, only bot owners (config.ownerID) can use this
            //   client → Permissions the BOT needs to execute
            //   user   → Permissions the USER needs to execute
            //
            // Common permissions:
            //   'SendMessages', 'ViewChannel', 'EmbedLinks' (basic, default for client)
            //   'ManageMessages', 'ManageGuild', 'ManageRoles', 'ManageChannels'
            //   'BanMembers', 'KickMembers', 'ModerateMembers' (timeout)
            //   'AddReactions', 'AttachFiles', 'UseExternalEmojis'
            //   'Administrator'
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },

            // slashCommand: Register this command as a slash command
            // Set to false for dev/dangerous commands (like eval)
            // Default: false
            slashCommand: true,

            // options: Slash command options (arguments)
            // Only used when slashCommand: true
            // See Section 5 below for all option types
            options: [
                {
                    name: "input",
                    description: "Some input text",
                    type: 3, // String
                    required: false,
                },
                // More option examples commented below in Section 5
            ],

            // subcategory: Optional sub-grouping within a category
            // Default: null
            subcategory: null,
        });
    }

    // ═════════════════════════════════════════════════════════════════════════════
    // 3. THE run() METHOD — This is where your command logic goes
    // ═════════════════════════════════════════════════════════════════════════════
    //
    // Parameters:
    //   ctx  → Context object (unified wrapper for Message & Interaction)
    //   args → Array of arguments
    //          - Prefix: message content split by spaces (after command name)
    //          - Slash:  option values mapped to an array
    //
    // Context (ctx) properties:
    //   ctx.isInteraction   → true if slash command, false if prefix
    //   ctx.interaction     → CommandInteraction (null for prefix)
    //   ctx.message         → Message (null for slash)
    //   ctx.author          → User who ran the command
    //   ctx.member          → GuildMember who ran the command
    //   ctx.guild           → Guild object (null in DMs)
    //   ctx.channel         → Channel object
    //   ctx.client          → Bot client instance
    //   ctx.args            → Parsed arguments array
    //   ctx.id              → Message/Interaction ID
    //   ctx.createdAt       → When the command was invoked
    //   ctx.createdTimestamp → Timestamp in ms
    //
    // Context (ctx) methods:
    //   ctx.sendMessage(content)       → Send a reply (auto-handles interaction vs message)
    //   ctx.editMessage(content)       → Edit the previous reply
    //   ctx.sendDeferMessage(content)  → Defer (interaction) or send loading message (prefix)
    //   ctx.sendFollowUp(content)      → Send a follow-up message
    //   ctx.getMessageType()           → Get guild's preferred message format
    //   ctx.sendTypedMessage({ embed, componentsv2, message })  → AUTO-ROUTE to guild preference
    //   ctx.editTypedMessage({ embed, componentsv2, message })  → Edit with auto-routing

    async run(ctx, args) {
        // ─────────────────────────────────────────────────────────────────────
        // STEP 1: Parse arguments (handle both slash and prefix)
        // ─────────────────────────────────────────────────────────────────────
        const input = ctx.isInteraction
            ? ctx.interaction.options.getString('input')  // Slash: get typed option
            : args.join(' ');                             // Prefix: join remaining args

        // ─────────────────────────────────────────────────────────────────────
        // STEP 2: Validate input (if needed)
        // ─────────────────────────────────────────────────────────────────────
        if (!input || !input.trim()) {
            // Quick error — use sendTypedMessage for consistent formatting
            return ctx.sendTypedMessage({
                embed: this.client.embed()
                    .setColor(this.client.color.error)
                    .setDescription(`${StatusEmojis.error} Please provide some input! Usage: \`${this.description.usage}\``),
                message: `${StatusEmojis.error} Please provide some input! Usage: \`${this.description.usage}\``,
            });
        }

        // ─────────────────────────────────────────────────────────────────────
        // STEP 3: Build all 3 message formats
        // ─────────────────────────────────────────────────────────────────────
        // IMPORTANT: Every command should support all 3 formats.
        //   - embed        → Traditional Discord embed (EmbedBuilder)
        //   - componentsv2 → Modern V2 container layout
        //   - message      → Plain text with formatting
        //
        // The guild's preference (set via !messagetype) determines which is sent.
        // Fallback order: componentsv2 → embed, message → embed, embed → message

        // ── Embed Format ────────────────────────────────────────────────────
        // Uses: this.client.embed() → returns a new EmbedBuilder
        // Colors: this.client.color.default | .error | .success | .info | .warn | .gold | .dark | .light | .pink | .purple | .orange
        const embed = this.client.embed()
            .setColor(this.client.color.success)
            .setAuthor({ name: ctx.author.tag, iconURL: ctx.author.displayAvatarURL() })
            .setTitle(`${getEmoji('star', '✨')} Template Result`)
            .setDescription(`Here is your input processed!`)
            .addFields(
                { name: `${getEmoji('info', '📝')} Input`, value: `\`${input}\``, inline: true },
                { name: `${getEmoji('member', '👤')} Author`, value: ctx.author.tag, inline: true },
                { name: `${getEmoji('server', '🌐')} Guild`, value: ctx.guild?.name || 'DM', inline: true },
            )
            .setFooter({ text: `Requested by ${ctx.author.tag}`, iconURL: ctx.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        // ── Components V2 Format ────────────────────────────────────────────
        // Uses: ContainerBuilder → the outer wrapper (replaces embed)
        //   .setAccentColor()              → Side color bar (must be decimal, use resolveColor())
        //   .addTextDisplayComponents()    → Text content (supports markdown: #, ##, ###, **, `)
        //   .addSeparatorComponents()      → Horizontal divider line
        //
        // Text formatting in V2:
        //   # Heading 1  |  ## Heading 2  |  ### Heading 3
        //   **bold**     |  *italic*      |  `code`
        //   \u200b       → blank line for spacing
        //   -# text      → small/subdued footer text
        const container = new ContainerBuilder()
            .setAccentColor(resolveColor(this.client.color.success))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`# ${getEmoji('star', '✨')} Template Result`),
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small),
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`${getEmoji('info', '📝')} **Input:** \`${input}\``),
                new TextDisplayBuilder().setContent(`${getEmoji('member', '👤')} **Author:** ${ctx.author.tag}`),
                new TextDisplayBuilder().setContent(`${getEmoji('server', '🌐')} **Guild:** ${ctx.guild?.name || 'DM'}`),
                new TextDisplayBuilder().setContent(`\u200b`),  // Blank line spacer
                new TextDisplayBuilder().setContent(`-# Requested by ${ctx.author.tag}`),  // Subdued footer
            );

        // ── Message Format (Plain Text) ─────────────────────────────────────
        // Keep it simple — bold, code blocks, and emojis only
        const message = [
            `${getEmoji('star', '✨')} **Template Result**`,
            `${getEmoji('info', '📝')} **Input:** \`${input}\``,
            `${getEmoji('member', '👤')} **Author:** ${ctx.author.tag}`,
            `${getEmoji('server', '🌐')} **Guild:** ${ctx.guild?.name || 'DM'}`,
        ].join('\n');

        // ─────────────────────────────────────────────────────────────────────
        // STEP 4: Send the response using ctx.sendTypedMessage()
        // ─────────────────────────────────────────────────────────────────────
        // This automatically picks the right format based on guild preference.
        // componentsv2 must always be wrapped in an array: [container]
        return ctx.sendTypedMessage({ embed, componentsv2: [container], message });
    }
}


// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  EVERYTHING BELOW IS REFERENCE — DO NOT INCLUDE IN YOUR FINAL COMMAND      ║
// ║  These are copy-paste snippets & documentation for common patterns.        ║
// ╚══════════════════════════════════════════════════════════════════════════════╝


// ═══════════════════════════════════════════════════════════════════════════════
// 5. SLASH COMMAND OPTION TYPES REFERENCE
// ═══════════════════════════════════════════════════════════════════════════════
//
// Type | Value | Description                    | Getter Method
// ─────┼───────┼────────────────────────────────┼──────────────────────────────
//  1   | SUB_COMMAND                            | (subcommand grouping)
//  2   | SUB_COMMAND_GROUP                      | (subcommand grouping)
//  3   | STRING                                 | .getString('name')
//  4   | INTEGER                                | .getInteger('name')
//  5   | BOOLEAN                                | .getBoolean('name')
//  6   | USER                                   | .getUser('name') / .getMember('name')
//  7   | CHANNEL                                | .getChannel('name')
//  8   | ROLE                                   | .getRole('name')
//  9   | MENTIONABLE (user or role)             | .getMentionable('name')
// 10   | NUMBER (decimal)                       | .getNumber('name')
// 11   | ATTACHMENT                             | .getAttachment('name')
//
// Option object shape:
// {
//     name: "option_name",           // Lowercase, no spaces
//     description: "What this does", // Shown in slash command UI
//     type: 3,                       // Type number from table above
//     required: true,                // Is this option mandatory?
//
//     // String/Integer/Number specific:
//     min_value: 0,                  // Minimum value (integer/number only)
//     max_value: 100,                // Maximum value (integer/number only)
//     min_length: 1,                 // Minimum length (string only)
//     max_length: 2000,              // Maximum length (string only)
//
//     // Predefined choices (user picks from list):
//     choices: [
//         { name: 'Option A', value: 'a' },
//         { name: 'Option B', value: 'b' },
//     ],
//
//     // Channel type filter (type 7 only):
//     channel_types: [0, 2],         // 0 = Text, 2 = Voice, 13 = Stage, 15 = Forum
//
//     // Autocomplete (replaces choices — handled via interactionCreate event):
//     autocomplete: true,
// }


// ═══════════════════════════════════════════════════════════════════════════════
// 6. COMMON PATTERNS & EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════════

// ─── 6a. Fetching a user (slash vs prefix) ──────────────────────────────────
//
// // Option: { name: "user", description: "Target user", type: 6, required: false }
//
// const user = ctx.isInteraction
//     ? ctx.interaction.options.getUser('user') || ctx.author
//     : ctx.message.mentions.users.first()
//         || (args[0] ? await this.client.users.fetch(args[0]).catch(() => null) : null)
//         || ctx.author;
//
// // For GuildMember (has roles, nickname, permissions):
// const member = ctx.isInteraction
//     ? ctx.interaction.options.getMember('user')
//     : ctx.message.mentions.members.first()
//         || await ctx.guild.members.fetch(args[0]).catch(() => null);


// ─── 6b. Deferred replies (for slow operations) ────────────────────────────
//
// // Use sendDeferMessage when your command takes >3 seconds
// // Slash: shows "Bot is thinking..." | Prefix: sends a loading message
//
// async run(ctx, args) {
//     const msg = await ctx.sendDeferMessage(`${StatusEmojis.loading} Processing...`);
//
//     // ... do slow work (API calls, DB queries, etc.) ...
//
//     // Then EDIT the deferred message (don't send a new one)
//     return ctx.editTypedMessage({ embed, componentsv2: [container], message });
// }


// ─── 6c. Error handling ────────────────────────────────────────────────────
//
// // Always wrap risky operations in try-catch
// // Use this.client.logger for logging — NEVER console.log
//
// try {
//     await someDangerousOperation();
// } catch (error) {
//     this.client.logger.error(`[Template] ${error.message}`);
//     return ctx.sendTypedMessage({
//         embed: this.client.embed()
//             .setColor(this.client.color.error)
//             .setDescription(`${StatusEmojis.error} Something went wrong: ${error.message}`),
//         message: `${StatusEmojis.error} Something went wrong: ${error.message}`,
//     });
// }


// ─── 6d. Database interaction (Guild schema) ───────────────────────────────
//
// // Import: import GuildSettings from "../../schemas/Guild.js";
//
// // Read guild settings (uses cache first, then DB)
// const settings = await this.client.getGuildSettings(ctx.guild.id);
//
// // Create or update guild settings
// let data = await GuildSettings.findOne({ _id: ctx.guild.id });
// if (!data) {
//     data = new GuildSettings({ _id: ctx.guild.id });
// }
// data.prefix = '!';                    // Update a field
// data.welcome.enabled = true;          // Update nested field
// await data.save();                    // Persist to DB
// this.client.guildSettings.set(ctx.guild.id, data);  // Update cache


// ─── 6e. Permission-gated commands (checking at runtime) ───────────────────
//
// // Besides the constructor permissions, you can do runtime checks:
//
// if (!ctx.member.permissions.has('ManageMessages')) {
//     return ctx.sendTypedMessage({
//         embed: this.client.embed()
//             .setColor(this.client.color.error)
//             .setDescription(`${StatusEmojis.error} You need **Manage Messages** permission.`),
//         message: `${StatusEmojis.error} You need **Manage Messages** permission.`,
//     });
// }
//
// // Check bot permissions:
// if (!ctx.guild.members.me.permissions.has('BanMembers')) {
//     return ctx.sendTypedMessage({
//         embed: this.client.embed()
//             .setColor(this.client.color.error)
//             .setDescription(`${StatusEmojis.error} I need **Ban Members** permission.`),
//         message: `${StatusEmojis.error} I need **Ban Members** permission.`,
//     });
// }


// ─── 6f. Follow-up messages ────────────────────────────────────────────────
//
// // After the initial reply, use sendFollowUp for additional messages
// // Useful for paginated content, confirmations, etc.
//
// await ctx.sendTypedMessage({ embed, componentsv2: [container], message });
// await ctx.sendFollowUp({ content: `${StatusEmojis.info} Additional information here.` });


// ═══════════════════════════════════════════════════════════════════════════════
// 7. EMOJI & COLOR REFERENCE
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Emojis ─────────────────────────────────────────────────────────────────
//
// StatusEmojis (pre-wrapped unicode — for status messages):
//   StatusEmojis.success  → `✅`     StatusEmojis.error    → `❌`
//   StatusEmojis.warning  → `⚠️`     StatusEmojis.loading  → `⏳`
//   StatusEmojis.info     → `ℹ️`     StatusEmojis.reload   → `🔄`
//
// getEmoji(key, fallback) — Custom Discord emojis with unicode fallback:
//   getEmoji('success', '✅')    getEmoji('error', '❌')
//   getEmoji('member', '👤')     getEmoji('members', '👥')
//   getEmoji('server', '🌐')     getEmoji('channel', '#')
//   getEmoji('ban', '🔨')        getEmoji('kick', '👢')
//   getEmoji('info', '📝')       getEmoji('settings', '⚙️')
//   getEmoji('clock', '🕐')      getEmoji('calendar', '📅')
//   getEmoji('star', '⭐')       getEmoji('boost', '🚀')
//   getEmoji('role', '🎭')       getEmoji('crown', '👑')
//   getEmoji('moderator', '🛡️')  getEmoji('bot', '🤖')
//   getEmoji('voice', '🔊')      getEmoji('link', '🔗')
//   getEmoji('pin', '📌')        getEmoji('edit', '✏️')
//   getEmoji('delete', '🗑️')     getEmoji('create', '➕')
//
// Full list: see config.emojis in src/config.js

// ─── Colors ─────────────────────────────────────────────────────────────────
//
// this.client.color.default  → "#5865F2" (Blurple)
// this.client.color.error    → "#ED4245" (Red)
// this.client.color.success  → "#57F287" (Green)
// this.client.color.info     → "#00A8FC" (Blue)
// this.client.color.warn     → "#FEE75C" (Yellow)
// this.client.color.gold     → "#f2e05c" (Gold)
// this.client.color.dark     → "#2C2F33" (Dark gray)
// this.client.color.light    → "#ECEFF4" (Light gray)
// this.client.color.pink     → "#FE96A0" (Pink)
// this.client.color.purple   → "#9B59B6" (Purple)
// this.client.color.orange   → "#E67E22" (Orange)
//
// For V2 containers: resolveColor(this.client.color.success) → decimal number


// ═══════════════════════════════════════════════════════════════════════════════
// 8. AVAILABLE UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── From src/utils/formatters.js ───────────────────────────────────────────
//
// formatUptime(ms)       → "2d 5h 30m 10s"
// formatBytes(bytes)     → "1.5 GB"
// truncate(str, max)     → Truncate to max length with "..."
// timestamp(date, style) → Discord timestamp: <t:1234567890:R>
//                          Styles: R (relative), F (full), f (short),
//                                  D (date), d (short date), T (time), t (short time)
// formatNumber(num)      → "1,234,567"
// capitalize(str)        → "Hello"

// ─── From src/utils/resolveColor.js ─────────────────────────────────────────
//
// resolveColor("#5865F2") → 5793266 (decimal for V2 containers)
// resolveColor(0x5865F2)  → 5793266 (pass-through for numbers)

// ─── From src/utils/emoji.js ────────────────────────────────────────────────
//
// getEmoji('name', 'fallback')  → Custom emoji or `fallback` wrapped in backticks
// StatusEmojis.success           → `✅` (always unicode, pre-wrapped)


// ═══════════════════════════════════════════════════════════════════════════════
// QUICK-START CHECKLIST
// ═══════════════════════════════════════════════════════════════════════════════
//
// [ ] 1. Copy this file to src/commands/<category>/YourCommand.js
// [ ] 2. Rename the class to match your command (PascalCase)
// [ ] 3. Set name, description, category, permissions, options
// [ ] 4. Set slashCommand: true if you want slash support
// [ ] 5. Implement run(ctx, args) with your logic
// [ ] 6. Build all 3 message formats (embed, componentsv2, message)
// [ ] 7. Use ctx.sendTypedMessage() to send the response
// [ ] 8. Add error handling with try-catch
// [ ] 9. Use this.client.logger (NEVER console.log)
// [ ] 10. Delete all reference comments below the class before committing
// [ ] 11. Restart the bot — commands auto-load from the folder structure
