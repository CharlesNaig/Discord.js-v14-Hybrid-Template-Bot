import Command from '../../structures/Command.js';

export default class Reload extends Command {
    constructor(client) {
        super(client, {
            name: 'reload',
            description: {
                content: 'Reload a command',
                usage: '<command name>',
                examples: ['reload ping', 'reload help'],
            },
            aliases: ['r'],
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
        const commandName = args[0].toLowerCase();
        const command = this.client.commands.get(commandName) || 
                       this.client.commands.get(this.client.aliases.get(commandName));
        
        if (!command) {
            return ctx.sendMessage({ content: `❌ Command \`${commandName}\` not found.` });
        }
        
        try {
            // Remove from cache
            this.client.commands.delete(command.name);
            if (command.aliases && command.aliases.length) {
                command.aliases.forEach(alias => this.client.aliases.delete(alias));
            }
            
            // Re-import the command
            const timestamp = Date.now();
            const CommandClass = (await import(`../${command.category}/${command.fileName}.js?update=${timestamp}`)).default;
            const newCommand = new CommandClass(this.client);
            
            // Re-register
            this.client.commands.set(newCommand.name, newCommand);
            if (newCommand.aliases && newCommand.aliases.length) {
                newCommand.aliases.forEach(alias => {
                    this.client.aliases.set(alias, newCommand.name);
                });
            }
            
            const embed = this.client.embed()
                .setColor(this.client.color.success)
                .setDescription(`✅ Successfully reloaded command: \`${newCommand.name}\``)
                .setTimestamp();
                
            return ctx.sendMessage({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const embed = this.client.embed()
                .setColor(this.client.color.error)
                .setDescription(`❌ Error reloading command: \`${commandName}\`\n\`\`\`js\n${error.message}\n\`\`\``)
                .setTimestamp();
                
            return ctx.sendMessage({ embeds: [embed] });
        }
    }
}
