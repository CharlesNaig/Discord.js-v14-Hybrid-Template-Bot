import Command from "../../structures/Command.js";
import { getEmoji, StatusEmojis } from "../../utils/emoji.js";

export default class Purge extends Command {
    constructor(client) {
        super(client, {
            name: 'purge',
            description: {
                content: 'Delete a number of messages from the channel',
                usage: '<amount 1-100> [@user]',
                examples: ['purge 10', 'purge 50 @user'],
            },
            aliases: ['clear', 'prune'],
            category: 'moderation',
            cooldown: 5,
            args: true,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'ManageMessages'],
                user: ['ManageMessages'],
            },
            slashCommand: true,
            options: [
                { name: "amount", description: "Number of messages to delete (1-100)", type: 4, required: true, min_value: 1, max_value: 100 },
                { name: "user", description: "Only delete messages from this user", type: 6, required: false },
            ],
        });
    }

    async run(ctx, args) {
        const amount = ctx.isInteraction
            ? ctx.interaction.options.getInteger('amount')
            : parseInt(args[0]);

        if (isNaN(amount) || amount < 1 || amount > 100) {
            return ctx.sendTypedMessage({
                embed: this.client.embed().setColor(this.client.color.error).setDescription(`${StatusEmojis.error} Please specify a number between 1 and 100.`),
                message: `${StatusEmojis.error} Please specify a number between 1 and 100.`,
            });
        }

        const targetUser = ctx.isInteraction
            ? ctx.interaction.options.getUser('user')
            : ctx.message.mentions.users.first();

        let messages;
        if (targetUser) {
            const fetched = await ctx.channel.messages.fetch({ limit: 100 });
            messages = fetched.filter(m => m.author.id === targetUser.id);
            messages = [...messages.values()].slice(0, amount);
            if (messages.length > 0) {
                await ctx.channel.bulkDelete(messages, true);
            }
        } else {
            // Delete the command message first for prefix
            if (!ctx.isInteraction) {
                await ctx.message.delete().catch(() => {});
            }
            messages = await ctx.channel.bulkDelete(amount, true);
        }

        const deletedCount = targetUser ? messages.length : messages.size;

        const reply = await ctx.sendTypedMessage({
            embed: this.client.embed()
                .setColor(this.client.color.success)
                .setDescription(`${StatusEmojis.success} Deleted **${deletedCount}** message(s)${targetUser ? ` from ${targetUser.tag}` : ''}.`),
            message: `${StatusEmojis.success} Deleted **${deletedCount}** message(s)${targetUser ? ` from ${targetUser.tag}` : ''}.`,
        });

        // Auto-delete confirmation after 5s
        setTimeout(() => {
            if (reply?.deletable) reply.delete().catch(() => {});
        }, 5000);
    }
}
