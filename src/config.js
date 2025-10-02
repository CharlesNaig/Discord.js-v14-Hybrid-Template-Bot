import dotenv from "dotenv";
dotenv.config();

export const config = {
    token: process.env.TOKEN || "",
    clientId: process.env.CLIENT_ID || "",
    prefix: process.env.PREFIX || "!",
    ownerID: process.env.OWNER_ID ? process.env.OWNER_ID.split(",") : [],
    mongourl: process.env.MONGO_URL || "",
    color: {
        default: process.env.DEFAULT_COLOR || "#5865F2",
        error: process.env.ERROR_COLOR || "#ED4245",
        success: process.env.SUCCESS_COLOR || "#57F287",
        info: process.env.INFO_COLOR || "#5865F2",
        warn: process.env.WARN_COLOR || "#FEE75C",
    },
    production: process.env.PRODUCTION === "true",
    guildId: process.env.GUILD_ID || "",
}