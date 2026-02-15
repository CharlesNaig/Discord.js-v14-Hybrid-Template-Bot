import Command from "../../structures/Command.js";
import { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize } from "discord.js";
import { getEmoji, StatusEmojis } from "../../utils/emoji.js";
import { resolveColor } from "../../utils/resolveColor.js";
import { truncate, timestamp } from "../../utils/formatters.js";

export default class Snipe extends Command {
    constructor(client) {
        super(client, {
            name: 'snipe',
            description: {
                content: 'Show the last deleted message in this channel',
                usage: '',
                examples: ['snipe'],
            },
            aliases: ['s'],
            category: 'utility',
            cooldown: 5,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: ['ManageMessages'],
            },
            slashCommand: true,
            options: [],
        });
    }

    async run(ctx) {
        const snipe = this.client.snipes.get(ctx.channel.id);

        if (!snipe) {
            return ctx.sendTypedMessage({
                embed: this.client.embed().setColor(this.client.color.error).setDescription(`${StatusEmojis.error} Nothing to snipe here.`),
                message: `${StatusEmojis.error} Nothing to snipe here.`,
            });
        }

        const content = truncate(snipe.content || '*No text content*', 1024);
        const time = timestamp(new Date(snipe.timestamp), 'R');

        const embed = this.client.embed()
            .setColor(this.client.color.default)
            .setAuthor({ name: snipe.author.tag, iconURL: snipe.author.displayAvatarURL })
            .setDescription(content)
            .setFooter({ text: `Deleted ${time}` })
            .setTimestamp();

        if (snipe.attachment) embed.setImage(snipe.attachment);

        const container = new ContainerBuilder()
            .setAccentColor(resolveColor(this.client.color.default))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`# ${getEmoji('delete', '🗑️')} Sniped Message`),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`${getEmoji('member', '👤')} **${snipe.author.tag}**`),
                new TextDisplayBuilder().setContent(content),
                new TextDisplayBuilder().setContent(`-# Deleted ${time}`),
            );

        const message = [
            `${getEmoji('delete', '🗑️')} **Sniped Message**`,
            `**Author:** ${snipe.author.tag}`,
            content,
            `Deleted ${time}`,
        ].join('\n');

        return ctx.sendTypedMessage({ embed, componentsv2: [container], message });
    }
}
