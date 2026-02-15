import Event from '../../structures/Event.js';
import GuildSettings from '../../schemas/Guild.js';

export default class GuildCreate extends Event {
    constructor(...args) {
        super(...args, {
            name: 'guildCreate'
        });
    }

    async run(guild) {
        this.client.logger.info(`Joined guild: ${guild.name} (${guild.id}) | Members: ${guild.memberCount}`);

        // Create default guild settings in DB
        try {
            const existing = await GuildSettings.findOne({ _id: guild.id });
            if (!existing) {
                await GuildSettings.create({
                    _id: guild.id,
                    prefix: this.client.config.prefix,
                });
                this.client.logger.info(`Created default settings for ${guild.name}`);
            }
        } catch (error) {
            this.client.logger.error(`Failed to create guild settings for ${guild.name}: ${error.message}`);
        }
    }
}
