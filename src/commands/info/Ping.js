import Command from "../../structures/Command.js";
import { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize } from "discord.js";
import { getEmoji, StatusEmojis } from "../../utils/emoji.js";
import { resolveColor } from "../../utils/resolveColor.js";

export default class Ping extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            description: {
                content: 'Check the bot\'s latency and response time.',
                usage: 'ping',
                examples: ['ping'],
            },
            category: 'info',
            cooldown: 3,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: true,
        });
    }
    async run(ctx, args) {
        const msg = await ctx.sendDeferMessage(`${StatusEmojis.loading} Pinging...`);

        const botLatency = msg.createdTimestamp - ctx.createdTimestamp;
        const apiLatency = Math.round(this.client.ws.ping);

        // ─── Embed Format ───
        const embed = this.client.embed()
            .setAuthor({ name: 'Pong!', iconURL: this.client.user.displayAvatarURL() })
            .setColor(this.client.color.success)
            .addFields([
                { name: `${getEmoji('clock', '🏓')} Bot Latency`, value: `\`\`\`ini\n[ ${botLatency}ms ]\n\`\`\``, inline: true },
                { name: `${getEmoji('info', '📡')} API Latency`, value: `\`\`\`ini\n[ ${apiLatency}ms ]\n\`\`\``, inline: true },
            ])
            .setFooter({ text: `Requested by ${ctx.author.tag}`, iconURL: ctx.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        // ─── Components V2 Format ───
        const container = new ContainerBuilder()
            .setAccentColor(resolveColor(this.client.color.success))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`# ${StatusEmojis.success} Pong!`),
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`${getEmoji('clock', '🏓')} **Bot Latency:** \`${botLatency}ms\``),
                new TextDisplayBuilder().setContent(`${getEmoji('info', '📡')} **API Latency:** \`${apiLatency}ms\``),
                new TextDisplayBuilder().setContent(`\u200b`),
                new TextDisplayBuilder().setContent(`-# Requested by ${ctx.author.tag}`),
            );

        // ─── Message Format ───
        const message = [
            `${StatusEmojis.success} **Pong!**`,
            `${getEmoji('clock', '🏓')} Bot Latency: \`${botLatency}ms\``,
            `${getEmoji('info', '📡')} API Latency: \`${apiLatency}ms\``,
        ].join('\n');

        return ctx.editTypedMessage({ embed, componentsv2: [container], message });
    }
}
