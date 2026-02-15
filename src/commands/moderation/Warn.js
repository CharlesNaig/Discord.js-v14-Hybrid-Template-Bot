import Command from "../../structures/Command.js";
import Warning from "../../schemas/Warning.js";
import { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize } from "discord.js";
import { getEmoji, StatusEmojis } from "../../utils/emoji.js";
import { resolveColor } from "../../utils/resolveColor.js";

export default class Warn extends Command {
    constructor(client) {
        super(client, {
            name: 'warn',
            description: {
                content: 'Warn a member',
                usage: '<@user | id> <reason>',
                examples: ['warn @user Breaking rules'],
            },
            category: 'moderation',
            cooldown: 5,
            args: true,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: ['ModerateMembers'],
            },
            slashCommand: true,
            options: [
                { name: "user", description: "The user to warn", type: 6, required: true },
                { name: "reason", description: "Reason for the warning", type: 3, required: true },
            ],
        });
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

        if (member.user.bot) {
            return ctx.sendTypedMessage({
                embed: this.client.embed().setColor(this.client.color.error).setDescription(`${StatusEmojis.error} You can't warn a bot.`),
                message: `${StatusEmojis.error} You can't warn a bot.`,
            });
        }

        const reason = ctx.isInteraction
            ? ctx.interaction.options.getString('reason')
            : args.slice(1).join(' ');

        if (!reason) {
            return ctx.sendTypedMessage({
                embed: this.client.embed().setColor(this.client.color.error).setDescription(`${StatusEmojis.error} Please provide a reason.`),
                message: `${StatusEmojis.error} Please provide a reason.`,
            });
        }

        const warning = new Warning({
            guildId: ctx.guild.id,
            userId: member.id,
            moderatorId: ctx.author.id,
            reason,
        });
        await warning.save();

        const totalWarnings = await Warning.countDocuments({ guildId: ctx.guild.id, userId: member.id });

        // DM user
        await member.user.send({
            content: `${getEmoji('warn', '⚠️')} You have been **warned** in **${ctx.guild.name}**\n**Reason:** ${reason}\n**Total Warnings:** ${totalWarnings}`
        }).catch(() => {});

        this.client.logger.info(`[Warn] ${member.user.tag} warned in ${ctx.guild.name} by ${ctx.author.tag}`);

        const embed = this.client.embed()
            .setColor(this.client.color.warn)
            .setTitle(`${getEmoji('warn', '⚠️')} Member Warned`)
            .addFields(
                { name: `${getEmoji('member', '👤')} User`, value: `${member.user.tag}`, inline: true },
                { name: `${getEmoji('moderator', '🛡️')} Moderator`, value: ctx.author.tag, inline: true },
                { name: `${getEmoji('info', '📝')} Reason`, value: reason, inline: false },
                { name: `${getEmoji('warn', '⚠️')} Total Warnings`, value: `${totalWarnings}`, inline: true },
            )
            .setTimestamp();

        const container = new ContainerBuilder()
            .setAccentColor(resolveColor(this.client.color.warn))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`# ${getEmoji('warn', '⚠️')} Member Warned`),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`${getEmoji('member', '👤')} **User:** ${member.user.tag}`),
                new TextDisplayBuilder().setContent(`${getEmoji('moderator', '🛡️')} **Moderator:** ${ctx.author.tag}`),
                new TextDisplayBuilder().setContent(`${getEmoji('info', '📝')} **Reason:** ${reason}`),
                new TextDisplayBuilder().setContent(`${getEmoji('warn', '⚠️')} **Total Warnings:** ${totalWarnings}`),
            );

        const message = [
            `${getEmoji('warn', '⚠️')} **Member Warned**`,
            `${getEmoji('member', '👤')} **User:** ${member.user.tag}`,
            `${getEmoji('info', '📝')} **Reason:** ${reason}`,
            `${getEmoji('warn', '⚠️')} **Total Warnings:** ${totalWarnings}`,
        ].join('\n');

        return ctx.sendTypedMessage({ embed, componentsv2: [container], message });
    }
}
