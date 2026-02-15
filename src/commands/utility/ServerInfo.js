import Command from "../../structures/Command.js";
import { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize, ChannelType } from "discord.js";
import { getEmoji } from "../../utils/emoji.js";
import { resolveColor } from "../../utils/resolveColor.js";
import { timestamp, formatNumber } from "../../utils/formatters.js";

export default class ServerInfo extends Command {
    constructor(client) {
        super(client, {
            name: 'serverinfo',
            description: {
                content: 'Display information about the server',
                usage: '',
                examples: ['serverinfo'],
            },
            aliases: ['si', 'server', 'guild'],
            category: 'utility',
            cooldown: 5,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }

    async run(ctx) {
        const guild = ctx.guild;
        await guild.members.fetch().catch(() => {});

        const owner = await guild.fetchOwner().catch(() => null);
        const textChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size;
        const voiceChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size;
        const categories = guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).size;
        const threads = guild.channels.cache.filter(c => [ChannelType.PublicThread, ChannelType.PrivateThread].includes(c.type)).size;
        const humans = guild.members.cache.filter(m => !m.user.bot).size;
        const bots = guild.members.cache.filter(m => m.user.bot).size;
        const roles = guild.roles.cache.size - 1; // exclude @everyone
        const emojis = guild.emojis.cache.size;
        const stickers = guild.stickers.cache.size;
        const boosts = guild.premiumSubscriptionCount || 0;
        const boostTier = guild.premiumTier;
        const created = timestamp(guild.createdAt, 'R');
        const verif = ['None', 'Low', 'Medium', 'High', 'Very High'][guild.verificationLevel] || 'Unknown';

        const embed = this.client.embed()
            .setColor(this.client.color.default)
            .setTitle(`${getEmoji('server', '🌐')} ${guild.name}`)
            .setThumbnail(guild.iconURL({ size: 256, dynamic: true }))
            .addFields(
                { name: `${getEmoji('crown', '👑')} Owner`, value: owner ? `${owner.user.tag}` : 'Unknown', inline: true },
                { name: `${getEmoji('calendar', '📅')} Created`, value: created, inline: true },
                { name: `${getEmoji('info', 'ℹ️')} ID`, value: `\`${guild.id}\``, inline: true },
                { name: `${getEmoji('members', '👥')} Members (${formatNumber(guild.memberCount)})`, value: `${getEmoji('member', '👤')} Humans: ${formatNumber(humans)}\n${getEmoji('bot', '🤖')} Bots: ${formatNumber(bots)}`, inline: true },
                { name: `${getEmoji('channel', '#')} Channels (${textChannels + voiceChannels})`, value: `${getEmoji('channel', '#')} Text: ${textChannels}\n${getEmoji('voice', '🔊')} Voice: ${voiceChannels}\n${getEmoji('category', '📁')} Categories: ${categories}\n${getEmoji('thread', '🧵')} Threads: ${threads}`, inline: true },
                { name: `${getEmoji('role', '🎭')} Roles`, value: `${roles}`, inline: true },
                { name: `${getEmoji('star', '⭐')} Emojis / Stickers`, value: `${emojis} emojis • ${stickers} stickers`, inline: true },
                { name: `${getEmoji('boost', '🚀')} Boosts`, value: `${boosts} (Tier ${boostTier})`, inline: true },
                { name: `${getEmoji('settings', '🔒')} Verification`, value: verif, inline: true },
            )
            .setTimestamp();

        if (guild.bannerURL()) embed.setImage(guild.bannerURL({ size: 1024 }));

        const container = new ContainerBuilder()
            .setAccentColor(resolveColor(this.client.color.default))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`# ${getEmoji('server', '🌐')} ${guild.name}`),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`${getEmoji('crown', '👑')} **Owner:** ${owner ? owner.user.tag : 'Unknown'}`),
                new TextDisplayBuilder().setContent(`${getEmoji('calendar', '📅')} **Created:** ${created}`),
                new TextDisplayBuilder().setContent(`${getEmoji('info', 'ℹ️')} **ID:** \`${guild.id}\``),
                new TextDisplayBuilder().setContent(`\u200b`),
                new TextDisplayBuilder().setContent(`${getEmoji('members', '👥')} **Members:** ${formatNumber(guild.memberCount)} (${formatNumber(humans)} humans, ${formatNumber(bots)} bots)`),
                new TextDisplayBuilder().setContent(`${getEmoji('channel', '#')} **Channels:** ${textChannels} text, ${voiceChannels} voice, ${categories} categories`),
                new TextDisplayBuilder().setContent(`${getEmoji('role', '🎭')} **Roles:** ${roles}`),
                new TextDisplayBuilder().setContent(`${getEmoji('boost', '🚀')} **Boosts:** ${boosts} (Tier ${boostTier})`),
                new TextDisplayBuilder().setContent(`${getEmoji('settings', '🔒')} **Verification:** ${verif}`),
            );

        const message = [
            `${getEmoji('server', '🌐')} **${guild.name}**`,
            `${getEmoji('crown', '👑')} Owner: ${owner ? owner.user.tag : 'Unknown'}`,
            `${getEmoji('members', '👥')} Members: ${formatNumber(guild.memberCount)} (${formatNumber(humans)}/${formatNumber(bots)})`,
            `${getEmoji('channel', '#')} Channels: ${textChannels}T / ${voiceChannels}V`,
            `${getEmoji('role', '🎭')} Roles: ${roles}`,
            `${getEmoji('boost', '🚀')} Boosts: ${boosts} (Tier ${boostTier})`,
            `${getEmoji('calendar', '📅')} Created: ${created}`,
        ].join('\n');

        return ctx.sendTypedMessage({ embed, componentsv2: [container], message });
    }
}
