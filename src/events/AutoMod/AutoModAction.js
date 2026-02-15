import Event from '../../structures/Event.js';
import { EmbedBuilder } from 'discord.js';
import { getEmoji } from '../../utils/emoji.js';

export default class AutoModAction extends Event {
    constructor(...args) {
        super(...args, {
            name: 'autoModerationActionExecution'
        });
    }

    async run(action) {
        const settings = await this.client.getGuildSettings(action.guild.id);
        if (!settings?.logging?.enabled || !settings?.logging?.channel) return;

        const logChannel = action.guild.channels.cache.get(settings.logging.channel);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setColor(this.client.config.colors.moderation)
            .setTitle(`${getEmoji('warning', '🛡️')} AutoMod Action`)
            .addFields(
                { name: 'User', value: `<@${action.userId}> (${action.userId})`, inline: true },
                { name: 'Rule', value: action.ruleTriggerType?.toString() || 'Unknown', inline: true },
                { name: 'Channel', value: action.channelId ? `<#${action.channelId}>` : 'Unknown', inline: true },
            )
            .setFooter({ text: `Rule ID: ${action.ruleId || 'N/A'}` })
            .setTimestamp();

        if (action.content) {
            embed.addFields({ name: 'Content', value: action.content.slice(0, 1024), inline: false });
        }

        if (action.matchedContent) {
            embed.addFields({ name: 'Matched Content', value: action.matchedContent.slice(0, 1024), inline: false });
        }

        if (action.matchedKeyword) {
            embed.addFields({ name: 'Keyword', value: action.matchedKeyword, inline: false });
        }

        await logChannel.send({ embeds: [embed] }).catch(() => {});
    }
}
