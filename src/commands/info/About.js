import Command from "../../structures/Command.js"; 
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize } from "discord.js";
import { version } from 'discord.js';
import { getEmoji, StatusEmojis } from "../../utils/emoji.js";
import { resolveColor } from "../../utils/resolveColor.js";
import { formatUptime } from "../../utils/formatters.js";

export default class About extends Command {
    constructor(client) {
        super(client, {
            name: 'about',
            description: {
                content: 'See information about this bot.',
                usage: 'about',
                examples: ['about'],
            },
            aliases: ["info", "botinfo"],
            category: 'info',
            cooldown: 3,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: true,
        });
    }

    async run(ctx, args) {
        const uptime = formatUptime(this.client.uptime);
        const servers = this.client.guilds.cache.size;
        const users = this.client.users.cache.size;
        const commands = this.client.commands.size;
        const ping = Math.round(this.client.ws.ping);

        // ─── Embed Format ───
        const embed = this.client.embed()
            .setAuthor({ name: 'Bot Information', iconURL: this.client.user.displayAvatarURL() })
            .setThumbnail(this.client.user.displayAvatarURL())
            .setColor(this.client.color.default)
            .addFields([
                { name: `${getEmoji('bot', '🤖')} Bot Name`, value: this.client.user.tag, inline: true },
                { name: `${getEmoji('server', '📊')} Servers`, value: `${servers}`, inline: true },
                { name: `${getEmoji('members', '👥')} Users`, value: `${users}`, inline: true },
                { name: `${getEmoji('info', '📝')} Commands`, value: `${commands}`, inline: true },
                { name: `${getEmoji('clock', '🏓')} Ping`, value: `${ping}ms`, inline: true },
                { name: `${getEmoji('clock', '⏱️')} Uptime`, value: `<t:${Math.floor((Date.now() - this.client.uptime) / 1000)}:R>`, inline: true },
                { name: `${getEmoji('settings', '💻')} Node.js`, value: process.version, inline: true },
                { name: `${getEmoji('info', '📚')} Discord.js`, value: `v${version}`, inline: true },
                { name: `${getEmoji('settings', '🔧')} Prefix`, value: this.client.config.prefix, inline: true },
            ])
            .setFooter({ text: `Requested by ${ctx.author.tag}`, iconURL: ctx.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        // ─── Components V2 Format ───
        const container = new ContainerBuilder()
            .setAccentColor(resolveColor(this.client.color.default))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`# ${getEmoji('bot', '🤖')} Bot Information`),
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`${getEmoji('bot', '🤖')} **Bot Name:** ${this.client.user.tag}`),
                new TextDisplayBuilder().setContent(`${getEmoji('server', '📊')} **Servers:** ${servers}`),
                new TextDisplayBuilder().setContent(`${getEmoji('members', '👥')} **Users:** ${users}`),
                new TextDisplayBuilder().setContent(`${getEmoji('info', '📝')} **Commands:** ${commands}`),
                new TextDisplayBuilder().setContent(`${getEmoji('clock', '🏓')} **Ping:** ${ping}ms`),
                new TextDisplayBuilder().setContent(`${getEmoji('clock', '⏱️')} **Uptime:** ${uptime}`),
                new TextDisplayBuilder().setContent(`\u200b`),
                new TextDisplayBuilder().setContent(`${getEmoji('settings', '💻')} **Node.js:** ${process.version}`),
                new TextDisplayBuilder().setContent(`${getEmoji('info', '📚')} **Discord.js:** v${version}`),
                new TextDisplayBuilder().setContent(`${getEmoji('settings', '🔧')} **Prefix:** ${this.client.config.prefix}`),
                new TextDisplayBuilder().setContent(`\u200b`),
                new TextDisplayBuilder().setContent(`-# Requested by ${ctx.author.tag}`),
            );

        // ─── Message Format ───
        const message = [
            `${getEmoji('bot', '🤖')} **Bot Information**`,
            ``,
            `${getEmoji('bot', '🤖')} **Bot Name:** ${this.client.user.tag}`,
            `${getEmoji('server', '📊')} **Servers:** ${servers}`,
            `${getEmoji('members', '👥')} **Users:** ${users}`,
            `${getEmoji('info', '📝')} **Commands:** ${commands}`,
            `${getEmoji('clock', '🏓')} **Ping:** ${ping}ms`,
            `${getEmoji('clock', '⏱️')} **Uptime:** ${uptime}`,
            `${getEmoji('settings', '💻')} **Node.js:** ${process.version}`,
            `${getEmoji('info', '📚')} **Discord.js:** v${version}`,
            `${getEmoji('settings', '🔧')} **Prefix:** ${this.client.config.prefix}`,
        ].join('\n');

        return ctx.sendTypedMessage({ embed, componentsv2: [container], message });
    }
}
