import Event from '../../structures/Event.js';
import { EmbedBuilder } from 'discord.js';
import { getEmoji } from '../../utils/emoji.js';

export default class GuildMemberUpdate extends Event {
    constructor(...args) {
        super(...args, {
            name: 'guildMemberUpdate'
        });
    }

    async run(oldMember, newMember) {
        const settings = await this.client.getGuildSettings(newMember.guild.id);
        if (!settings?.logging?.enabled || !settings?.logging?.channel || !settings?.logging?.events?.memberUpdate) return;

        const logChannel = newMember.guild.channels.cache.get(settings.logging.channel);
        if (!logChannel) return;

        const changes = [];

        // Nickname change
        if (oldMember.nickname !== newMember.nickname) {
            changes.push(`**Nickname:** \`${oldMember.nickname || 'None'}\` → \`${newMember.nickname || 'None'}\``);
        }

        // Role added
        const addedRoles = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id));
        if (addedRoles.size > 0) {
            changes.push(`**Role Added:** ${addedRoles.map(r => r.toString()).join(', ')}`);
        }

        // Role removed
        const removedRoles = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id));
        if (removedRoles.size > 0) {
            changes.push(`**Role Removed:** ${removedRoles.map(r => r.toString()).join(', ')}`);
        }

        // Timeout
        if (!oldMember.communicationDisabledUntilTimestamp && newMember.communicationDisabledUntilTimestamp) {
            changes.push(`**Timed out until:** <t:${Math.floor(newMember.communicationDisabledUntilTimestamp / 1000)}:F>`);
        } else if (oldMember.communicationDisabledUntilTimestamp && !newMember.communicationDisabledUntilTimestamp) {
            changes.push(`**Timeout removed**`);
        }

        if (changes.length === 0) return;

        const embed = new EmbedBuilder()
            .setColor(this.client.config.colors.logging)
            .setTitle(`${getEmoji('update', '📝')} Member Updated`)
            .setDescription(`${newMember.toString()} (${newMember.user.tag})\n\n${changes.join('\n')}`)
            .setThumbnail(newMember.user.displayAvatarURL({ size: 128 }))
            .setFooter({ text: `ID: ${newMember.id}` })
            .setTimestamp();

        await logChannel.send({ embeds: [embed] }).catch(() => {});
    }
}
