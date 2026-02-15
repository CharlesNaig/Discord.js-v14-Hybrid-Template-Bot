import Event from '../../structures/Event.js';
import { EmbedBuilder } from 'discord.js';
import { getEmoji } from '../../utils/emoji.js';

export default class GuildMemberRemove extends Event {
    constructor(...args) {
        super(...args, {
            name: 'guildMemberRemove'
        });
    }

    async run(member) {
        const settings = await this.client.getGuildSettings(member.guild.id);
        if (!settings) return;

        // ─── Farewell Message ───
        if (settings.farewell?.enabled && settings.farewell?.channel) {
            const channel = member.guild.channels.cache.get(settings.farewell.channel);
            if (!channel) return;

            const farewellMsg = (settings.farewell.message || 'Goodbye {user}!')
                .replace(/{user}/g, member.user.username)
                .replace(/{username}/g, member.user.username)
                .replace(/{server}/g, member.guild.name)
                .replace(/{membercount}/g, member.guild.memberCount.toString());

            const embed = new EmbedBuilder()
                .setColor(this.client.config.colors.farewell)
                .setTitle(`${getEmoji('member', '👋')} Goodbye!`)
                .setDescription(farewellMsg)
                .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
                .setFooter({ text: `Now at ${member.guild.memberCount} members` })
                .setTimestamp();

            await channel.send({ embeds: [embed] }).catch(() => {});
        }

        // ─── Logging ───
        if (settings.logging?.enabled && settings.logging?.channel && settings.logging?.events?.memberLeave) {
            const logChannel = member.guild.channels.cache.get(settings.logging.channel);
            if (!logChannel) return;

            const roles = member.roles.cache
                .filter(r => r.id !== member.guild.id)
                .map(r => r.toString())
                .join(', ') || 'None';

            const embed = new EmbedBuilder()
                .setColor(this.client.config.colors.error)
                .setTitle(`${getEmoji('member', '📤')} Member Left`)
                .setDescription(`${member.user.tag}`)
                .addFields(
                    { name: 'Joined Server', value: member.joinedAt ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'Unknown', inline: true },
                    { name: 'Member Count', value: `${member.guild.memberCount}`, inline: true },
                    { name: 'Roles', value: roles.length > 1024 ? roles.slice(0, 1020) + '...' : roles, inline: false },
                )
                .setThumbnail(member.user.displayAvatarURL({ size: 128 }))
                .setFooter({ text: `ID: ${member.id}` })
                .setTimestamp();

            await logChannel.send({ embeds: [embed] }).catch(() => {});
        }
    }
}
