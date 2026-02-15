import Event from '../../structures/Event.js';
import { EmbedBuilder } from 'discord.js';
import { getEmoji } from '../../utils/emoji.js';

export default class RoleCreate extends Event {
    constructor(...args) {
        super(...args, {
            name: 'roleCreate'
        });
    }

    async run(role) {
        const settings = await this.client.getGuildSettings(role.guild.id);
        if (!settings?.logging?.enabled || !settings?.logging?.channel || !settings?.logging?.events?.roleCreate) return;

        const logChannel = role.guild.channels.cache.get(settings.logging.channel);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setColor(role.color || this.client.config.colors.success)
            .setTitle(`${getEmoji('create', '➕')} Role Created`)
            .addFields(
                { name: 'Name', value: role.toString(), inline: true },
                { name: 'Color', value: role.hexColor || 'Default', inline: true },
                { name: 'Mentionable', value: role.mentionable ? 'Yes' : 'No', inline: true },
                { name: 'Hoisted', value: role.hoist ? 'Yes' : 'No', inline: true },
            )
            .setFooter({ text: `Role ID: ${role.id}` })
            .setTimestamp();

        await logChannel.send({ embeds: [embed] }).catch(() => {});
    }
}
