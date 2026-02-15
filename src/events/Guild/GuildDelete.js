import Event from '../../structures/Event.js';
import GuildSettings from '../../schemas/Guild.js';

export default class GuildDelete extends Event {
    constructor(...args) {
        super(...args, {
            name: 'guildDelete'
        });
    }

    async run(guild) {
        this.client.logger.info(`Left guild: ${guild.name} (${guild.id}) | Members: ${guild.memberCount}`);

        // Remove cached guild settings
        this.client.guildSettings.delete(guild.id);

        // Optionally cleanup DB (uncomment to auto-delete guild data on leave)
        // try {
        //     await GuildSettings.deleteOne({ _id: guild.id });
        //     this.client.logger.info(`Cleaned up settings for ${guild.name}`);
        // } catch (error) {
        //     this.client.logger.error(`Failed to cleanup guild settings for ${guild.name}: ${error.message}`);
        // }
    }
}
