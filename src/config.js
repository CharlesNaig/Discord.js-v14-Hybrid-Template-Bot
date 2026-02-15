import dotenv from "dotenv";
dotenv.config();

export const config = {
    // Auth & IDs
    token: process.env.TOKEN || "",
    clientId: process.env.CLIENT_ID || "",
    prefix: process.env.PREFIX || "!",
    ownerID: process.env.OWNER_ID ? process.env.OWNER_ID.split(",") : [],
    mongourl: process.env.MONGO_URL || "",
    guildId: process.env.GUILD_ID || "",
    production: process.env.PRODUCTION === "true",

    // Message Type System
    defaultMessageType: process.env.DEFAULT_MESSAGE_TYPE || "embed",
    messageTypes: ["embed", "componentsv2", "message"],

    // Colors (hex strings — used by embeds and resolveColor())
    color: {
        default: process.env.DEFAULT_COLOR || "#5865F2",
        error: process.env.ERROR_COLOR || "#ED4245",
        success: process.env.SUCCESS_COLOR || "#57F287",
        info: process.env.INFO_COLOR || "#00A8FC",
        warn: process.env.WARN_COLOR || "#FEE75C",
        gold: "#f2e05c",
        dark: "#2C2F33",
        light: "#ECEFF4",
        pink: "#FE96A0",
        purple: "#9B59B6",
        orange: "#E67E22",
    },

    // Feature Colors (decimal — used by V2 ContainerBuilder.setAccentColor())
    colors: {
        primary: 0xf2e05c,
        secondary: 0x5865F2,
        success: 0x57F287,
        error: 0xED4245,
        warning: 0xFEE75C,
        info: 0x00A8FC,
        moderation: 0xED4245,
        welcome: 0x57F287,
        farewell: 0xED4245,
        logging: 0x5865F2,
        voice: 0x9B59B6,
    },

    // Custom Emojis — replace EMOJI_ID with actual IDs from your emoji server
    // Use getEmoji() from src/utils/emoji.js which auto-fallbacks to unicode
    emojis: {
        // Status
        success: "<:success:EMOJI_ID>",         // Green checkmark
        error: "<:error:EMOJI_ID>",             // Red X
        warning: "<:warning:EMOJI_ID>",         // Yellow triangle
        loading: "<a:loading:EMOJI_ID>",        // Animated loading spinner
        online: "<:online:EMOJI_ID>",           // Green dot
        offline: "<:offline:EMOJI_ID>",         // Gray dot
        idle: "<:idle:EMOJI_ID>",               // Yellow moon
        dnd: "<:dnd:EMOJI_ID>",                 // Red circle

        // Guild
        server: "<:server:EMOJI_ID>",           // Server icon
        channel: "<:channel:EMOJI_ID>",         // Hashtag channel
        voice: "<:voice:EMOJI_ID>",             // Speaker icon
        stage: "<:stage:EMOJI_ID>",             // Stage icon
        category: "<:category:EMOJI_ID>",       // Folder icon
        thread: "<:thread:EMOJI_ID>",           // Thread icon
        forum: "<:forum:EMOJI_ID>",             // Forum icon

        // Members
        member: "<:member:EMOJI_ID>",           // Person icon
        members: "<:members:EMOJI_ID>",         // People icon
        bot: "<:bot:EMOJI_ID>",                 // Robot icon
        crown: "<:crown:EMOJI_ID>",             // Crown (owner)
        moderator: "<:moderator:EMOJI_ID>",     // Shield icon
        admin: "<:admin:EMOJI_ID>",             // Star shield

        // Moderation
        ban: "<:ban:EMOJI_ID>",                 // Hammer icon
        kick: "<:kick:EMOJI_ID>",               // Boot icon
        mute: "<:mute:EMOJI_ID>",               // Muted icon
        warn: "<:warn:EMOJI_ID>",               // Warning icon
        timeout: "<:timeout:EMOJI_ID>",         // Clock icon

        // Misc UI
        arrow_right: "<:arrow_right:EMOJI_ID>", // Right arrow
        arrow_left: "<:arrow_left:EMOJI_ID>",   // Left arrow
        info: "<:info:EMOJI_ID>",               // Info circle
        settings: "<:settings:EMOJI_ID>",       // Gear icon
        link: "<:link:EMOJI_ID>",               // Chain link
        pin: "<:pin:EMOJI_ID>",                 // Pin icon
        calendar: "<:calendar:EMOJI_ID>",       // Calendar icon
        clock: "<:clock:EMOJI_ID>",             // Clock icon
        star: "<:star:EMOJI_ID>",               // Star icon
        boost: "<:boost:EMOJI_ID>",             // Nitro boost icon
        role: "<:role:EMOJI_ID>",               // Circle role icon

        // Numbers
        num1: "<:num1:EMOJI_ID>",               // Number 1
        num2: "<:num2:EMOJI_ID>",               // Number 2
        num3: "<:num3:EMOJI_ID>",               // Number 3

        // Navigation
        first: "<:first:EMOJI_ID>",             // First page
        previous: "<:previous:EMOJI_ID>",       // Previous page
        next: "<:next:EMOJI_ID>",               // Next page
        last: "<:last:EMOJI_ID>",               // Last page
        close: "<:close:EMOJI_ID>",             // Close/Delete

        // Logging
        edit: "<:edit:EMOJI_ID>",               // Pencil icon
        delete: "<:delete:EMOJI_ID>",           // Trash icon
        create: "<:create:EMOJI_ID>",           // Plus icon
        update: "<:update:EMOJI_ID>",           // Refresh icon
    },

    // Links
    links: {
        support: process.env.SUPPORT_SERVER || "",
        invite: process.env.INVITE_LINK || "",
        github: "https://github.com/CharlesNaig/Discord.js-v14-Hybrid-Template-Bot",
        website: process.env.WEBSITE || "",
    },
};