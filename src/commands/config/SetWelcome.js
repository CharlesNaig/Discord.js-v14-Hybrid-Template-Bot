import Command from "../../structures/Command.js";
import GuildSettings from "../../schemas/Guild.js";
import { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize } from "discord.js";
import { getEmoji, StatusEmojis } from "../../utils/emoji.js";
import { resolveColor } from "../../utils/resolveColor.js";

export default class SetWelcome extends Command {
    constructor(client) {
        super(client, {
            name: 'setwelcome',
            description: {
                content: 'Configure the welcome message and channel',
                usage: '<#channel | disable> [message]',
                examples: ['setwelcome #welcome Welcome {user} to {server}!', 'setwelcome disable'],
            },
            aliases: ['welcome'],
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
                    description: "The welcome channel",
                    type: 7, // Channel
                    required: false,
                },
                {
                    name: "message",
                    description: "The welcome message ({user}, {username}, {server}, {membercount})",
                    type: 3,
                    required: false,
                },
                {
                    name: "action",
                    description: "Disable welcome messages",
                    type: 3,
                    required: false,
                    choices: [
                        { name: 'Disable Welcome', value: 'disable' },
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
            data.welcome.enabled = false;
            await data.save();
            this.client.guildSettings.set(ctx.guild.id, data);

            return ctx.sendTypedMessage({
                embed: this.client.embed()
                    .setColor(this.client.color.success)
                    .setDescription(`${StatusEmojis.success} Welcome messages have been **disabled**.`),
                message: `${StatusEmojis.success} Welcome messages have been **disabled**.`,
            });
        }

        // Get channel
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

        // Get optional custom message
        const welcomeMsg = ctx.isInteraction
            ? ctx.interaction.options.getString('message')
            : args.slice(1).join(' ') || null;

        data.welcome.enabled = true;
        data.welcome.channel = channel.id;
        if (welcomeMsg) data.welcome.message = welcomeMsg;
        await data.save();
        this.client.guildSettings.set(ctx.guild.id, data);

        const displayMsg = data.welcome.message || 'Welcome {user} to {server}!';

        // ─── Embed ───
        const embed = this.client.embed()
            .setColor(this.client.color.success)
            .setTitle(`${StatusEmojis.success} Welcome Configured`)
            .addFields(
                { name: `${getEmoji('channel', '📝')} Channel`, value: channel.toString(), inline: true },
                { name: `${getEmoji('info', '💬')} Message`, value: `\`${displayMsg}\``, inline: false },
            )
            .setFooter({ text: 'Variables: {user}, {username}, {server}, {membercount}' });

        // ─── V2 ───
        const container = new ContainerBuilder()
            .setAccentColor(resolveColor(this.client.color.success))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`# ${StatusEmojis.success} Welcome Configured`),
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`${getEmoji('channel', '📝')} **Channel:** ${channel.toString()}`),
                new TextDisplayBuilder().setContent(`${getEmoji('info', '💬')} **Message:** \`${displayMsg}\``),
                new TextDisplayBuilder().setContent(`\u200b`),
                new TextDisplayBuilder().setContent(`-# Variables: {user}, {username}, {server}, {membercount}`),
            );

        // ─── Message ───
        const message = [
            `${StatusEmojis.success} **Welcome Configured**`,
            `${getEmoji('channel', '📝')} **Channel:** ${channel.toString()}`,
            `${getEmoji('info', '💬')} **Message:** \`${displayMsg}\``,
            `Variables: {user}, {username}, {server}, {membercount}`,
        ].join('\n');

        return ctx.sendTypedMessage({ embed, componentsv2: [container], message });
    }
}
