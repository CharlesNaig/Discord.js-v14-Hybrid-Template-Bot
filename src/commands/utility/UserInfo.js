import Command from "../../structures/Command.js";
import { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize } from "discord.js";
import { getEmoji, StatusEmojis } from "../../utils/emoji.js";
import { resolveColor } from "../../utils/resolveColor.js";
import { timestamp } from "../../utils/formatters.js";

export default class UserInfo extends Command {
    constructor(client) {
        super(client, {
            name: 'userinfo',
            description: {
                content: 'Display information about a user',
                usage: '[@user | id]',
                examples: ['userinfo', 'userinfo @user'],
            },
            aliases: ['ui', 'whois', 'user'],
            category: 'utility',
            cooldown: 3,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: true,
            options: [
                { name: "user", description: "The user to get info about", type: 6, required: false },
            ],
        });
    }

    async run(ctx, args) {
        const user = ctx.isInteraction
            ? ctx.interaction.options.getUser('user') || ctx.author
            : ctx.message.mentions.users.first() || (args[0] ? await this.client.users.fetch(args[0]).catch(() => null) : null) || ctx.author;

        const member = ctx.guild?.members.cache.get(user.id) || await ctx.guild?.members.fetch(user.id).catch(() => null);

        const created = timestamp(user.createdAt, 'R');
        const joined = member ? timestamp(member.joinedAt, 'R') : 'N/A';
        const roles = member ? member.roles.cache.filter(r => r.id !== ctx.guild.id).sort((a, b) => b.position - a.position).map(r => r.toString()).slice(0, 15).join(', ') || 'None' : 'N/A';
        const roleCount = member ? member.roles.cache.filter(r => r.id !== ctx.guild.id).size : 0;
        const badges = user.flags?.toArray().map(f => `\`${f}\``).join(', ') || 'None';

        const embed = this.client.embed()
            .setColor(member?.displayHexColor || this.client.color.default)
            .setTitle(`${getEmoji('member', '👤')} User Information`)
            .setThumbnail(user.displayAvatarURL({ size: 256, dynamic: true }))
            .addFields(
                { name: `${getEmoji('member', '👤')} User`, value: `${user.tag}\n${user.toString()} (\`${user.id}\`)`, inline: false },
                { name: `${getEmoji('calendar', '📅')} Created`, value: created, inline: true },
                { name: `${getEmoji('calendar', '📅')} Joined`, value: joined, inline: true },
                { name: `${getEmoji('role', '🎭')} Roles (${roleCount})`, value: roles.length > 1024 ? roles.slice(0, 1020) + '...' : roles, inline: false },
                { name: `${getEmoji('star', '⭐')} Badges`, value: badges, inline: false },
            )
            .setTimestamp();

        const container = new ContainerBuilder()
            .setAccentColor(resolveColor(member?.displayHexColor || this.client.color.default))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`# ${getEmoji('member', '👤')} User Information`),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`${getEmoji('member', '👤')} **User:** ${user.tag} (${user.id})`),
                new TextDisplayBuilder().setContent(`${getEmoji('calendar', '📅')} **Created:** ${created}`),
                new TextDisplayBuilder().setContent(`${getEmoji('calendar', '📅')} **Joined:** ${joined}`),
                new TextDisplayBuilder().setContent(`${getEmoji('role', '🎭')} **Roles (${roleCount}):** ${roles.length > 200 ? roles.slice(0, 200) + '...' : roles}`),
                new TextDisplayBuilder().setContent(`${getEmoji('star', '⭐')} **Badges:** ${badges}`),
            );

        const message = [
            `${getEmoji('member', '👤')} **User Information — ${user.tag}**`,
            `${getEmoji('member', '👤')} **ID:** \`${user.id}\``,
            `${getEmoji('calendar', '📅')} **Created:** ${created}`,
            `${getEmoji('calendar', '📅')} **Joined:** ${joined}`,
            `${getEmoji('role', '🎭')} **Roles:** ${roleCount}`,
        ].join('\n');

        return ctx.sendTypedMessage({ embed, componentsv2: [container], message });
    }
}
