import Event from '../../structures/Event.js';
import { ActivityType } from 'discord.js';

export default class ClientReady extends Event {
    constructor(...args) {
        super(...args, {
            name: 'clientReady',
            once: true
        });
    }
    async run() {
        this.client.logger.ready(`Logged in as ${this.client.user.tag}`);
        this.client.logger.ready(`Serving ${this.client.guilds.cache.size} guilds with ${this.client.users.cache.size} users`);
        this.client.logger.ready(`Loaded ${this.client.commands.size} commands & ${this.client.events.size} events`);
        
        // Rotate presence every 30s
        const activities = [
            { name: `${this.client.config.prefix}help | ${this.client.guilds.cache.size} servers`, type: ActivityType.Watching },
            { name: `${this.client.users.cache.size} users`, type: ActivityType.Listening },
            { name: `v14.25.1 | ${this.client.commands.size} commands`, type: ActivityType.Playing },
        ];

        let index = 0;
        this.client.user.setPresence({ activities: [activities[0]], status: 'online' });

        setInterval(() => {
            index = (index + 1) % activities.length;
            // Update dynamic counts
            activities[0].name = `${this.client.config.prefix}help | ${this.client.guilds.cache.size} servers`;
            activities[1].name = `${this.client.users.cache.size} users`;
            this.client.user.setPresence({ activities: [activities[index]], status: 'online' });
        }, 30000);
    }
}