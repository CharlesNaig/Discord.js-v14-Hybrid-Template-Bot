import Command from "../../structures/Command.js";
import { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { getEmoji, StatusEmojis } from "../../utils/emoji.js";
import { resolveColor } from "../../utils/resolveColor.js";

export default class Poll extends Command {
    constructor(client) {
        super(client, {
            name: 'poll',
            description: {
                content: 'Create a simple reaction poll',
                usage: '<question>',
                examples: ['poll Should we add a music bot?'],
            },
            aliases: ['vote'],
            category: 'utility',
            cooldown: 10,
            args: true,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks', 'AddReactions'],
                user: ['ManageMessages'],
            },
            slashCommand: true,
            options: [
                { name: "question", description: "The poll question", type: 3, required: true },
            ],
        });
    }

    async run(ctx, args) {
        const question = ctx.isInteraction
            ? ctx.interaction.options.getString('question')
            : args.join(' ');

        if (!question) {
            return ctx.sendTypedMessage({
                embed: this.client.embed().setColor(this.client.color.error).setDescription(`${StatusEmojis.error} Please provide a question.`),
                message: `${StatusEmojis.error} Please provide a question.`,
            });
        }

        const embed = this.client.embed()
            .setColor(this.client.color.info)
            .setTitle(`${getEmoji('info', '📊')} Poll`)
            .setDescription(`**${question}**\n\n✅ — Yes\n❌ — No`)
            .setFooter({ text: `Poll by ${ctx.author.tag}`, icon_url: ctx.author.displayAvatarURL() })
            .setTimestamp();

        const container = new ContainerBuilder()
            .setAccentColor(resolveColor(this.client.color.info))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`# ${getEmoji('info', '📊')} Poll`),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`**${question}**`),
                new TextDisplayBuilder().setContent(`\u200b`),
                new TextDisplayBuilder().setContent(`✅ — Yes`),
                new TextDisplayBuilder().setContent(`❌ — No`),
                new TextDisplayBuilder().setContent(`\u200b`),
                new TextDisplayBuilder().setContent(`-# Poll by ${ctx.author.tag}`),
            );

        const message = `${getEmoji('info', '📊')} **Poll by ${ctx.author.tag}**\n\n**${question}**\n\n✅ — Yes\n❌ — No`;

        const sent = await ctx.sendTypedMessage({ embed, componentsv2: [container], message });

        // Add reactions
        if (sent) {
            await sent.react('✅').catch(() => {});
            await sent.react('❌').catch(() => {});
        }
    }
}
