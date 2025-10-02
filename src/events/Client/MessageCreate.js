import Event from "../../structures/Event.js";
import Context from "../../structures/Context.js";
import { Message, ChannelType, PermissionFlagsBits, Collection } from "discord.js";
import PrefixSchema from "../../schemas/prefix.js";

async function getPrefix(guildId, client) {
    const data = await PrefixSchema.findOne({ _id: guildId });
    return data?.prefix || client.config.prefix;
}

export default class MessageCreate extends Event {
    constructor(...args) {
        super(...args, {
            name: 'messageCreate'
        });
    }
    /**
     * @param {Message} message
     */
    async run(message) {
        if (message.author.bot || message.channel.type === ChannelType.DM) return;
        if (message.partial) await message.fetch();
        
        const ctx = new Context(message);
        const prefix = await getPrefix(message.guild.id, this.client);
        
        const mention = new RegExp(`^<@!?${this.client.user.id}>( |)$`);
        if (message.content.match(mention)) {
            if (message.channel.permissionsFor(this.client.user).has([PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ViewChannel])) {
                return await message.reply({ content: `Hey, my prefix for this server is \`${prefix}\` Want more info? then do \`${prefix}help\`\nStay Safe, Stay Awesome!` }).catch(() => { });
            }
        }

        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const prefixRegex = new RegExp(`^(<@!?${this.client.user.id}>|${escapeRegex(prefix)})\\s*`);
        if (!prefixRegex.test(message.content)) return;
        const [matchedPrefix] = message.content.match(prefixRegex);

        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase();
        const command = this.client.commands.get(commandName) || this.client.commands.get(this.client.aliases.get(commandName));

        ctx.setArgs(args);

        if (!command) return;
        this.client.logger.cmd('%s used by %s from %s', commandName, ctx.author.id, ctx.guild.id);

        if (!message.inGuild() || !message.channel.permissionsFor(message.guild.members.me).has(PermissionFlagsBits.ViewChannel)) return;

        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) {
            return await message.author.send({ content: `I don't have **\`SEND_MESSAGES\`** permission in \`${message.guild.name}\`\nchannel: <#${message.channelId}>` }).catch(() => { });
        }

        if (!message.guild.members.me.permissions.has(PermissionFlagsBits.EmbedLinks)) {
            return await message.channel.send({ content: 'I don\'t have **`EMBED_LINKS`** permission.' }).catch(() => { });
        }

        if (command.permissions) {
            if (command.permissions.client) {
                if (!message.guild.members.me.permissions.has(command.permissions.client)) {
                    return await message.reply({ content: 'I don\'t have enough permissions to execute this command.' });
                }
            }

            if (command.permissions.user) {
                if (!message.member.permissions.has(command.permissions.user)) {
                    return await message.reply({ content: 'You don\'t have enough permissions to use this command.' });
                }
            }
            
            if (command.permissions.dev) {
                if (this.client.config.ownerID) {
                    const findDev = this.client.config.ownerID.find((x) => x === message.author.id);
                    if (!findDev) return;
                }
            }
        }

        if (command.args) {
            if (!args.length) {
                return await message.reply({ content: `Please provide the required arguments.\nUsage: \`${prefix}${command.name} ${command.description.usage}\`` });
            }
        }
        
        if (!this.client.cooldowns.has(commandName)) {
            this.client.cooldowns.set(commandName, new Collection());
        }
        
        const now = Date.now();
        const timestamps = this.client.cooldowns.get(commandName);
        const cooldownAmount = Math.floor(command.cooldown || 5) * 1000;
        
        if (!timestamps.has(message.author.id)) {
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        } else {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            const timeLeft = (expirationTime - now) / 1000;
            if (now < expirationTime && timeLeft > 0.9) {
                return message.reply({ content: `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${commandName}\` command.` });
            }
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }
        
        try {
            return await command.run(ctx, ctx.args);
        } catch (error) {
            await message.channel.send({ content: 'An unexpected error occurred, the developers have been notified!' }).catch(() => { });
            console.error(error);
        }
    }
}