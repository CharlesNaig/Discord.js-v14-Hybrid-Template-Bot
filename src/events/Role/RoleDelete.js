import Event from '../../structures/Event.js';
import { EmbedBuilder } from 'discord.js';
import { getEmoji } from '../../utils/emoji.js';

export default class RoleDelete extends Event {
    constructor(...args) {
        super(...args, {
            name: 'roleDelete'
        });
    }

    async run(role) {
        const settings = await this.client.getGuildSettings(role.guild.id);
        if (!settings?.logging?.enabled || !settings?.logging?.channel || !settings?.logging?.events?.roleDelete) return;

        const logChannel = role.guild.channels.cache.get(settings.logging.channel);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setColor(this.client.config.colors.error)
            .setTitle(`${getEmoji('delete', '🗑️')} Role Deleted`)
            .addFields(
                { name: 'Name', value: `@${role.name}`, inline: true },
                { name: 'Color', value: role.hexColor || 'Default', inline: true },
                { name: 'Members', value: `${role.members.size}`, inline: true },
            )
            .setFooter({ text: `Role ID: ${role.id}` })
            .setTimestamp();

        await logChannel.send({ embeds: [embed] }).catch(() => {});
    }
}
