import Command from "../../structures/Command.js";
import { StatusEmojis } from "../../utils/emoji.js";

export default class Emit extends Command {
    constructor(client) {
        super(client, {
            name: 'emit',
            description: {
                content: 'Emit a client event for testing',
                usage: '<event>',
                examples: ['emit guildCreate', 'emit guildMemberAdd'],
            },
            aliases: [],
            category: 'dev',
            cooldown: 5,
            args: true,
            permissions: {
                dev: true,
                client: ['SendMessages', 'ViewChannel'],
                user: [],
            },
            slashCommand: true,
            options: [
                {
                    name: "event",
                    description: "Event to emit",
                    type: 3,
                    required: true,
                    choices: [
                        { name: 'guildCreate', value: 'guildCreate' },
                        { name: 'guildDelete', value: 'guildDelete' },
                        { name: 'guildMemberAdd', value: 'guildMemberAdd' },
                        { name: 'guildMemberRemove', value: 'guildMemberRemove' },
                    ],
                },
            ],
        });
    }

    async run(ctx, args) {
        const eventName = ctx.isInteraction
            ? ctx.interaction.options.getString('event')
            : args[0];

        if (!eventName) {
            return ctx.sendTypedMessage({
                embed: this.client.embed().setColor(this.client.color.error).setDescription(`${StatusEmojis.error} Please provide an event name.`),
                message: `${StatusEmojis.error} Please provide an event name.`,
            });
        }

        const supported = {
            guildCreate: () => this.client.emit('guildCreate', ctx.guild),
            guildDelete: () => this.client.emit('guildDelete', ctx.guild),
            guildMemberAdd: () => this.client.emit('guildMemberAdd', ctx.member),
            guildMemberRemove: () => this.client.emit('guildMemberRemove', ctx.member),
        };

        if (!supported[eventName]) {
            const available = Object.keys(supported).map(e => `\`${e}\``).join(', ');
            return ctx.sendTypedMessage({
                embed: this.client.embed().setColor(this.client.color.error).setDescription(`${StatusEmojis.error} Unknown event. Available: ${available}`),
                message: `${StatusEmojis.error} Unknown event. Available: ${available}`,
            });
        }

        supported[eventName]();
        this.client.logger.info(`[Emit] ${ctx.author.tag} emitted event: ${eventName}`);

        return ctx.sendTypedMessage({
            embed: this.client.embed().setColor(this.client.color.success).setDescription(`${StatusEmojis.success} Emitted event: \`${eventName}\``),
            message: `${StatusEmojis.success} Emitted event: \`${eventName}\``,
        });
    }
}
