import Event from '../../structures/Event.js';
import { EmbedBuilder } from 'discord.js';
import { getEmoji } from '../../utils/emoji.js';

export default class GuildMemberAdd extends Event {
    constructor(...args) {
        super(...args, {
            name: 'guildMemberAdd'
        });
    }

    async run(member) {
        const settings = await this.client.getGuildSettings(member.guild.id);
        if (!settings) return;

        // ─── Auto Role ───
        if (settings.autoRole?.enabled && settings.autoRole?.roles?.length > 0) {
            try {
                for (const roleId of settings.autoRole.roles) {
                    const role = member.guild.roles.cache.get(roleId);
                    if (role && role.editable) {
                        await member.roles.add(role);
                    }
                }
            } catch (error) {
                this.client.logger.error(`[AutoRole] Failed to add roles for ${member.user.tag}: ${error.message}`);
            }
        }

        // ─── Welcome Message ───
        if (settings.welcome?.enabled && settings.welcome?.channel) {
            const channel = member.guild.channels.cache.get(settings.welcome.channel);
            if (!channel) return;

            const welcomeMsg = (settings.welcome.message || 'Welcome {user} to {server}!')
                .replace(/{user}/g, member.toString())
                .replace(/{username}/g, member.user.username)
                .replace(/{server}/g, member.guild.name)
                .replace(/{membercount}/g, member.guild.memberCount.toString());

            const embed = new EmbedBuilder()
                .setColor(this.client.config.colors.welcome)
                .setTitle(`${getEmoji('member', '👋')} Welcome!`)
                .setDescription(welcomeMsg)
                .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
                .setFooter({ text: `Member #${member.guild.memberCount}` })
                .setTimestamp();

            await channel.send({ embeds: [embed] }).catch(() => {});
        }

        // ─── Logging ───
        if (settings.logging?.enabled && settings.logging?.channel && settings.logging?.events?.memberJoin) {
            const logChannel = member.guild.channels.cache.get(settings.logging.channel);
            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setColor(this.client.config.colors.success)
                .setTitle(`${getEmoji('member', '📥')} Member Joined`)
                .setDescription(`${member.toString()} (${member.user.tag})`)
                .addFields(
                    { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                    { name: 'Member Count', value: `${member.guild.memberCount}`, inline: true },
                )
                .setThumbnail(member.user.displayAvatarURL({ size: 128 }))
                .setFooter({ text: `ID: ${member.id}` })
                .setTimestamp();

            await logChannel.send({ embeds: [embed] }).catch(() => {});
        }
    }
}
