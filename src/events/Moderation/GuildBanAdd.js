import Event from '../../structures/Event.js';
import { EmbedBuilder, AuditLogEvent } from 'discord.js';
import { getEmoji } from '../../utils/emoji.js';

export default class GuildBanAdd extends Event {
    constructor(...args) {
        super(...args, {
            name: 'guildBanAdd'
        });
    }

    async run(ban) {
        const settings = await this.client.getGuildSettings(ban.guild.id);
        if (!settings?.logging?.enabled || !settings?.logging?.channel || !settings?.logging?.events?.banAdd) return;

        const logChannel = ban.guild.channels.cache.get(settings.logging.channel);
        if (!logChannel) return;

        // Try to get the moderator from audit log
        let moderator = 'Unknown';
        let reason = ban.reason || 'No reason provided';
        try {
            const auditLogs = await ban.guild.fetchAuditLogs({ type: AuditLogEvent.MemberBanAdd, limit: 1 });
            const entry = auditLogs.entries.first();
            if (entry && entry.target.id === ban.user.id && (Date.now() - entry.createdTimestamp) < 5000) {
                moderator = entry.executor.toString();
                reason = entry.reason || reason;
            }
        } catch { /* audit log permission may not be available */ }

        const embed = new EmbedBuilder()
            .setColor(this.client.config.colors.moderation)
            .setTitle(`${getEmoji('ban', '🔨')} Member Banned`)
            .setDescription(`${ban.user.tag}`)
            .addFields(
                { name: 'User', value: `${ban.user.toString()} (${ban.user.id})`, inline: true },
                { name: 'Moderator', value: `${moderator}`, inline: true },
                { name: 'Reason', value: reason, inline: false },
            )
            .setThumbnail(ban.user.displayAvatarURL({ size: 128 }))
            .setFooter({ text: `ID: ${ban.user.id}` })
            .setTimestamp();

        await logChannel.send({ embeds: [embed] }).catch(() => {});
    }
}
