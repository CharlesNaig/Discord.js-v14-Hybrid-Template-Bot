import Command from "../../structures/Command.js";
import { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize } from "discord.js";
import { getEmoji, StatusEmojis } from "../../utils/emoji.js";
import { resolveColor } from "../../utils/resolveColor.js";

export default class Ban extends Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            description: {
                content: 'Ban a member from the server',
                usage: '<@user | id> [reason]',
                examples: ['ban @user Spamming', 'ban 123456789 Breaking rules'],
            },
            aliases: ['banish'],
            category: 'moderation',
            cooldown: 5,
            args: true,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks', 'BanMembers'],
                user: ['BanMembers'],
            },
            slashCommand: true,
            options: [
                { name: "user", description: "The user to ban", type: 6, required: true },
                { name: "reason", description: "Reason for the ban", type: 3, required: false },
                { name: "days", description: "Days of messages to delete (0-7)", type: 4, required: false, min_value: 0, max_value: 7 },
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
                embed: this.client.embed().setColor(this.client.color.error).setDescription(`${StatusEmojis.error} You can't ban yourself.`),
                message: `${StatusEmojis.error} You can't ban yourself.`,
            });
        }

        if (!member.bannable) {
            return ctx.sendTypedMessage({
                embed: this.client.embed().setColor(this.client.color.error).setDescription(`${StatusEmojis.error} I cannot ban this member. They may have a higher role.`),
                message: `${StatusEmojis.error} I cannot ban this member.`,
            });
        }

        if (ctx.member.roles.highest.position <= member.roles.highest.position) {
            return ctx.sendTypedMessage({
                embed: this.client.embed().setColor(this.client.color.error).setDescription(`${StatusEmojis.error} You can't ban a member with equal or higher role.`),
                message: `${StatusEmojis.error} You can't ban a member with equal or higher role.`,
            });
        }

        const reason = ctx.isInteraction
            ? ctx.interaction.options.getString('reason') || 'No reason provided'
            : args.slice(1).join(' ') || 'No reason provided';

        const deleteMessageSeconds = ctx.isInteraction
            ? (ctx.interaction.options.getInteger('days') || 0) * 86400
            : 0;

        // DM user before banning
        await member.user.send({
            content: `${getEmoji('ban', '🔨')} You have been **banned** from **${ctx.guild.name}**\n**Reason:** ${reason}`
        }).catch(() => {});

        await member.ban({ reason: `${ctx.author.tag}: ${reason}`, deleteMessageSeconds });

        this.client.logger.info(`[Ban] ${member.user.tag} banned from ${ctx.guild.name} by ${ctx.author.tag}`);

        const embed = this.client.embed()
            .setColor(this.client.color.error)
            .setTitle(`${getEmoji('ban', '🔨')} Member Banned`)
            .addFields(
                { name: `${getEmoji('member', '👤')} User`, value: `${member.user.tag} (${member.id})`, inline: true },
                { name: `${getEmoji('moderator', '🛡️')} Moderator`, value: ctx.author.tag, inline: true },
                { name: `${getEmoji('info', '📝')} Reason`, value: reason, inline: false },
            )
            .setThumbnail(member.user.displayAvatarURL({ size: 128 }))
            .setTimestamp();

        const container = new ContainerBuilder()
            .setAccentColor(resolveColor(this.client.color.error))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`# ${getEmoji('ban', '🔨')} Member Banned`),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`${getEmoji('member', '👤')} **User:** ${member.user.tag} (${member.id})`),
                new TextDisplayBuilder().setContent(`${getEmoji('moderator', '🛡️')} **Moderator:** ${ctx.author.tag}`),
                new TextDisplayBuilder().setContent(`${getEmoji('info', '📝')} **Reason:** ${reason}`),
            );

        const message = [
            `${getEmoji('ban', '🔨')} **Member Banned**`,
            `${getEmoji('member', '👤')} **User:** ${member.user.tag}`,
            `${getEmoji('moderator', '🛡️')} **Moderator:** ${ctx.author.tag}`,
            `${getEmoji('info', '📝')} **Reason:** ${reason}`,
        ].join('\n');

        return ctx.sendTypedMessage({ embed, componentsv2: [container], message });
    }
}
