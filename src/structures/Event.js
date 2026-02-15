export default class Event {
   /**
    * 
    * @param {import('./Client.js').BotClient} client
    * @param {*} file 
    * @param {*} options 
    */
    constructor(client, file, options = {}) {
        this.client = client;
        this.name = options.name || file.name;
        this.once = options.once || false;
        this.file = file;
    }

    async _execute(...args) {
        try {
            await this.execute(...args);
        }
        catch (err) {
            this.client.logger.error(err);
        }
    }

    async reload() {
        const timestamp = Date.now();
        const module = await import(`../events/${this.name}.js?update=${timestamp}`);
        return module.default;
    }
}