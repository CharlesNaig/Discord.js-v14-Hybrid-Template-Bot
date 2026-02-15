import Command from "../../structures/Command.js";
import GuildSettings from "../../schemas/Guild.js";
import { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize } from "discord.js";
import { getEmoji, StatusEmojis } from "../../utils/emoji.js";
import { resolveColor } from "../../utils/resolveColor.js";

export default class MessageType extends Command {
    constructor(client) {
        super(client, {
            name: 'messagetype',
            description: {
                content: 'Set the bot message output format for this server',
                usage: '<embed|componentsv2|message>',
                examples: ['messagetype embed', 'messagetype componentsv2', 'messagetype message'],
            },
            aliases: ['msgtype', 'setmsgtype'],
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
                    name: "type",
                    description: "The message output format",
                    type: 3,
                    required: true,
                    choices: [
                        { name: 'Embed (Traditional)', value: 'embed' },
                        { name: 'Components V2 (Modern)', value: 'componentsv2' },
                        { name: 'Message (Plain Text)', value: 'message' },
                    ],
                },
            ],
        });
    }

    async run(ctx, args) {
        const type = args[0]?.toLowerCase();
        const validTypes = this.client.config.messageTypes;

        if (!type || !validTypes.includes(type)) {
            const current = await ctx.getMessageType();
            return ctx.sendTypedMessage({
                embed: this.client.embed()
                    .setColor(this.client.color.info)
                    .setTitle(`${getEmoji('settings', '⚙️')} Message Type`)
                    .setDescription(`Current: \`${current}\`\nValid types: ${validTypes.map(t => `\`${t}\``).join(', ')}`)
                    .setFooter({ text: `Usage: ${this.client.config.prefix}messagetype <type>` }),
                message: `${getEmoji('settings', '⚙️')} **Message Type**\nCurrent: \`${current}\`\nValid types: ${validTypes.map(t => `\`${t}\``).join(', ')}`,
            });
        }

        let data = await GuildSettings.findOne({ _id: ctx.guild.id });
        if (!data) {
            data = new GuildSettings({ _id: ctx.guild.id, messageType: type });
        } else {
            data.messageType = type;
        }
        await data.save();
        this.client.guildSettings.set(ctx.guild.id, data);

        const typeLabels = { embed: 'Embed (Traditional)', componentsv2: 'Components V2 (Modern)', message: 'Message (Plain Text)' };

        // ─── Embed ───
        const embed = this.client.embed()
            .setColor(this.client.color.success)
            .setDescription(`${StatusEmojis.success} Message type set to **${typeLabels[type]}**`);

        // ─── V2 ───
        const container = new ContainerBuilder()
            .setAccentColor(resolveColor(this.client.color.success))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`# ${StatusEmojis.success} Message Type Updated`),
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`${getEmoji('settings', '⚙️')} **Format:** ${typeLabels[type]}`),
                new TextDisplayBuilder().setContent(`\u200b`),
                new TextDisplayBuilder().setContent(`-# All commands will now use this format`),
            );

        // ─── Message ───
        const message = `${StatusEmojis.success} Message type set to **${typeLabels[type]}**`;

        return ctx.sendTypedMessage({ embed, componentsv2: [container], message });
    }
}
