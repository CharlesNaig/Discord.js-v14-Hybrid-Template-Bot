import { Client, Routes, REST, PermissionsBitField, ApplicationCommandType, GatewayIntentBits, Partials, Collection, EmbedBuilder } from 'discord.js';
import { readdirSync, existsSync, statSync } from 'fs';
import pkg from 'mongoose';
const { connect, set, connection } = pkg;
import { config, validateConfig } from '../config.js';
import Logger from './Logger.js';
import GuildSettings from '../schemas/Guild.js';

export class BotClient extends Client {
    constructor() {
        super({
            allowedMentions: {
                parse: ['users'],
                repliedUser: false,
            },
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
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.DirectMessageReactions,
            ],
            partials: [
                Partials.Channel,
                Partials.GuildMember,
                Partials.Message,
                Partials.User,
                Partials.Reaction,
                Partials.GuildScheduledEvent,
                Partials.ThreadMember,
            ],
        });
        this.config = config;
        if (!this.token) this.token = this.config.token;
        this.color = this.config.color;
        this.commands = new Collection();
        this.cooldowns = new Collection();
        this.aliases = new Collection();
        this.events = new Collection();
        this.guildSettings = new Collection();
        this.snipes = new Collection();
        this.logger = new Logger({
            displayTimestamp: true,
            displayDate: true,
        });
    }
    
    embed() {
        return new EmbedBuilder();
    }

    /**
     * Get guild settings from cache or DB
     * @param {string} guildId
     * @returns {Promise<Object|null>}
     */
    async getGuildSettings(guildId) {
        if (this.guildSettings.has(guildId)) return this.guildSettings.get(guildId);
        if (!this.config.mongourl || connection.readyState !== 1) return null;

        try {
            const data = await GuildSettings.findOne({ _id: guildId });
            if (data) this.guildSettings.set(guildId, data);
            return data;
        } catch (error) {
            this.logger.warn(`[GuildSettings] Failed to load settings for ${guildId}: ${error.message}`);
            return null;
        }
    }
    
    async loadEvents() {
        let i = 0;
        const eventDirs = readdirSync('./src/events');
        for (const dir of eventDirs) {
            const dirPath = `./src/events/${dir}`;
            const events = readdirSync(dirPath).filter(c => c.endsWith('.js'));
            for (const event of events) {
                const Event = (await import(`../events/${dir}/${event}`)).default;
                const eventClass = new Event(this, Event);
                this.events.set(eventClass.name, eventClass);
                const eventName = eventClass.name;
                if (eventClass.once) {
                    this.once(eventName, (...args) => eventClass.run(...args));
                } else {
                    this.on(eventName, (...args) => eventClass.run(...args));
                }
                i++;
            }
        }
        this.logger.event(`Loaded ${i} events`);
    }
    
    async loadCommands() {
        let i = 0;
        const cmdData = [];
        const commandFiles = readdirSync('./src/commands');
        for (const file of commandFiles) {
            // Skip non-directory entries (e.g. template.js) in the commands root
            if (!statSync(`./src/commands/${file}`).isDirectory()) continue;
            const commands = readdirSync(`./src/commands/${file}`).filter(file => file.endsWith('.js'));
            for (const command of commands) {
                const Command = (await import(`../commands/${file}/${command}`)).default;
                const cmd = new Command(this, Command);
                cmd.file = Command;
                cmd.fileName = Command.name;
                this.commands.set(cmd.name, cmd);
                if (cmd.aliases && Array.isArray(cmd.aliases)) {
                    cmd.aliases.forEach(alias => {
                        this.aliases.set(alias, cmd.name);
                    });
                }
                if (cmd.slashCommand) {
                    const data = {
                        name: cmd.name,
                        description: cmd.description.content,
                        type: ApplicationCommandType.ChatInput,
                        options: cmd.options ? cmd.options : null,
                        name_localizations: cmd.nameLocalizations ? cmd.nameLocalizations : null,
                        description_localizations: cmd.descriptionLocalizations ? cmd.descriptionLocalizations : null,
                    };
                    if (cmd.permissions.user.length > 0) data.default_member_permissions = cmd.permissions.user ? PermissionsBitField.resolve(cmd.permissions.user).toString() : 0;
                    cmdData.push(data);
                    i++;
                }
            }
        }

        this.logger.cmd(`Successfully loaded ${i} commands locally`);

        if (!this.config.registerCommands) {
            this.logger.cmd('Skipping Discord slash command registration because REGISTER_COMMANDS=false.');
            return;
        }

        validateConfig({
            requireClientId: true,
            requireGuildId: !this.config.production,
        });

        const rest = new REST({ version: '10' }).setToken(this ? this.config.token : config.token);
        if (this.config.production) {
            try {
                this.logger.cmd(`Registering ${cmdData.length} slash command(s) globally.`);
                await rest.put(Routes.applicationCommands(this ? this.config.clientId : config.clientId), { body: cmdData });
            } catch (e) {
                this.logger.error(e);
            }
        } else {
            try {
                this.logger.cmd(`Registering ${cmdData.length} slash command(s) to guild ${this.config.guildId}.`);
                await rest.put(Routes.applicationGuildCommands(this.config.clientId, this.config.guildId), { body: cmdData });
            } catch (e) {
                this.logger.error(e);
            }
        }
    }
    
    async connectMongodb() {
        set('strictQuery', true);
        await connect(this.config.mongourl);
        this.logger.ready('Connected to MongoDB');
    }
    
    async start() {
        try {
            validateConfig({ requireToken: true });

            await this.loadEvents();
            await this.loadCommands();

            if (this.config.mongourl) {
                await this.connectMongodb();
            }

            await super.login(this.token);
        } catch (error) {
            this.logger.error(`[STARTUP] Fatal startup error: ${error.message}`);
            if (error.stack) {
                this.logger.error(error.stack);
            }
            process.exit(1);
        }
    }
}
