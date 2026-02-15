import Event from '../../structures/Event.js';
import { EmbedBuilder, AuditLogEvent } from 'discord.js';
import { getEmoji } from '../../utils/emoji.js';

export default class GuildUpdate extends Event {
    constructor(...args) {
        super(...args, {
            name: 'guildUpdate'
        });
    }

    async run(oldGuild, newGuild) {
        const settings = await this.client.getGuildSettings(newGuild.id);
        if (!settings?.logging?.enabled || !settings?.logging?.channel) return;

        const logChannel = newGuild.channels.cache.get(settings.logging.channel);
        if (!logChannel) return;

        const changes = [];
        if (oldGuild.name !== newGuild.name) changes.push(`**Name:** \`${oldGuild.name}\` → \`${newGuild.name}\``);
        if (oldGuild.iconURL() !== newGuild.iconURL()) changes.push(`**Icon:** Changed`);
        if (oldGuild.bannerURL() !== newGuild.bannerURL()) changes.push(`**Banner:** Changed`);
        if (oldGuild.verificationLevel !== newGuild.verificationLevel) changes.push(`**Verification Level:** \`${oldGuild.verificationLevel}\` → \`${newGuild.verificationLevel}\``);

        if (changes.length === 0) return;

        const embed = new EmbedBuilder()
            .setColor(this.client.config.colors.logging)
            .setTitle(`${getEmoji('update', '🔄')} Server Updated`)
            .setDescription(changes.join('\n'))
            .setTimestamp();

        await logChannel.send({ embeds: [embed] }).catch(() => {});
    }
}
