import Command from "../../structures/Command.js";
import { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize } from "discord.js";
import { getEmoji, StatusEmojis } from "../../utils/emoji.js";
import { resolveColor } from "../../utils/resolveColor.js";
import { capitalize } from "../../utils/formatters.js";

export default class Help extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            description: {
                content: 'Display all commands available to you.',
                usage: '[command]',
                examples: ['help', 'help ping'],
            },
            aliases: ['h', 'commands'],
            category: 'info',
            cooldown: 3,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: true,
            options: [
                {
                    name: "command",
                    description: "Get info on a specific command",
                    type: 3,
                    required: false,
                },
            ]
        });
    }

    async run(ctx, args) {
        // ─── Single Command Help ───
        if (args[0]) {
            const command = this.client.commands.get(args[0].toLowerCase()) || 
                           this.client.commands.get(this.client.aliases.get(args[0].toLowerCase()));
            
            if (!command) {
                return ctx.sendTypedMessage({
                    embed: this.client.embed()
                        .setColor(this.client.color.error)
                        .setDescription(`${StatusEmojis.error} Command \`${args[0]}\` not found.`),
                    message: `${StatusEmojis.error} Command \`${args[0]}\` not found.`,
                });
            }

            const prefix = this.client.config.prefix;
            const aliases = command.aliases?.length ? command.aliases.map(a => `\`${a}\``).join(', ') : 'None';
            const usage = `\`${prefix}${command.name} ${command.description.usage || ''}\``;
            const examples = command.description.examples?.length
                ? command.description.examples.map(ex => `\`${prefix}${ex}\``).join('\n')
                : 'None';

            // Embed
            const embed = this.client.embed()
                .setColor(this.client.color.default)
                .setTitle(`${getEmoji('info', '📖')} Command: ${command.name}`)
                .setDescription(command.description.content || 'No description available.')
                .addFields([
                    { name: `${getEmoji('info', '📝')} Usage`, value: usage, inline: false },
                    { name: `${getEmoji('info', '🏷️')} Aliases`, value: aliases, inline: true },
                    { name: `${getEmoji('info', '📂')} Category`, value: command.category || 'None', inline: true },
                    { name: `${getEmoji('clock', '⏱️')} Cooldown`, value: `${command.cooldown || 3}s`, inline: true },
                ]);
            if (command.description.examples?.length) {
                embed.addFields({ name: `${getEmoji('info', '💡')} Examples`, value: examples });
            }

            // V2
            const container = new ContainerBuilder()
                .setAccentColor(resolveColor(this.client.color.default))
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(`# ${getEmoji('info', '📖')} Command: ${command.name}`),
                    new TextDisplayBuilder().setContent(command.description.content || 'No description available.'),
                )
                .addSeparatorComponents(
                    new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(`${getEmoji('info', '📝')} **Usage:** ${usage}`),
                    new TextDisplayBuilder().setContent(`${getEmoji('info', '🏷️')} **Aliases:** ${aliases}`),
                    new TextDisplayBuilder().setContent(`${getEmoji('info', '📂')} **Category:** ${command.category || 'None'}`),
                    new TextDisplayBuilder().setContent(`${getEmoji('clock', '⏱️')} **Cooldown:** ${command.cooldown || 3}s`),
                );
            if (command.description.examples?.length) {
                container.addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(`${getEmoji('info', '💡')} **Examples:**\n${examples}`)
                );
            }

            // Message
            const message = [
                `${getEmoji('info', '📖')} **Command: ${command.name}**`,
                command.description.content || '',
                ``,
                `${getEmoji('info', '📝')} **Usage:** ${usage}`,
                `${getEmoji('info', '🏷️')} **Aliases:** ${aliases}`,
                `${getEmoji('info', '📂')} **Category:** ${command.category || 'None'}`,
                `${getEmoji('clock', '⏱️')} **Cooldown:** ${command.cooldown || 3}s`,
                command.description.examples?.length ? `${getEmoji('info', '💡')} **Examples:**\n${examples}` : '',
            ].filter(Boolean).join('\n');

            return ctx.sendTypedMessage({ embed, componentsv2: [container], message });
        }
        
        // ─── Full Help Menu ───
        const categories = {};
        this.client.commands.forEach(cmd => {
            if (cmd.permissions?.dev && !this.client.config.ownerID.includes(ctx.author.id)) return;
            const cat = cmd.category || 'uncategorized';
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(cmd.name);
        });

        const categoryEmojis = {
            info: getEmoji('info', 'ℹ️'),
            config: getEmoji('settings', '⚙️'),
            dev: getEmoji('settings', '🛠️'),
            moderation: getEmoji('moderator', '🛡️'),
            utility: getEmoji('settings', '🔧'),
        };

        // Embed
        const embed = this.client.embed()
            .setColor(this.client.color.default)
            .setAuthor({ name: 'Help Menu', iconURL: this.client.user.displayAvatarURL() })
            .setDescription(`Use \`${this.client.config.prefix}help [command]\` for more info on a command.`)
            .setFooter({ text: `Total Commands: ${this.client.commands.size}` });

        for (const [category, commands] of Object.entries(categories)) {
            const emoji = categoryEmojis[category] || getEmoji('info', '📁');
            embed.addFields({
                name: `${emoji} ${capitalize(category)}`,
                value: commands.map(c => `\`${c}\``).join(', '),
                inline: false,
            });
        }

        // V2
        const container = new ContainerBuilder()
            .setAccentColor(resolveColor(this.client.color.default))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`# ${getEmoji('info', '📚')} Help Menu`),
                new TextDisplayBuilder().setContent(`Use \`${this.client.config.prefix}help [command]\` for more info.`),
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
            );

        for (const [category, commands] of Object.entries(categories)) {
            const emoji = categoryEmojis[category] || getEmoji('info', '📁');
            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`## ${emoji} ${capitalize(category)}`),
                new TextDisplayBuilder().setContent(commands.map(c => `\`${c}\``).join(', ')),
            );
        }
        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`\u200b`),
            new TextDisplayBuilder().setContent(`-# Total Commands: ${this.client.commands.size}`),
        );

        // Message
        const messageParts = [`${getEmoji('info', '📚')} **Help Menu**`, `Use \`${this.client.config.prefix}help [command]\` for more info.`, ``];
        for (const [category, commands] of Object.entries(categories)) {
            const emoji = categoryEmojis[category] || getEmoji('info', '📁');
            messageParts.push(`${emoji} **${capitalize(category)}**`);
            messageParts.push(commands.map(c => `\`${c}\``).join(', '));
            messageParts.push('');
        }
        messageParts.push(`Total Commands: ${this.client.commands.size}`);
        const message = messageParts.join('\n');

        return ctx.sendTypedMessage({ embed, componentsv2: [container], message });
    }
}
