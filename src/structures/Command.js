/**
 * @typedef {Object} CommandOptions Class Properties
 * @property {string} name Name for the command
 * @property {{ content: string; usage: string; examples: Array<string>}} description A description with three more properties for the command
 * @property {?Array<string>} aliases A array of aliases for the command
 * @property {?number} cooldown The cooldown for the command
 * @property {?boolean} args Whether the command requires arguments
 * @property {?{ dev: boolean; client: import('discord.js').PermissionResolvable; user: import('discord.js').PermissionResolvable }} permissions Permission Resolves
 * @property {?boolean} slashCommand To specify if it's a slash command
 * @property {?import('discord.js').ApplicationCommandOption} options Slash Command options
 * @property {?string} category The category the command belongs to
 */
export default class Command {
  /**
   *
   * @param {import('./Client.js').BotClient} client
   * @param {CommandOptions} options
   */
  constructor(client, options) {
    this.client = client;
    this.name = options.name;
    this.nameLocalizations = options.nameLocalizations;
    this.description = {
      content: options.description
        ? options.description.content || "No description provided"
        : "No description provided",
      usage: options.description
        ? options.description.usage || "No usage provided"
        : "No usage provided",
      examples: options.description
        ? options.description.examples || []
        : [],
    };
    this.descriptionLocalizations = options.descriptionLocalizations;
    this.aliases = options.aliases || [];
    this.cooldown = options.cooldown || 3;
    this.args = options.args || false;
    this.permissions = {
      dev: options.permissions ? options.permissions.dev || false : false,
      client: options.permissions
        ? options.permissions.client || []
        : ["SendMessages", "ViewChannel", "EmbedLinks"],
      user: options.permissions ? options.permissions.user || [] : [],
    };
    this.slashCommand = options.slashCommand || false;
    this.options = options.options || [];
    this.category = options.category || "general";
  }
}
