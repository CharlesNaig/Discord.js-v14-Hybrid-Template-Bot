import Command from "../../structures/Command.js"; 
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export default class About extends Command {
    constructor(client) {
        super(client, {
            name: 'about',
            description: {
                content: 'See information about this bot.',
                usage: 'about',
                examples: ['about'],
            },
            aliases: ["info", "botinfo"],
            category: 'info',
            cooldown: 3,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: true,
        });
    }

    async run(ctx, args) {
        const embed = this.client.embed()
            .setAuthor({ name: 'Bot Information', iconURL: this.client.user.displayAvatarURL()})
            .setThumbnail(this.client.user.displayAvatarURL())
            .setColor(this.client.color.default)
            .addFields([
                { name: '👤 Bot Name', value: this.client.user.tag, inline: true },
                { name: '📊 Servers', value: `${this.client.guilds.cache.size}`, inline: true },
                { name: '👥 Users', value: `${this.client.users.cache.size}`, inline: true },
                { name: '📝 Commands', value: `${this.client.commands.size}`, inline: true },
                { name: '🏓 Ping', value: `${Math.round(this.client.ws.ping)}ms`, inline: true },
                { name: '⏱️ Uptime', value: `<t:${Math.floor((Date.now() - this.client.uptime) / 1000)}:R>`, inline: true },
                { name: '💻 Node.js', value: process.version, inline: true },
                { name: '📚 Discord.js', value: 'v14.22.1', inline: true },
                { name: '🔧 Prefix', value: this.client.config.prefix, inline: true },
            ])
            .setFooter({ text: `Requested by ${ctx.author.tag}`, iconURL: ctx.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();
            
        return await ctx.sendMessage({ embeds: [embed] });
    }
}
