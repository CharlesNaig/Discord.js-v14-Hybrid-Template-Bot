import Command from "../../structures/Command.js";
import { StatusEmojis } from "../../utils/emoji.js";

export default class Shutdown extends Command {
    constructor(client) {
        super(client, {
            name: 'shutdown',
            description: {
                content: 'Gracefully shut down the bot',
                usage: '',
                examples: ['shutdown'],
            },
            aliases: ['die', 'stop'],
            category: 'dev',
            cooldown: 10,
            permissions: {
                dev: true,
                client: ['SendMessages', 'ViewChannel'],
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }

    async run(ctx) {
        await ctx.sendTypedMessage({
            embed: this.client.embed().setColor(this.client.color.warn).setDescription(`${StatusEmojis.warning} Shutting down...`),
            message: `${StatusEmojis.warning} Shutting down...`,
        });

        this.client.logger.warn(`[Shutdown] Bot shutdown initiated by ${ctx.author.tag}`);

        this.client.destroy();
        process.exit(0);
    }
}
