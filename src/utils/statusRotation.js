import { ActivityType } from 'discord.js';
import Status from '../schemas/status.js';

const ROTATION_INTERVAL = 15000;
const activityTypes = {
    Playing: ActivityType.Playing,
    Streaming: ActivityType.Streaming,
    Listening: ActivityType.Listening,
    Watching: ActivityType.Watching,
    Custom: ActivityType.Custom,
    Competing: ActivityType.Competing
};

export async function reloadStatusRotation(client) {
    clearInterval(client.statusInterval);

    try {
        const statuses = await Status.find({ enabled: true }).sort({ createdAt: 1 });
        const presences = statuses.flatMap(({ type, name, url, status }) => {
            try {
                const activityType = activityTypes[type];
                if (activityType === undefined) throw new Error(`Invalid activity type: ${type}`);
                if (type === 'Streaming' && (!url || !/^https:\/\/(www\.)?(twitch\.tv|youtube\.com)\//i.test(url))) {
                    throw new Error(`Invalid streaming URL: ${url || '(missing)'}`);
                }

                const activity = { name, type: activityType };
                if (type === 'Streaming') activity.url = url;
                return [{ status, activities: [activity] }];
            } catch (error) {
                client.logger.error(`Skipping invalid saved status: ${error.message}`);
                return [];
            }
        });
        if (!presences.length) presences.push({
                status: 'online',
                activities: [{
                    name: `${client.config.prefix}help | ${client.guilds.cache.size} servers`,
                    type: ActivityType.Watching
                }]
            });

        let index = 0;
        const applyPresence = async () => {
            try {
                await client.user.setPresence(presences[index]);
                index = (index + 1) % presences.length;
            } catch (error) {
                client.logger.error(`Failed to update bot presence: ${error.message}`);
            }
        };

        await applyPresence();
        client.statusInterval = setInterval(applyPresence, ROTATION_INTERVAL);
        client.logger.info(`Status rotation initialized with ${presences.length} statuses`);
    } catch (error) {
        client.logger.error(`Error initializing status rotation: ${error.message}`);
        const fallback = {
            status: 'online',
            activities: [{ name: `${client.config.prefix}help`, type: ActivityType.Watching }]
        };
        const applyFallback = () => client.user.setPresence(fallback)
            .catch(retryError => client.logger.error(`Failed to set fallback presence: ${retryError.message}`));
        await applyFallback();
        client.statusInterval = setInterval(applyFallback, ROTATION_INTERVAL);
    }
}
