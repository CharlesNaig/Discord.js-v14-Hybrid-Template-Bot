import Command from "../../structures/Command.js";

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
        const embed = this.client.embed();
        
        if (args[0]) {
            const command = this.client.commands.get(args[0].toLowerCase()) || 
                           this.client.commands.get(this.client.aliases.get(args[0].toLowerCase()));
            
            if (!command) {
                return ctx.sendMessage({ 
                    embeds: [embed.setColor(this.client.color.error).setDescription(`❌ Command \`${args[0]}\` not found.`)] 
                });
            }
            
            embed.setColor(this.client.color.default)
                .setTitle(`📖 Command: ${command.name}`)
                .setDescription(command.description.content || 'No description available.')
                .addFields([
                    { name: '📝 Usage', value: `\`${this.client.config.prefix}${command.name} ${command.description.usage || ''}\``, inline: false },
                    { name: '🏷️ Aliases', value: command.aliases.length ? command.aliases.map(a => `\`${a}\``).join(', ') : 'None', inline: true },
                    { name: '📂 Category', value: command.category || 'None', inline: true },
                    { name: '⏱️ Cooldown', value: `${command.cooldown || 3}s`, inline: true },
                ]);
                
            if (command.description.examples && command.description.examples.length) {
                embed.addFields({ 
                    name: '💡 Examples', 
                    value: command.description.examples.map(ex => `\`${this.client.config.prefix}${ex}\``).join('\n') 
                });
            }
            
            return ctx.sendMessage({ embeds: [embed] });
        }
        
        const categories = {};
        this.client.commands.forEach(cmd => {
            if (!categories[cmd.category]) categories[cmd.category] = [];
            categories[cmd.category].push(cmd.name);
        });
        
        embed.setColor(this.client.color.default)
            .setAuthor({ name: '📚 Help Menu', iconURL: this.client.user.displayAvatarURL() })
            .setDescription(`Use \`${this.client.config.prefix}help [command]\` for more info on a command.`)
            .setFooter({ text: `Total Commands: ${this.client.commands.size}` });
        
        for (const [category, commands] of Object.entries(categories)) {
            embed.addFields({
                name: `${category.charAt(0).toUpperCase() + category.slice(1)}`,
                value: commands.map(c => `\`${c}\``).join(', '),
                inline: false
            });
        }
        
        return ctx.sendMessage({ embeds: [embed] });
    }
}
