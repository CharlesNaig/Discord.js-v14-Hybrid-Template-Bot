import Command from "../../structures/Command.js";
import { ContainerBuilder, TextDisplayBuilder } from "discord.js";
import { getEmoji } from "../../utils/emoji.js";
import { resolveColor } from "../../utils/resolveColor.js";
import { formatUptime } from "../../utils/formatters.js";

export default class Uptime extends Command {
    constructor(client) {
        super(client, {
            name: 'uptime',
            description: {
                content: 'Display the bot uptime',
                usage: '',
                examples: ['uptime'],
            },
            aliases: ['up'],
            category: 'utility',
            cooldown: 3,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }

    async run(ctx) {
        const uptime = formatUptime(this.client.uptime);
        const since = `<t:${Math.floor((Date.now() - this.client.uptime) / 1000)}:R>`;

        const embed = this.client.embed()
            .setColor(this.client.color.success)
            .setDescription(`${getEmoji('clock', '⏰')} **Uptime:** \`${uptime}\`\n${getEmoji('calendar', '📅')} **Since:** ${since}`);

        const container = new ContainerBuilder()
            .setAccentColor(resolveColor(this.client.color.success))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`${getEmoji('clock', '⏰')} **Uptime:** \`${uptime}\``),
                new TextDisplayBuilder().setContent(`${getEmoji('calendar', '📅')} **Since:** ${since}`),
            );

        const message = `${getEmoji('clock', '⏰')} **Uptime:** \`${uptime}\` (${since})`;

        return ctx.sendTypedMessage({ embed, componentsv2: [container], message });
    }
}
