import Command from "../../structures/Command.js";
import { getEmoji, StatusEmojis } from "../../utils/emoji.js";

export default class Slowmode extends Command {
    constructor(client) {
        super(client, {
            name: 'slowmode',
            description: {
                content: 'Set the slowmode for the current channel',
                usage: '<seconds | off>',
                examples: ['slowmode 5', 'slowmode 60', 'slowmode off'],
            },
            aliases: ['slow'],
            category: 'moderation',
            cooldown: 5,
            args: true,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'ManageChannels'],
                user: ['ManageChannels'],
            },
            slashCommand: true,
            options: [
                { name: "seconds", description: "Slowmode in seconds (0 to disable, max 21600)", type: 4, required: true, min_value: 0, max_value: 21600 },
            ],
        });
    }

    async run(ctx, args) {
        let seconds;
        if (ctx.isInteraction) {
            seconds = ctx.interaction.options.getInteger('seconds');
        } else {
            if (args[0]?.toLowerCase() === 'off') {
                seconds = 0;
            } else {
                seconds = parseInt(args[0]);
            }
        }

        if (isNaN(seconds) || seconds < 0 || seconds > 21600) {
            return ctx.sendTypedMessage({
                embed: this.client.embed().setColor(this.client.color.error).setDescription(`${StatusEmojis.error} Please specify a valid number (0-21600 seconds) or \`off\`.`),
                message: `${StatusEmojis.error} Please specify 0-21600 seconds or \`off\`.`,
            });
        }

        await ctx.channel.setRateLimitPerUser(seconds);

        const text = seconds === 0
            ? `${StatusEmojis.success} Slowmode has been **disabled** for ${ctx.channel.toString()}.`
            : `${StatusEmojis.success} Slowmode set to **${seconds}s** for ${ctx.channel.toString()}.`;

        return ctx.sendTypedMessage({
            embed: this.client.embed().setColor(this.client.color.success).setDescription(text),
            message: text,
        });
    }
}
