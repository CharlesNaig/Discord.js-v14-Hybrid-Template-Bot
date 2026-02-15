import Event from '../../structures/Event.js';
import { EmbedBuilder } from 'discord.js';
import { getEmoji } from '../../utils/emoji.js';

export default class VoiceStateUpdate extends Event {
    constructor(...args) {
        super(...args, {
            name: 'voiceStateUpdate'
        });
    }

    async run(oldState, newState) {
        const guild = newState.guild || oldState.guild;
        const settings = await this.client.getGuildSettings(guild.id);

        // ─── 24/7 Voice Reconnect ───
        if (settings?.voiceSettings?.twentyFourSeven && oldState.member?.id === this.client.user.id) {
            if (oldState.channelId && !newState.channelId && settings.voiceSettings.voiceChannel) {
                try {
                    const channel = guild.channels.cache.get(settings.voiceSettings.voiceChannel);
                    if (channel) {
                        this.client.logger.info(`[24/7] Reconnecting to ${channel.name} in ${guild.name}`);
                    }
                } catch (error) {
                    this.client.logger.error(`[24/7] Reconnect failed: ${error.message}`);
                }
            }
        }

        // ─── Voice Logging ───
        if (!settings?.logging?.enabled || !settings?.logging?.channel || !settings?.logging?.events?.voiceUpdate) return;

        const logChannel = guild.channels.cache.get(settings.logging.channel);
        if (!logChannel) return;

        const member = newState.member || oldState.member;
        if (!member || member.user.bot) return;

        let embed = null;

        // Joined a voice channel
        if (!oldState.channelId && newState.channelId) {
            embed = new EmbedBuilder()
                .setColor(this.client.config.colors.success)
                .setTitle(`${getEmoji('voice', '🔊')} Voice Channel Joined`)
                .setDescription(`${member.toString()} joined ${newState.channel.toString()}`)
                .setFooter({ text: `ID: ${member.id}` })
                .setTimestamp();
        }

        // Left a voice channel
        else if (oldState.channelId && !newState.channelId) {
            embed = new EmbedBuilder()
                .setColor(this.client.config.colors.error)
                .setTitle(`${getEmoji('voice', '🔇')} Voice Channel Left`)
                .setDescription(`${member.toString()} left ${oldState.channel?.toString() || 'Unknown'}`)
                .setFooter({ text: `ID: ${member.id}` })
                .setTimestamp();
        }

        // Moved between voice channels
        else if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
            embed = new EmbedBuilder()
                .setColor(this.client.config.colors.voice)
                .setTitle(`${getEmoji('voice', '🔀')} Voice Channel Moved`)
                .setDescription(`${member.toString()} moved from ${oldState.channel?.toString() || 'Unknown'} → ${newState.channel.toString()}`)
                .setFooter({ text: `ID: ${member.id}` })
                .setTimestamp();
        }

        // Server mute/deafen (moderation action)
        else if (oldState.serverMute !== newState.serverMute) {
            embed = new EmbedBuilder()
                .setColor(this.client.config.colors.moderation)
                .setTitle(`${getEmoji('mute', '🔇')} Server ${newState.serverMute ? 'Muted' : 'Unmuted'}`)
                .setDescription(`${member.toString()} was ${newState.serverMute ? 'server muted' : 'server unmuted'}`)
                .setFooter({ text: `ID: ${member.id}` })
                .setTimestamp();
        }

        else if (oldState.serverDeaf !== newState.serverDeaf) {
            embed = new EmbedBuilder()
                .setColor(this.client.config.colors.moderation)
                .setTitle(`${getEmoji('mute', '🔇')} Server ${newState.serverDeaf ? 'Deafened' : 'Undeafened'}`)
                .setDescription(`${member.toString()} was ${newState.serverDeaf ? 'server deafened' : 'server undeafened'}`)
                .setFooter({ text: `ID: ${member.id}` })
                .setTimestamp();
        }

        if (embed) {
            await logChannel.send({ embeds: [embed] }).catch(() => {});
        }
    }
}
