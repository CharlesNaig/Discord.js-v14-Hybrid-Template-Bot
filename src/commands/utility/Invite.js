import Command from "../../structures/Command.js";
import { getEmoji, StatusEmojis } from "../../utils/emoji.js";

export default class Invite extends Command {
    constructor(client) {
        super(client, {
            name: 'invite',
            description: {
                content: 'Get the bot invite link',
                usage: '',
                examples: ['invite'],
            },
            aliases: ['inv'],
            category: 'utility',
            cooldown: 5,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }

    async run(ctx) {
        const inviteLink = this.client.config.links.invite
            || `https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=8&scope=bot%20applications.commands`;
        const supportLink = this.client.config.links.support;

        const description = [
            `${getEmoji('link', '🔗')} **[Invite Me](${inviteLink})**`,
            supportLink ? `${getEmoji('server', '🏠')} **[Support Server](${supportLink})**` : null,
        ].filter(Boolean).join('\n');

        const embed = this.client.embed()
            .setColor(this.client.color.default)
            .setTitle(`${getEmoji('link', '🔗')} Invite Links`)
            .setDescription(description)
            .setTimestamp();

        const message = [
            `${getEmoji('link', '🔗')} **Invite Links**`,
            `Invite: ${inviteLink}`,
            supportLink ? `Support: ${supportLink}` : null,
        ].filter(Boolean).join('\n');

        return ctx.sendTypedMessage({ embed, message });
    }
}
