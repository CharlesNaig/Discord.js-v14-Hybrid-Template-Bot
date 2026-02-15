import Command from "../../structures/Command.js";
import { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize, ChannelType } from "discord.js";
import { getEmoji, StatusEmojis } from "../../utils/emoji.js";
import { resolveColor } from "../../utils/resolveColor.js";
import { timestamp } from "../../utils/formatters.js";

export default class ChannelInfo extends Command {
    constructor(client) {
        super(client, {
            name: 'channelinfo',
            description: {
                content: 'Display information about a channel',
                usage: '[#channel | id]',
                examples: ['channelinfo', 'channelinfo #general'],
            },
            aliases: ['ci', 'channel'],
            category: 'utility',
            cooldown: 3,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: true,
            options: [
                { name: "channel", description: "The channel to get info about", type: 7, required: false },
            ],
        });
    }

    getChannelType(type) {
        const types = {
            [ChannelType.GuildText]: 'Text',
            [ChannelType.GuildVoice]: 'Voice',
            [ChannelType.GuildCategory]: 'Category',
            [ChannelType.GuildAnnouncement]: 'Announcement',
            [ChannelType.GuildStageVoice]: 'Stage',
            [ChannelType.GuildForum]: 'Forum',
            [ChannelType.PublicThread]: 'Public Thread',
            [ChannelType.PrivateThread]: 'Private Thread',
        };
        return types[type] || 'Unknown';
    }

    async run(ctx, args) {
        let channel;
        if (ctx.isInteraction) {
            channel = ctx.interaction.options.getChannel('channel') || ctx.channel;
        } else {
            channel = ctx.message.mentions.channels.first()
                || (args[0] ? ctx.guild.channels.cache.get(args[0]) : null)
                || ctx.channel;
        }

        const created = timestamp(channel.createdAt, 'R');
        const type = this.getChannelType(channel.type);
        const topic = channel.topic || 'No topic set';
        const nsfw = channel.nsfw ? 'Yes' : 'No';
        const slowmode = channel.rateLimitPerUser ? `${channel.rateLimitPerUser}s` : 'Off';
        const category = channel.parent?.name || 'None';

        const embed = this.client.embed()
            .setColor(this.client.color.default)
            .setTitle(`${getEmoji('channel', '#')} Channel Information`)
            .addFields(
                { name: `${getEmoji('channel', '#')} Name`, value: `${channel.toString()} (\`${channel.id}\`)`, inline: false },
                { name: `${getEmoji('info', 'ℹ️')} Type`, value: type, inline: true },
                { name: `${getEmoji('category', '📁')} Category`, value: category, inline: true },
                { name: `${getEmoji('calendar', '📅')} Created`, value: created, inline: true },
                { name: `${getEmoji('settings', '⚙️')} Properties`, value: `NSFW: ${nsfw} • Slowmode: ${slowmode}`, inline: false },
            );

        if (topic !== 'No topic set') embed.addFields({ name: `${getEmoji('info', '📝')} Topic`, value: topic.length > 1024 ? topic.slice(0, 1020) + '...' : topic, inline: false });

        embed.setTimestamp();

        const container = new ContainerBuilder()
            .setAccentColor(resolveColor(this.client.color.default))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`# ${getEmoji('channel', '#')} Channel Information`),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`${getEmoji('channel', '#')} **Name:** ${channel.name} (\`${channel.id}\`)`),
                new TextDisplayBuilder().setContent(`${getEmoji('info', 'ℹ️')} **Type:** ${type}`),
                new TextDisplayBuilder().setContent(`${getEmoji('category', '📁')} **Category:** ${category}`),
                new TextDisplayBuilder().setContent(`${getEmoji('calendar', '📅')} **Created:** ${created}`),
                new TextDisplayBuilder().setContent(`NSFW: ${nsfw} • Slowmode: ${slowmode}`),
            );

        const message = [
            `${getEmoji('channel', '#')} **Channel: ${channel.name}**`,
            `**Type:** ${type} • **Category:** ${category}`,
            `**NSFW:** ${nsfw} • **Slowmode:** ${slowmode}`,
            `**Created:** ${created}`,
        ].join('\n');

        return ctx.sendTypedMessage({ embed, componentsv2: [container], message });
    }
}
