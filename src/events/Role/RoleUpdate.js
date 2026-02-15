import Event from '../../structures/Event.js';
import { EmbedBuilder } from 'discord.js';
import { getEmoji } from '../../utils/emoji.js';

export default class RoleUpdate extends Event {
    constructor(...args) {
        super(...args, {
            name: 'roleUpdate'
        });
    }

    async run(oldRole, newRole) {
        const settings = await this.client.getGuildSettings(newRole.guild.id);
        if (!settings?.logging?.enabled || !settings?.logging?.channel || !settings?.logging?.events?.roleUpdate) return;

        const logChannel = newRole.guild.channels.cache.get(settings.logging.channel);
        if (!logChannel) return;

        const changes = [];

        if (oldRole.name !== newRole.name) {
            changes.push(`**Name:** \`${oldRole.name}\` → \`${newRole.name}\``);
        }
        if (oldRole.hexColor !== newRole.hexColor) {
            changes.push(`**Color:** \`${oldRole.hexColor}\` → \`${newRole.hexColor}\``);
        }
        if (oldRole.hoist !== newRole.hoist) {
            changes.push(`**Hoisted:** \`${oldRole.hoist}\` → \`${newRole.hoist}\``);
        }
        if (oldRole.mentionable !== newRole.mentionable) {
            changes.push(`**Mentionable:** \`${oldRole.mentionable}\` → \`${newRole.mentionable}\``);
        }
        if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
            const added = newRole.permissions.toArray().filter(p => !oldRole.permissions.has(p));
            const removed = oldRole.permissions.toArray().filter(p => !newRole.permissions.has(p));
            if (added.length > 0) changes.push(`**Permissions Added:** \`${added.join(', ')}\``);
            if (removed.length > 0) changes.push(`**Permissions Removed:** \`${removed.join(', ')}\``);
        }

        if (changes.length === 0) return;

        const embed = new EmbedBuilder()
            .setColor(newRole.color || this.client.config.colors.logging)
            .setTitle(`${getEmoji('update', '📝')} Role Updated`)
            .setDescription(`${newRole.toString()}\n\n${changes.join('\n')}`)
            .setFooter({ text: `Role ID: ${newRole.id}` })
            .setTimestamp();

        await logChannel.send({ embeds: [embed] }).catch(() => {});
    }
}
