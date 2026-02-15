import Event from '../../structures/Event.js';
import { EmbedBuilder } from 'discord.js';
import { getEmoji } from '../../utils/emoji.js';
import { truncate } from '../../utils/formatters.js';

export default class MessageUpdate extends Event {
    constructor(...args) {
        super(...args, {
            name: 'messageUpdate'
        });
    }

    async run(oldMessage, newMessage) {
        if (!newMessage.guild || newMessage.author?.bot) return;
        if (oldMessage.content === newMessage.content) return;
        if (!oldMessage.content && !newMessage.content) return;

        const settings = await this.client.getGuildSettings(newMessage.guild.id);
        if (!settings?.logging?.enabled || !settings?.logging?.channel || !settings?.logging?.events?.messageUpdate) return;

        const logChannel = newMessage.guild.channels.cache.get(settings.logging.channel);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setColor(this.client.config.colors.logging)
            .setTitle(`${getEmoji('edit', '📝')} Message Edited`)
            .setDescription(`[Jump to message](${newMessage.url})`)
            .addFields(
                { name: 'Author', value: `${newMessage.author?.toString() || 'Unknown'} (${newMessage.author?.tag || 'Unknown'})`, inline: true },
                { name: 'Channel', value: `${newMessage.channel.toString()}`, inline: true },
                { name: 'Before', value: truncate(oldMessage.content || '*No content*', 1024), inline: false },
                { name: 'After', value: truncate(newMessage.content || '*No content*', 1024), inline: false },
            )
            .setFooter({ text: `Message ID: ${newMessage.id}` })
            .setTimestamp();

        await logChannel.send({ embeds: [embed] }).catch(() => {});
    }
}
