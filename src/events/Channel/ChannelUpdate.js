import Event from '../../structures/Event.js';
import { EmbedBuilder } from 'discord.js';
import { getEmoji } from '../../utils/emoji.js';

export default class ChannelUpdate extends Event {
    constructor(...args) {
        super(...args, {
            name: 'channelUpdate'
        });
    }

    async run(oldChannel, newChannel) {
        if (!newChannel.guild) return;

        const settings = await this.client.getGuildSettings(newChannel.guild.id);
        if (!settings?.logging?.enabled || !settings?.logging?.channel || !settings?.logging?.events?.channelUpdate) return;

        const logChannel = newChannel.guild.channels.cache.get(settings.logging.channel);
        if (!logChannel) return;

        const changes = [];

        if (oldChannel.name !== newChannel.name) {
            changes.push(`**Name:** \`${oldChannel.name}\` → \`${newChannel.name}\``);
        }
        if (oldChannel.topic !== newChannel.topic) {
            changes.push(`**Topic:** \`${oldChannel.topic || 'None'}\` → \`${newChannel.topic || 'None'}\``);
        }
        if (oldChannel.nsfw !== newChannel.nsfw) {
            changes.push(`**NSFW:** \`${oldChannel.nsfw}\` → \`${newChannel.nsfw}\``);
        }
        if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
            changes.push(`**Slowmode:** \`${oldChannel.rateLimitPerUser}s\` → \`${newChannel.rateLimitPerUser}s\``);
        }
        if (oldChannel.parentId !== newChannel.parentId) {
            changes.push(`**Category:** \`${oldChannel.parent?.name || 'None'}\` → \`${newChannel.parent?.name || 'None'}\``);
        }
        if (oldChannel.bitrate !== newChannel.bitrate) {
            changes.push(`**Bitrate:** \`${oldChannel.bitrate / 1000}kbps\` → \`${newChannel.bitrate / 1000}kbps\``);
        }
        if (oldChannel.userLimit !== newChannel.userLimit) {
            changes.push(`**User Limit:** \`${oldChannel.userLimit || '∞'}\` → \`${newChannel.userLimit || '∞'}\``);
        }

        if (changes.length === 0) return;

        const embed = new EmbedBuilder()
            .setColor(this.client.config.colors.logging)
            .setTitle(`${getEmoji('update', '📝')} Channel Updated`)
            .setDescription(`${newChannel.toString()}\n\n${changes.join('\n')}`)
            .setFooter({ text: `Channel ID: ${newChannel.id}` })
            .setTimestamp();

        await logChannel.send({ embeds: [embed] }).catch(() => {});
    }
}
