import Event from '../../structures/Event.js';
import { EmbedBuilder, AuditLogEvent } from 'discord.js';
import { getEmoji } from '../../utils/emoji.js';

export default class GuildBanRemove extends Event {
    constructor(...args) {
        super(...args, {
            name: 'guildBanRemove'
        });
    }

    async run(ban) {
        const settings = await this.client.getGuildSettings(ban.guild.id);
        if (!settings?.logging?.enabled || !settings?.logging?.channel || !settings?.logging?.events?.banRemove) return;

        const logChannel = ban.guild.channels.cache.get(settings.logging.channel);
        if (!logChannel) return;

        let moderator = 'Unknown';
        try {
            const auditLogs = await ban.guild.fetchAuditLogs({ type: AuditLogEvent.MemberBanRemove, limit: 1 });
            const entry = auditLogs.entries.first();
            if (entry && entry.target.id === ban.user.id && (Date.now() - entry.createdTimestamp) < 5000) {
                moderator = entry.executor.toString();
            }
        } catch { /* audit log permission issue */ }

        const embed = new EmbedBuilder()
            .setColor(this.client.config.colors.success)
            .setTitle(`${getEmoji('ban', '🔓')} Member Unbanned`)
            .setDescription(`${ban.user.tag}`)
            .addFields(
                { name: 'User', value: `${ban.user.toString()} (${ban.user.id})`, inline: true },
                { name: 'Moderator', value: `${moderator}`, inline: true },
            )
            .setThumbnail(ban.user.displayAvatarURL({ size: 128 }))
            .setFooter({ text: `ID: ${ban.user.id}` })
            .setTimestamp();

        await logChannel.send({ embeds: [embed] }).catch(() => {});
    }
}
