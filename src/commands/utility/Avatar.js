import Command from "../../structures/Command.js";
import { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize } from "discord.js";
import { getEmoji, StatusEmojis } from "../../utils/emoji.js";
import { resolveColor } from "../../utils/resolveColor.js";

export default class Avatar extends Command {
    constructor(client) {
        super(client, {
            name: 'avatar',
            description: {
                content: 'Display a user\'s avatar',
                usage: '[@user | id]',
                examples: ['avatar', 'avatar @user'],
            },
            aliases: ['av', 'pfp'],
            category: 'utility',
            cooldown: 3,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: true,
            options: [
                { name: "user", description: "The user to get the avatar of", type: 6, required: false },
            ],
        });
    }

    async run(ctx, args) {
        const user = ctx.isInteraction
            ? ctx.interaction.options.getUser('user') || ctx.author
            : ctx.message.mentions.users.first() || (args[0] ? await this.client.users.fetch(args[0]).catch(() => null) : null) || ctx.author;

        const avatarURL = user.displayAvatarURL({ size: 4096, dynamic: true });
        const memberAvatar = ctx.guild?.members.cache.get(user.id)?.displayAvatarURL({ size: 4096, dynamic: true });

        const embed = this.client.embed()
            .setColor(this.client.color.default)
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ size: 64 }) })
            .setTitle(`${getEmoji('member', '👤')} Avatar`)
            .setImage(memberAvatar || avatarURL)
            .setDescription(`[Global Avatar](${avatarURL})${memberAvatar && memberAvatar !== avatarURL ? ` • [Server Avatar](${memberAvatar})` : ''}`)
            .setTimestamp();

        const container = new ContainerBuilder()
            .setAccentColor(resolveColor(this.client.color.default))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`# ${getEmoji('member', '👤')} ${user.tag}'s Avatar`),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`[Global Avatar](${avatarURL})${memberAvatar && memberAvatar !== avatarURL ? ` • [Server Avatar](${memberAvatar})` : ''}`),
            );

        const message = `${getEmoji('member', '👤')} **${user.tag}'s Avatar**\n${memberAvatar || avatarURL}`;

        return ctx.sendTypedMessage({ embed, componentsv2: [container], message });
    }
}
