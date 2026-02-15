import Command from "../../structures/Command.js";
import GuildSettings from "../../schemas/Guild.js";
import { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize } from "discord.js";
import { getEmoji, StatusEmojis } from "../../utils/emoji.js";
import { resolveColor } from "../../utils/resolveColor.js";

export default class SetLog extends Command {
    constructor(client) {
        super(client, {
            name: 'setlog',
            description: {
                content: 'Configure the logging channel for this server',
                usage: '<#channel | disable>',
                examples: ['setlog #mod-logs', 'setlog disable'],
            },
            aliases: ['logging', 'logchannel'],
            category: 'config',
            cooldown: 5,
            args: true,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: ['ManageGuild'],
            },
            slashCommand: true,
            options: [
                {
                    name: "channel",
                    description: "The logging channel (or 'disable' to turn off)",
                    type: 7, // Channel
                    required: false,
                },
                {
                    name: "action",
                    description: "Disable logging",
                    type: 3,
                    required: false,
                    choices: [
                        { name: 'Disable Logging', value: 'disable' },
                    ],
                },
            ],
        });
    }

    async run(ctx, args) {
        let data = await GuildSettings.findOne({ _id: ctx.guild.id });
        if (!data) {
            data = new GuildSettings({ _id: ctx.guild.id });
        }

        // Disable
        if (args[0]?.toLowerCase() === 'disable') {
            data.logging.enabled = false;
            data.logging.channel = null;
            await data.save();
            this.client.guildSettings.set(ctx.guild.id, data);

            return ctx.sendTypedMessage({
                embed: this.client.embed()
                    .setColor(this.client.color.success)
                    .setDescription(`${StatusEmojis.success} Logging has been **disabled**.`),
                message: `${StatusEmojis.success} Logging has been **disabled**.`,
            });
        }

        // Get channel from mention or interaction
        const channel = ctx.isInteraction
            ? ctx.interaction.options.getChannel('channel')
            : ctx.message.mentions.channels.first() || ctx.guild.channels.cache.get(args[0]);

        if (!channel || !channel.isTextBased()) {
            return ctx.sendTypedMessage({
                embed: this.client.embed()
                    .setColor(this.client.color.error)
                    .setDescription(`${StatusEmojis.error} Please mention a valid text channel or use \`disable\`.`),
                message: `${StatusEmojis.error} Please mention a valid text channel or use \`disable\`.`,
            });
        }

        data.logging.enabled = true;
        data.logging.channel = channel.id;
        await data.save();
        this.client.guildSettings.set(ctx.guild.id, data);

        // ─── Embed ───
        const embed = this.client.embed()
            .setColor(this.client.color.success)
            .setDescription(`${StatusEmojis.success} Logging channel set to ${channel.toString()}`);

        // ─── V2 ───
        const container = new ContainerBuilder()
            .setAccentColor(resolveColor(this.client.color.success))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`# ${StatusEmojis.success} Logging Configured`),
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`${getEmoji('channel', '📝')} **Channel:** ${channel.toString()}`),
                new TextDisplayBuilder().setContent(`${StatusEmojis.success} **Enabled:** Yes`),
                new TextDisplayBuilder().setContent(`\u200b`),
                new TextDisplayBuilder().setContent(`-# All logged events will be sent to this channel`),
            );

        // ─── Message ───
        const message = `${StatusEmojis.success} Logging channel set to ${channel.toString()}`;

        return ctx.sendTypedMessage({ embed, componentsv2: [container], message });
    }
}
