import { Client, Routes, REST, PermissionsBitField, ApplicationCommandType, GatewayIntentBits, Partials, Collection, EmbedBuilder } from 'discord.js';
import { readdirSync } from 'fs';
import pkg from 'mongoose';
const { connect, set } = pkg;
import { config } from '../config.js';
import Logger from './Logger.js';

export class BotClient extends Client {
    constructor() {
        super({
            allowedMentions: {
                parse: ['users', 'roles', 'everyone'],
                repliedUser: false,
            },
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.MessageContent,
            ],
            partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.User, Partials.Reaction],
        });
        this.config = config;
        if (!this.token) this.token = this.config.token;
        this.color = this.config.color;
        this.commands = new Collection();
        this.cooldowns = new Collection();
        this.aliases = new Collection();
        this.events = new Collection();
        this.logger = new Logger({
            displayTimestamp: true,
            displayDate: true,
        });
    }
    
    embed() {
        return new EmbedBuilder();
    }
    
    async loadEvents() {
        let i = 0;
        const eventFiles = readdirSync('./src/events');
        for (const file of eventFiles) {
            const events = readdirSync(`./src/events/${file}`).filter(c => c.split('.').pop() === 'js');
            for (const event of events) {
                const Event = (await import(`../events/${file}/${event}`)).default;
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
        
        const rest = new REST({ version: '10' }).setToken(this ? this.config.token : config.token);
        if (!this.config.production) {
            try {
                await rest.put(Routes.applicationCommands(this ? this.config.clientId : config.clientId), { body: cmdData });
            } catch (e) {
                this.logger.error(e);
            }
        } else {
            try {
                await rest.put(Routes.applicationGuildCommands(this.config.clientId, this.config.guildId), { body: cmdData });
            } catch (e) {
                this.logger.error(e);
            }
        }
        this.logger.cmd(`Successfully loaded ${i} commands`);
    }
    
    async connectMongodb() {
        set('strictQuery', true);
        await connect(this.config.mongourl);
        this.logger.ready('Connected to MongoDB');
    }
    
    async start() {
        super.login(this.token);
        if (this.config.mongourl) {
            this.connectMongodb();
        }
        this.loadEvents();
        this.loadCommands();
    }
}
