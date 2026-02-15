import Command from "../../structures/Command.js";
import { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize } from "discord.js";
import { getEmoji, StatusEmojis } from "../../utils/emoji.js";
import { resolveColor } from "../../utils/resolveColor.js";

export default class Kick extends Command {
    constructor(client) {
        super(client, {
            name: 'kick',
            description: {
                content: 'Kick a member from the server',
                usage: '<@user | id> [reason]',
                examples: ['kick @user Inappropriate behavior'],
            },
            aliases: ['boot'],
            category: 'moderation',
            cooldown: 5,
            args: true,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks', 'KickMembers'],
                user: ['KickMembers'],
            },
            slashCommand: true,
            options: [
                { name: "user", description: "The user to kick", type: 6, required: true },
                { name: "reason", description: "Reason for the kick", type: 3, required: false },
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

        if (member.id === ctx.author.id) {
            return ctx.sendTypedMessage({
                embed: this.client.embed().setColor(this.client.color.error).setDescription(`${StatusEmojis.error} You can't kick yourself.`),
                message: `${StatusEmojis.error} You can't kick yourself.`,
            });
        }

        if (!member.kickable) {
            return ctx.sendTypedMessage({
                embed: this.client.embed().setColor(this.client.color.error).setDescription(`${StatusEmojis.error} I cannot kick this member.`),
                message: `${StatusEmojis.error} I cannot kick this member.`,
            });
        }

        if (ctx.member.roles.highest.position <= member.roles.highest.position) {
            return ctx.sendTypedMessage({
                embed: this.client.embed().setColor(this.client.color.error).setDescription(`${StatusEmojis.error} You can't kick a member with equal or higher role.`),
                message: `${StatusEmojis.error} You can't kick a member with equal or higher role.`,
            });
        }

        const reason = ctx.isInteraction
            ? ctx.interaction.options.getString('reason') || 'No reason provided'
            : args.slice(1).join(' ') || 'No reason provided';

        await member.user.send({
            content: `${getEmoji('kick', '👢')} You have been **kicked** from **${ctx.guild.name}**\n**Reason:** ${reason}`
        }).catch(() => {});

        await member.kick(`${ctx.author.tag}: ${reason}`);

        this.client.logger.info(`[Kick] ${member.user.tag} kicked from ${ctx.guild.name} by ${ctx.author.tag}`);

        const embed = this.client.embed()
            .setColor(this.client.color.warn)
            .setTitle(`${getEmoji('kick', '👢')} Member Kicked`)
            .addFields(
                { name: `${getEmoji('member', '👤')} User`, value: `${member.user.tag} (${member.id})`, inline: true },
                { name: `${getEmoji('moderator', '🛡️')} Moderator`, value: ctx.author.tag, inline: true },
                { name: `${getEmoji('info', '📝')} Reason`, value: reason, inline: false },
            )
            .setTimestamp();

        const container = new ContainerBuilder()
            .setAccentColor(resolveColor(this.client.color.warn))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`# ${getEmoji('kick', '👢')} Member Kicked`),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`${getEmoji('member', '👤')} **User:** ${member.user.tag}`),
                new TextDisplayBuilder().setContent(`${getEmoji('moderator', '🛡️')} **Moderator:** ${ctx.author.tag}`),
                new TextDisplayBuilder().setContent(`${getEmoji('info', '📝')} **Reason:** ${reason}`),
            );

        const message = [
            `${getEmoji('kick', '👢')} **Member Kicked**`,
            `${getEmoji('member', '👤')} **User:** ${member.user.tag}`,
            `${getEmoji('moderator', '🛡️')} **Moderator:** ${ctx.author.tag}`,
            `${getEmoji('info', '📝')} **Reason:** ${reason}`,
        ].join('\n');

        return ctx.sendTypedMessage({ embed, componentsv2: [container], message });
    }
}
