/**
 * Base class for handling component interactions (buttons, select menus, modals)
 */
export default class ComponentHandler {
    /**
     * @param {import('./Client.js').BotClient} client
     * @param {Object} options
     * @param {string|RegExp} options.customId - Custom ID string or regex pattern to match
     * @param {string} options.type - 'button' | 'selectMenu' | 'modal'
     * @param {number} options.cooldown - Cooldown in seconds (default: 0)
     */
    constructor(client, options = {}) {
        this.client = client;
        this.customId = options.customId;
        this.type = options.type || 'button';
        this.cooldown = options.cooldown || 0;
    }

    /**
     * Check if this handler matches the given custom ID
     * @param {string} customId
     * @returns {boolean}
     */
    matches(customId) {
        if (this.customId instanceof RegExp) {
            return this.customId.test(customId);
        }
        return this.customId === customId;
    }

    /**
     * Execute the handler
     * @param {import('discord.js').Interaction} interaction
     */
    async run(interaction) {
        throw new Error('ComponentHandler.run() must be implemented');
    }
}
