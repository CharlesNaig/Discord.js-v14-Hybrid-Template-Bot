import Command from "../../structures/Command.js";
import { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize } from "discord.js";
import { getEmoji, StatusEmojis } from "../../utils/emoji.js";
import { resolveColor } from "../../utils/resolveColor.js";
import { timestamp } from "../../utils/formatters.js";

export default class RoleInfo extends Command {
    constructor(client) {
        super(client, {
            name: 'roleinfo',
            description: {
                content: 'Display information about a role',
                usage: '<@role | role name | id>',
                examples: ['roleinfo @Moderator', 'roleinfo Admin'],
            },
            aliases: ['ri', 'role'],
            category: 'utility',
            cooldown: 3,
            args: true,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: true,
            options: [
                { name: "role", description: "The role to get info about", type: 8, required: true },
            ],
        });
    }

    async run(ctx, args) {
        let role;
        if (ctx.isInteraction) {
            role = ctx.interaction.options.getRole('role');
        } else {
            role = ctx.message.mentions.roles.first()
                || ctx.guild.roles.cache.get(args[0])
                || ctx.guild.roles.cache.find(r => r.name.toLowerCase() === args.join(' ').toLowerCase());
        }

        if (!role) {
            return ctx.sendTypedMessage({
                embed: this.client.embed().setColor(this.client.color.error).setDescription(`${StatusEmojis.error} Role not found.`),
                message: `${StatusEmojis.error} Role not found.`,
            });
        }

        const created = timestamp(role.createdAt, 'R');
        const memberCount = role.members.size;
        const perms = role.permissions.toArray().map(p => `\`${p}\``).join(', ') || 'None';

        const embed = this.client.embed()
            .setColor(role.hexColor === '#000000' ? this.client.color.default : role.hexColor)
            .setTitle(`${getEmoji('role', '🎭')} Role Information`)
            .addFields(
                { name: `${getEmoji('role', '🎭')} Name`, value: `${role.toString()} (\`${role.id}\`)`, inline: false },
                { name: `${getEmoji('info', '🎨')} Color`, value: `\`${role.hexColor}\``, inline: true },
                { name: `${getEmoji('members', '👥')} Members`, value: `${memberCount}`, inline: true },
                { name: `${getEmoji('arrow_right', '📍')} Position`, value: `${role.position}`, inline: true },
                { name: `${getEmoji('calendar', '📅')} Created`, value: created, inline: true },
                { name: `${getEmoji('settings', '⚙️')} Properties`, value: `Hoisted: ${role.hoist ? 'Yes' : 'No'} • Mentionable: ${role.mentionable ? 'Yes' : 'No'} • Managed: ${role.managed ? 'Yes' : 'No'}`, inline: false },
                { name: `${getEmoji('settings', '🔐')} Permissions`, value: perms.length > 1024 ? perms.slice(0, 1020) + '...' : perms, inline: false },
            )
            .setTimestamp();

        const container = new ContainerBuilder()
            .setAccentColor(resolveColor(role.hexColor === '#000000' ? this.client.color.default : role.hexColor))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`# ${getEmoji('role', '🎭')} Role Information`),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`${getEmoji('role', '🎭')} **Name:** ${role.name} (\`${role.id}\`)`),
                new TextDisplayBuilder().setContent(`${getEmoji('info', '🎨')} **Color:** \`${role.hexColor}\``),
                new TextDisplayBuilder().setContent(`${getEmoji('members', '👥')} **Members:** ${memberCount}`),
                new TextDisplayBuilder().setContent(`${getEmoji('arrow_right', '📍')} **Position:** ${role.position}`),
                new TextDisplayBuilder().setContent(`${getEmoji('calendar', '📅')} **Created:** ${created}`),
                new TextDisplayBuilder().setContent(`Hoisted: ${role.hoist ? 'Yes' : 'No'} • Mentionable: ${role.mentionable ? 'Yes' : 'No'}`),
            );

        const message = [
            `${getEmoji('role', '🎭')} **Role: ${role.name}**`,
            `**ID:** \`${role.id}\` • **Color:** \`${role.hexColor}\``,
            `**Members:** ${memberCount} • **Position:** ${role.position}`,
            `**Created:** ${created}`,
        ].join('\n');

        return ctx.sendTypedMessage({ embed, componentsv2: [container], message });
    }
}
