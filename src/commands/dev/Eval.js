import Command from '../../structures/Command.js';
import { inspect } from 'util';
import { StatusEmojis } from '../../utils/emoji.js';

export default class Eval extends Command {
    constructor(client) {
        super(client, {
            name: 'eval',
            description: {
                content: 'Evaluates JavaScript code',
                usage: '<code>',
                examples: ['client.commands.size', 'client.guilds.cache.size'],
            },
            aliases: ['e'],
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
        const code = args.join(' ');
        if (!code) {
            return ctx.sendMessage({ content: `${StatusEmojis.error} Please provide code to evaluate!` });
        }
        try {
            let evaled = await eval(code);
            if (typeof evaled !== 'string') {
                evaled = inspect(evaled, { depth: 0 });
            }
            
            // Censor sensitive information
            if (evaled.includes(this.client.token)) {
                evaled = evaled.replace(new RegExp(this.client.token, 'g'), '[TOKEN CENSORED]');
            }
            if (this.client.config.mongourl && evaled.includes(this.client.config.mongourl)) {
                evaled = evaled.replace(new RegExp(this.client.config.mongourl, 'g'), '[MONGO_URL CENSORED]');
            }
            
            // Truncate if too long
            if (evaled.length > 1990) {
                evaled = evaled.substring(0, 1990) + '...';
            }
            
            const embed = this.client.embed()
                .setColor(this.client.color.success)
                .setTitle(`${StatusEmojis.success} Eval Success`)
                .setDescription(`\`\`\`js\n${evaled}\n\`\`\``)
                .setTimestamp();

            const message = `${StatusEmojis.success} **Eval Success**\n\`\`\`js\n${evaled}\n\`\`\``;

            return ctx.sendTypedMessage({ embed, message });
        } catch (e) {
            this.client.logger.error(`[Eval] ${e.message}`);
            const embed = this.client.embed()
                .setColor(this.client.color.error)
                .setTitle(`${StatusEmojis.error} Eval Error`)
                .setDescription(`\`\`\`js\n${e.message}\n\`\`\``)
                .setTimestamp();

            const message = `${StatusEmojis.error} **Eval Error**\n\`\`\`js\n${e.message}\n\`\`\``;

            return ctx.sendTypedMessage({ embed, message });
        }
    }
}