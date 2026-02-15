import Command from "../../structures/Command.js";
import Warning from "../../schemas/Warning.js";
import { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize } from "discord.js";
import { getEmoji, StatusEmojis } from "../../utils/emoji.js";
import { resolveColor } from "../../utils/resolveColor.js";

export default class Warnings extends Command {
    constructor(client) {
        super(client, {
            name: 'warnings',
            description: {
                content: 'View warnings for a member',
                usage: '<@user | id>',
                examples: ['warnings @user', 'warnings 123456789'],
            },
            aliases: ['warns', 'infractions'],
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
                { name: "user", description: "The user to check warnings for", type: 6, required: true },
            ],
        });
    }

    async run(ctx, args) {
        const user = ctx.isInteraction
            ? ctx.interaction.options.getUser('user')
            : ctx.message.mentions.users.first() || await this.client.users.fetch(args[0]).catch(() => null);

        if (!user) {
            return ctx.sendTypedMessage({
                embed: this.client.embed().setColor(this.client.color.error).setDescription(`${StatusEmojis.error} User not found.`),
                message: `${StatusEmojis.error} User not found.`,
            });
        }

        const warnings = await Warning.find({ guildId: ctx.guild.id, userId: user.id }).sort({ createdAt: -1 }).limit(10);

        if (warnings.length === 0) {
            return ctx.sendTypedMessage({
                embed: this.client.embed().setColor(this.client.color.info).setDescription(`${StatusEmojis.info} ${user.tag} has no warnings.`),
                message: `${StatusEmojis.info} ${user.tag} has no warnings.`,
            });
        }

        const total = await Warning.countDocuments({ guildId: ctx.guild.id, userId: user.id });

        const warnList = warnings.map((w, i) => {
            const mod = `<@${w.moderatorId}>`;
            const date = `<t:${Math.floor(w.createdAt.getTime() / 1000)}:R>`;
            return `**${i + 1}.** ${w.reason}\n   ${getEmoji('moderator', '🛡️')} ${mod} • ${date}`;
        }).join('\n\n');

        // ─── Embed ───
        const embed = this.client.embed()
            .setColor(this.client.color.warn)
            .setTitle(`${getEmoji('warn', '⚠️')} Warnings for ${user.tag}`)
            .setDescription(warnList)
            .setFooter({ text: `Total: ${total} warning(s)${total > 10 ? ' — Showing latest 10' : ''}` })
            .setThumbnail(user.displayAvatarURL({ size: 128 }))
            .setTimestamp();

        // ─── V2 ───
        const container = new ContainerBuilder()
            .setAccentColor(resolveColor(this.client.color.warn))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`# ${getEmoji('warn', '⚠️')} Warnings for ${user.tag}`),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small));

        warnings.forEach((w, i) => {
            const date = `<t:${Math.floor(w.createdAt.getTime() / 1000)}:R>`;
            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`**${i + 1}.** ${w.reason}\n${getEmoji('moderator', '🛡️')} <@${w.moderatorId}> • ${date}`),
            );
        });
        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`\u200b`),
            new TextDisplayBuilder().setContent(`-# Total: ${total} warning(s)${total > 10 ? ' — Showing latest 10' : ''}`),
        );

        // ─── Message ───
        const msgLines = [`${getEmoji('warn', '⚠️')} **Warnings for ${user.tag}**`, ``];
        warnings.forEach((w, i) => {
            const date = `<t:${Math.floor(w.createdAt.getTime() / 1000)}:R>`;
            msgLines.push(`**${i + 1}.** ${w.reason} — <@${w.moderatorId}> (${date})`);
        });
        msgLines.push(``, `Total: ${total} warning(s)`);
        const message = msgLines.join('\n');

        return ctx.sendTypedMessage({ embed, componentsv2: [container], message });
    }
}
