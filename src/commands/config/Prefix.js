import Command from "../../structures/Command.js";
import GuildSettings from "../../schemas/Guild.js";
import { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize } from "discord.js";
import { getEmoji, StatusEmojis } from "../../utils/emoji.js";
import { resolveColor } from "../../utils/resolveColor.js";

export default class Prefix extends Command {
    constructor(client) {
        super(client, {
            name: 'prefix',
            description: {
                content: 'Change the prefix of the bot',
                usage: '<new prefix>',
                examples: ['prefix !'],
            },
            aliases: ['setprefix'],
            category: 'config',
            cooldown: 3,
            args: true,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: ['ManageGuild'],
            },
            slashCommand: true,
            options: [
                {
                    name: "prefix",
                    description: "The new prefix",
                    type: 3,
                    required: true,
                },
            ]
        });
    }
    async run(ctx, args) {
        const prefix = args.join(" ");

        if (prefix.length > 3) {
            return ctx.sendTypedMessage({
                embed: this.client.embed()
                    .setColor(this.client.color.error)
                    .setDescription(`${StatusEmojis.error} Your new prefix must be under \`3\` characters!`),
                message: `${StatusEmojis.error} Your new prefix must be under \`3\` characters!`,
            });
        }

        let data = await GuildSettings.findOne({ _id: ctx.guild.id });
        if (!data) {
            data = new GuildSettings({ _id: ctx.guild.id, prefix });
        } else {
            data.prefix = prefix;
        }
        await data.save();

        // Update cache
        this.client.guildSettings.set(ctx.guild.id, data);

        // ─── Embed Format ───
        const embed = this.client.embed()
            .setColor(this.client.color.success)
            .setDescription(`${StatusEmojis.success} Prefix updated to \`${prefix}\``);

        // ─── Components V2 Format ───
        const container = new ContainerBuilder()
            .setAccentColor(resolveColor(this.client.color.success))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`# ${StatusEmojis.success} Prefix Updated`),
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`${getEmoji('settings', '⚙️')} **New Prefix:** \`${prefix}\``),
                new TextDisplayBuilder().setContent(`\u200b`),
                new TextDisplayBuilder().setContent(`-# Use \`${prefix}help\` to see commands`),
            );

        // ─── Message Format ───
        const message = `${StatusEmojis.success} Prefix updated to \`${prefix}\``;

        return ctx.sendTypedMessage({ embed, componentsv2: [container], message });
    }
}