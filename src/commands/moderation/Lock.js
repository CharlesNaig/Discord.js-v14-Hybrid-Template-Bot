import Command from "../../structures/Command.js";
import { PermissionFlagsBits } from "discord.js";
import { getEmoji, StatusEmojis } from "../../utils/emoji.js";

export default class Lock extends Command {
    constructor(client) {
        super(client, {
            name: 'lock',
            description: {
                content: 'Lock or unlock the current channel',
                usage: '[unlock]',
                examples: ['lock', 'lock unlock'],
            },
            aliases: ['lockchannel'],
            category: 'moderation',
            cooldown: 5,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'ManageChannels'],
                user: ['ManageChannels'],
            },
            slashCommand: true,
            options: [
                {
                    name: "action",
                    description: "Lock or unlock",
                    type: 3,
                    required: false,
                    choices: [
                        { name: 'Lock', value: 'lock' },
                        { name: 'Unlock', value: 'unlock' },
                    ],
                },
            ],
        });
    }

    async run(ctx, args) {
        const action = ctx.isInteraction
            ? ctx.interaction.options.getString('action') || 'lock'
            : (args[0]?.toLowerCase() === 'unlock' ? 'unlock' : 'lock');

        const everyone = ctx.guild.roles.everyone;

        if (action === 'unlock') {
            await ctx.channel.permissionOverwrites.edit(everyone, { [PermissionFlagsBits.SendMessages]: null });
            return ctx.sendTypedMessage({
                embed: this.client.embed().setColor(this.client.color.success).setDescription(`${getEmoji('channel', '🔓')} Channel has been **unlocked**.`),
                message: `${getEmoji('channel', '🔓')} Channel has been **unlocked**.`,
            });
        }

        await ctx.channel.permissionOverwrites.edit(everyone, { [PermissionFlagsBits.SendMessages]: false });
        return ctx.sendTypedMessage({
            embed: this.client.embed().setColor(this.client.color.error).setDescription(`${getEmoji('channel', '🔒')} Channel has been **locked**.`),
            message: `${getEmoji('channel', '🔒')} Channel has been **locked**.`,
        });
    }
}
