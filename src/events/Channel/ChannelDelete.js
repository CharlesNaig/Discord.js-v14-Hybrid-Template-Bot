import Event from '../../structures/Event.js';
import { EmbedBuilder, ChannelType } from 'discord.js';
import { getEmoji } from '../../utils/emoji.js';

export default class ChannelDelete extends Event {
    constructor(...args) {
        super(...args, {
            name: 'channelDelete'
        });
    }

    async run(channel) {
        if (!channel.guild) return;

        const settings = await this.client.getGuildSettings(channel.guild.id);
        if (!settings?.logging?.enabled || !settings?.logging?.channel || !settings?.logging?.events?.channelDelete) return;

        const logChannel = channel.guild.channels.cache.get(settings.logging.channel);
        if (!logChannel || logChannel.id === channel.id) return;

        const typeNames = {
            [ChannelType.GuildText]: 'Text',
            [ChannelType.GuildVoice]: 'Voice',
            [ChannelType.GuildCategory]: 'Category',
            [ChannelType.GuildAnnouncement]: 'Announcement',
            [ChannelType.GuildStageVoice]: 'Stage',
            [ChannelType.GuildForum]: 'Forum',
        };

        const embed = new EmbedBuilder()
            .setColor(this.client.config.colors.error)
            .setTitle(`${getEmoji('delete', '🗑️')} Channel Deleted`)
            .addFields(
                { name: 'Name', value: `#${channel.name}`, inline: true },
                { name: 'Type', value: typeNames[channel.type] || 'Unknown', inline: true },
                { name: 'Category', value: channel.parent?.name || 'None', inline: true },
            )
            .setFooter({ text: `Channel ID: ${channel.id}` })
            .setTimestamp();

        await logChannel.send({ embeds: [embed] }).catch(() => {});
    }
}
