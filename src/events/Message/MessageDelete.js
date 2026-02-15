import Event from '../../structures/Event.js';
import { EmbedBuilder } from 'discord.js';
import { getEmoji } from '../../utils/emoji.js';
import { truncate } from '../../utils/formatters.js';

export default class MessageDelete extends Event {
    constructor(...args) {
        super(...args, {
            name: 'messageDelete'
        });
    }

    async run(message) {
        if (!message.guild || message.author?.bot) return;

        // ─── Snipe Storage ───
        if (message.content || message.attachments.size > 0) {
            this.client.snipes.set(message.channel.id, {
                content: message.content || null,
                author: message.author?.tag || 'Unknown',
                authorId: message.author?.id || null,
                avatar: message.author?.displayAvatarURL({ size: 128 }) || null,
                attachments: message.attachments.map(a => a.url),
                timestamp: Date.now(),
            });

            // Auto-clear snipes after 5 minutes
            setTimeout(() => {
                const snipe = this.client.snipes.get(message.channel.id);
                if (snipe && snipe.timestamp === Date.now()) {
                    this.client.snipes.delete(message.channel.id);
                }
            }, 5 * 60 * 1000);
        }

        // ─── Logging ───
        const settings = await this.client.getGuildSettings(message.guild.id);
        if (!settings?.logging?.enabled || !settings?.logging?.channel || !settings?.logging?.events?.messageDelete) return;

        const logChannel = message.guild.channels.cache.get(settings.logging.channel);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setColor(this.client.config.colors.error)
            .setTitle(`${getEmoji('delete', '🗑️')} Message Deleted`)
            .addFields(
                { name: 'Author', value: `${message.author?.toString() || 'Unknown'} (${message.author?.tag || 'Unknown'})`, inline: true },
                { name: 'Channel', value: `${message.channel.toString()}`, inline: true },
            )
            .setFooter({ text: `Message ID: ${message.id}` })
            .setTimestamp();

        if (message.content) {
            embed.setDescription(truncate(message.content, 1024));
        }

        if (message.attachments.size > 0) {
            embed.addFields({
                name: 'Attachments',
                value: message.attachments.map(a => `[${a.name}](${a.url})`).join('\n'),
                inline: false,
            });
        }

        await logChannel.send({ embeds: [embed] }).catch(() => {});
    }
}
