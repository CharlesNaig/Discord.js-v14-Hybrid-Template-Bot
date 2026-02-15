import Command from "../../structures/Command.js";
import { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize } from "discord.js";
import { getEmoji, StatusEmojis } from "../../utils/emoji.js";
import { resolveColor } from "../../utils/resolveColor.js";

export default class Timeout extends Command {
    constructor(client) {
        super(client, {
            name: 'timeout',
            description: {
                content: 'Timeout a member for a specified duration',
                usage: '<@user | id> <duration> [reason]',
                examples: ['timeout @user 10m Spamming', 'timeout @user 1h Being disruptive'],
            },
            aliases: ['mute', 'to'],
            category: 'moderation',
            cooldown: 5,
            args: true,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks', 'ModerateMembers'],
                user: ['ModerateMembers'],
            },
            slashCommand: true,
            options: [
                { name: "user", description: "The user to timeout", type: 6, required: true },
                { name: "duration", description: "Duration (e.g. 10m, 1h, 1d)", type: 3, required: true },
                { name: "reason", description: "Reason for the timeout", type: 3, required: false },
            ],
        });
    }

    parseDuration(str) {
        const match = str.match(/^(\d+)(s|m|h|d)$/i);
        if (!match) return null;
        const num = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
        const ms = num * multipliers[unit];
        // Max timeout is 28 days
        if (ms > 28 * 86400000) return null;
        return ms;
    }

    formatDuration(ms) {
        if (ms >= 86400000) return `${Math.floor(ms / 86400000)} day(s)`;
        if (ms >= 3600000) return `${Math.floor(ms / 3600000)} hour(s)`;
        if (ms >= 60000) return `${Math.floor(ms / 60000)} minute(s)`;
        return `${Math.floor(ms / 1000)} second(s)`;
    }

    async run(ctx, args) {
        const member = ctx.isInteraction
            ? ctx.interaction.options.getMember('user')
            : ctx.message.mentions.members.first() || await ctx.guild.members.fetch(args[0]).catch(() => null);

        if (!member) {
            return ctx.sendTypedMessage({
                embed: this.client.embed().setColor(this.client.color.error).setDescription(`${StatusEmojis.error} User not found.`),
                message: `${StatusEmojis.error} User not found.`,
            });
        }

        if (!member.moderatable) {
            return ctx.sendTypedMessage({
                embed: this.client.embed().setColor(this.client.color.error).setDescription(`${StatusEmojis.error} I cannot timeout this member.`),
                message: `${StatusEmojis.error} I cannot timeout this member.`,
            });
        }

        const durationStr = ctx.isInteraction
            ? ctx.interaction.options.getString('duration')
            : args[1];

        const duration = this.parseDuration(durationStr || '');
        if (!duration) {
            return ctx.sendTypedMessage({
                embed: this.client.embed().setColor(this.client.color.error).setDescription(`${StatusEmojis.error} Invalid duration. Use: \`10s\`, \`5m\`, \`1h\`, \`1d\` (max 28d)`),
                message: `${StatusEmojis.error} Invalid duration. Use: \`10s\`, \`5m\`, \`1h\`, \`1d\` (max 28d)`,
            });
        }

        const reason = ctx.isInteraction
            ? ctx.interaction.options.getString('reason') || 'No reason provided'
            : args.slice(2).join(' ') || 'No reason provided';

        await member.timeout(duration, `${ctx.author.tag}: ${reason}`);

        this.client.logger.info(`[Timeout] ${member.user.tag} timed out in ${ctx.guild.name} by ${ctx.author.tag} for ${this.formatDuration(duration)}`);

        const durationText = this.formatDuration(duration);

        const embed = this.client.embed()
            .setColor(this.client.color.warn)
            .setTitle(`${getEmoji('timeout', '⏰')} Member Timed Out`)
            .addFields(
                { name: `${getEmoji('member', '👤')} User`, value: `${member.user.tag}`, inline: true },
                { name: `${getEmoji('moderator', '🛡️')} Moderator`, value: ctx.author.tag, inline: true },
                { name: `${getEmoji('clock', '⏱️')} Duration`, value: durationText, inline: true },
                { name: `${getEmoji('info', '📝')} Reason`, value: reason, inline: false },
            )
            .setTimestamp();

        const container = new ContainerBuilder()
            .setAccentColor(resolveColor(this.client.color.warn))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`# ${getEmoji('timeout', '⏰')} Member Timed Out`),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`${getEmoji('member', '👤')} **User:** ${member.user.tag}`),
                new TextDisplayBuilder().setContent(`${getEmoji('moderator', '🛡️')} **Moderator:** ${ctx.author.tag}`),
                new TextDisplayBuilder().setContent(`${getEmoji('clock', '⏱️')} **Duration:** ${durationText}`),
                new TextDisplayBuilder().setContent(`${getEmoji('info', '📝')} **Reason:** ${reason}`),
            );

        const message = [
            `${getEmoji('timeout', '⏰')} **Member Timed Out**`,
            `${getEmoji('member', '👤')} **User:** ${member.user.tag}`,
            `${getEmoji('clock', '⏱️')} **Duration:** ${durationText}`,
            `${getEmoji('info', '📝')} **Reason:** ${reason}`,
        ].join('\n');

        return ctx.sendTypedMessage({ embed, componentsv2: [container], message });
    }
}
