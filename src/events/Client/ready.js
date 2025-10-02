import Event from '../../structures/Event.js';

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
        
        this.client.user.setPresence({
            activities: [
                {
                    name: `${this.client.config.prefix}help | ${this.client.guilds.cache.size} servers`,
                    type: 3, // Watching
                }
            ],
            status: 'online',
        });
    }
}