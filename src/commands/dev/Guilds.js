import Command from "../../structures/Command.js";
import { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize } from "discord.js";
import { getEmoji, StatusEmojis } from "../../utils/emoji.js";
import { resolveColor } from "../../utils/resolveColor.js";
import { formatNumber } from "../../utils/formatters.js";

export default class Guilds extends Command {
    constructor(client) {
        super(client, {
            name: 'guilds',
            description: {
                content: 'List all guilds the bot is in',
                usage: '',
                examples: ['guilds'],
            },
            aliases: ['servers'],
            category: 'dev',
            cooldown: 5,
            permissions: {
                dev: true,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }

    async run(ctx) {
        const guilds = this.client.guilds.cache
            .sort((a, b) => b.memberCount - a.memberCount)
            .map((g, i) => `\`${g.memberCount}\` — **${g.name}** (\`${g.id}\`)`);

        const totalMembers = this.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);

        const embed = this.client.embed()
            .setColor(this.client.color.default)
            .setTitle(`${getEmoji('server', '🌐')} Guilds (${this.client.guilds.cache.size})`)
            .setDescription(guilds.slice(0, 20).join('\n') || 'No guilds')
            .setFooter({ text: `Total Members: ${formatNumber(totalMembers)}${guilds.length > 20 ? ` • Showing 20/${guilds.length}` : ''}` })
            .setTimestamp();

        const container = new ContainerBuilder()
            .setAccentColor(resolveColor(this.client.color.default))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`# ${getEmoji('server', '🌐')} Guilds (${this.client.guilds.cache.size})`),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
            .addTextDisplayComponents(
                ...guilds.slice(0, 20).map(g => new TextDisplayBuilder().setContent(g)),
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`\u200b`),
                new TextDisplayBuilder().setContent(`-# Total Members: ${formatNumber(totalMembers)}`),
            );

        const message = [
            `${getEmoji('server', '🌐')} **Guilds (${this.client.guilds.cache.size})**`,
            ...guilds.slice(0, 20),
            ``,
            `Total Members: ${formatNumber(totalMembers)}`,
        ].join('\n');

        return ctx.sendTypedMessage({ embed, componentsv2: [container], message });
    }
}
