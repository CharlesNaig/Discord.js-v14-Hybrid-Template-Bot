import Command from '../../structures/Command.js';
import { StatusEmojis } from '../../utils/emoji.js';

export default class LeaveGuild extends Command {
    constructor(client) {
        super(client, {
            name: 'leave-guild',
            description: {
                content: 'Leave a guild',
                usage: '<server id>',
                examples: ['leave-guild 123456789'],
            },
            aliases: ['gleave'],
            category: 'dev',
            cooldown: 3,
            args: true,
            permissions: {
                dev: true,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: false,
        });
    }
    async run(ctx, args) {
        const guild = this.client.guilds.cache.get(args.join(" "));

        if (!guild) {
            return ctx.sendTypedMessage({
                embed: this.client.embed()
                    .setColor(this.client.color.error)
                    .setDescription(`${StatusEmojis.error} Guild not found.`),
                message: `${StatusEmojis.error} Guild not found.`,
            });
        }

        const guildName = guild.name;
        await guild.leave();

        this.client.logger.info(`Left guild: ${guildName}`);

        return ctx.sendTypedMessage({
            embed: this.client.embed()
                .setColor(this.client.color.success)
                .setDescription(`${StatusEmojis.success} Left guild: **${guildName}**`),
            message: `${StatusEmojis.success} Left guild: **${guildName}**`,
        });
    }
}
