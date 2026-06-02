import Command from "../../structures/Command.js";
import { ActivityType, ApplicationCommandOptionType } from 'discord.js';
import Status from "../../schemas/status.js";

export default class StatusCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'status',
            description: {
                content: 'Manage bot status messages',
                usage: 'status <add|remove|list|edit|toggle|reload|clear>',
                examples: ['status add Playing with friends', 'status list', 'status reload'],
            },
            category: 'admin',
            aliases: [],
            cooldown: 3,
            permissions: {
                dev: true, // Only developers can use this
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: true,
            options: [
                {
                    name: 'add',
                    description: 'Add a new status message',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'type',
                            description: 'Type of activity',
                            type: ApplicationCommandOptionType.String,
                            required: true,
                            choices: [
                                { name: 'Playing', value: 'Playing' },
                                { name: 'Streaming', value: 'Streaming' },
                                { name: 'Listening', value: 'Listening' },
                                { name: 'Watching', value: 'Watching' },
                                { name: 'Custom', value: 'Custom' },
                                { name: 'Competing', value: 'Competing' }
                            ]
                        },
                        {
                            name: 'message',
                            description: 'The status message',
                            type: ApplicationCommandOptionType.String,
                            required: true,
                            max_length: 128
                        },
                        {
                            name: 'url',
                            description: 'Streaming URL (only for streaming type)',
                            type: ApplicationCommandOptionType.String,
                            required: false
                        },
                        {
                            name: 'status',
                            description: 'Bot\'s online status',
                            type: ApplicationCommandOptionType.String,
                            required: false,
                            choices: [
                                { name: 'Online', value: 'online' },
                                { name: 'Idle', value: 'idle' },
                                { name: 'Do Not Disturb', value: 'dnd' },
                                { name: 'Invisible', value: 'invisible' }
                            ]
                        }
                    ]
                },
                {
                    name: 'remove',
                    description: 'Remove a status message',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'id',
                            description: 'Status ID to remove',
                            type: ApplicationCommandOptionType.String,
                            required: true
                        }
                    ]
                },
                {
                    name: 'list',
                    description: 'List all status messages',
                    type: ApplicationCommandOptionType.Subcommand
                },
                {
                    name: 'edit',
                    description: 'Edit an existing status message',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'id',
                            description: 'Status ID to edit',
                            type: ApplicationCommandOptionType.String,
                            required: true
                        },
                        {
                            name: 'type',
                            description: 'Type of activity',
                            type: ApplicationCommandOptionType.String,
                            required: false,
                            choices: [
                                { name: 'Playing', value: 'Playing' },
                                { name: 'Streaming', value: 'Streaming' },
                                { name: 'Listening', value: 'Listening' },
                                { name: 'Watching', value: 'Watching' },
                                { name: 'Custom', value: 'Custom' },
                                { name: 'Competing', value: 'Competing' }
                            ]
                        },
                        {
                            name: 'message',
                            description: 'The status message',
                            type: ApplicationCommandOptionType.String,
                            required: false,
                            max_length: 128
                        },
                        {
                            name: 'url',
                            description: 'Streaming URL (only for streaming type)',
                            type: ApplicationCommandOptionType.String,
                            required: false
                        },
                        {
                            name: 'status',
                            description: 'Bot\'s online status',
                            type: ApplicationCommandOptionType.String,
                            required: false,
                            choices: [
                                { name: 'Online', value: 'online' },
                                { name: 'Idle', value: 'idle' },
                                { name: 'Do Not Disturb', value: 'dnd' },
                                { name: 'Invisible', value: 'invisible' }
                            ]
                        }
                    ]
                },
                {
                    name: 'toggle',
                    description: 'Enable or disable a status message',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'id',
                            description: 'Status ID to toggle',
                            type: ApplicationCommandOptionType.String,
                            required: true
                        },
                        {
                            name: 'enabled',
                            description: 'Enable or disable the status',
                            type: ApplicationCommandOptionType.Boolean,
                            required: true
                        }
                    ]
                },
                {
                    name: 'reload',
                    description: 'Reload status rotation from database',
                    type: ApplicationCommandOptionType.Subcommand
                },
                {
                    name: 'clear',
                    description: 'Clear all status messages',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'confirm',
                            description: 'Confirm you want to delete all statuses',
                            type: ApplicationCommandOptionType.Boolean,
                            required: true
                        }
                    ]
                }
            ],
        });
    }

    async run(ctx, args) {
        // This command only works as a slash command
        if (!ctx.isInteraction) {
            return ctx.sendMessage({
                content: '`❌` This command only works as a slash command. Use `/status` instead.'
            });
        }

        const subcommand = ctx.interaction.options.getSubcommand();
        await ctx.sendDeferMessage();

        try {
            switch (subcommand) {
                case 'add':
                    await this.handleAdd(ctx);
                    break;
                case 'remove':
                    await this.handleRemove(ctx);
                    break;
                case 'list':
                    await this.handleList(ctx);
                    break;
                case 'edit':
                    await this.handleEdit(ctx);
                    break;
                case 'toggle':
                    await this.handleToggle(ctx);
                    break;
                case 'reload':
                    await this.handleReload(ctx);
                    break;
                case 'clear':
                    await this.handleClear(ctx);
                    break;
                default:
                    await ctx.sendMessage({ content: '`❌` Unknown subcommand.' });
            }
        } catch (error) {
            this.client.logger.error(`Error in status command: ${error.message}`);
            await ctx.sendMessage({
                content: '`❌` An error occurred while processing the command.'
            }).catch(() => {});
        }
    }

    async handleAdd(ctx) {
        const type = ctx.interaction.options.getString('type');
        const message = ctx.interaction.options.getString('message');
        const url = ctx.interaction.options.getString('url');
        const status = ctx.interaction.options.getString('status') || 'online';

        // Validate streaming URL if type is streaming
        if (type === 'Streaming' && !url) {
            return ctx.sendMessage({
                content: '`❌` A URL is required for streaming status.'
            });
        }

        try {
            const newStatus = new Status({
                name: message,
                type: type,
                url: url,
                status: status,
                createdBy: ctx.author.id
            });

            await newStatus.save();

            const embed = this.client.embed()
                .setTitle('`✅` Status Added')
                .setDescription('New status message has been added successfully!')
                .addFields(
                    { name: '`🆔` ID', value: `\`${newStatus._id}\``, inline: false },
                    { name: '`📝` Type', value: type, inline: true },
                    { name: '`💬` Message', value: message, inline: true },
                    { name: '`🌐` Status', value: status, inline: true }
                )
                .setColor(this.client.color.success)
                .setTimestamp();

            if (url) {
                embed.addFields({ name: '`🔗` URL', value: url });
            }

            await ctx.sendMessage({ embeds: [embed] });
            this.client.logger.info(`Status added by ${ctx.author.globalName || ctx.author.username}: ${type} - ${message}`);

            // Reload status rotation
            await this.reloadStatusRotation();
        } catch (error) {
            this.client.logger.error(`Error adding status: ${error.message}`);
            await ctx.sendMessage({ content: '`❌` Failed to add status message.' });
        }
    }

    async handleRemove(ctx) {
        const statusId = ctx.interaction.options.getString('id');

        try {
            const statusToDelete = await Status.findById(statusId);

            if (!statusToDelete) {
                return ctx.sendMessage({
                    content: '`❌` Status not found. Use `/status list` to see available status IDs.'
                });
            }

            await Status.findByIdAndDelete(statusId);

            const embed = this.client.embed()
                .setTitle('`🗑️` Status Removed')
                .setDescription('Status message has been removed successfully!')
                .addFields(
                    { name: '`📝` Removed Status', value: `[${statusToDelete.type}] ${statusToDelete.name}` }
                )
                .setColor(this.client.color.error)
                .setTimestamp();

            await ctx.sendMessage({ embeds: [embed] });
            this.client.logger.info(`Status removed by ${ctx.author.globalName || ctx.author.username}: ${statusToDelete.name}`);

            // Reload status rotation
            await this.reloadStatusRotation();
        } catch (error) {
            this.client.logger.error(`Error removing status: ${error.message}`);
            await ctx.sendMessage({
                content: '`❌` Failed to remove status message. Please check the ID and try again.'
            });
        }
    }

    async handleList(ctx) {
        try {
            const statuses = await Status.find({}).sort({ createdAt: 1 });

            if (statuses.length === 0) {
                return ctx.sendMessage({
                    content: '`📋` No status messages found. Use `/status add` to create one!'
                });
            }

            const embed = this.client.embed()
                .setTitle('`📋` Bot Status Messages')
                .setColor(this.client.color.main || this.client.color.default)
                .setTimestamp()
                .setFooter({ text: `Total: ${statuses.length} statuses` });

            let description = '';
            statuses.forEach((status, index) => {
                const enabledIcon = status.enabled ? '✅' : '❌';
                const statusEmoji = this.getStatusEmoji(status.type);
                description += `${enabledIcon} **${index + 1}.** ${statusEmoji} [${status.type}] ${status.name}\n`;
                description += `   \`🆔\` \`${status._id}\` | \`🌐\` ${status.status}`;
                if (status.url) description += ` | [URL](${status.url})`;
                description += `\n\n`;
            });

            // Truncate if too long
            if (description.length > 4000) {
                description = description.substring(0, 3997) + '...';
            }

            embed.setDescription(description);
            await ctx.sendMessage({ embeds: [embed] });
        } catch (error) {
            this.client.logger.error(`Error listing statuses: ${error.message}`);
            await ctx.sendMessage({ content: '`❌` Failed to list status messages.' });
        }
    }

    async handleEdit(ctx) {
        const statusId = ctx.interaction.options.getString('id');
        const type = ctx.interaction.options.getString('type');
        const message = ctx.interaction.options.getString('message');
        const url = ctx.interaction.options.getString('url');
        const status = ctx.interaction.options.getString('status');

        try {
            const statusToEdit = await Status.findById(statusId);

            if (!statusToEdit) {
                return ctx.sendMessage({
                    content: '`❌` Status not found. Use `/status list` to see available status IDs.'
                });
            }

            // Update fields if provided
            if (type) statusToEdit.type = type;
            if (message) statusToEdit.name = message;
            if (url !== null && url !== undefined) statusToEdit.url = url;
            if (status) statusToEdit.status = status;

            await statusToEdit.save();

            const embed = this.client.embed()
                .setTitle('`✏️` Status Updated')
                .setDescription('Status message has been updated successfully!')
                .addFields(
                    { name: '`🆔` ID', value: `\`${statusToEdit._id}\``, inline: false },
                    { name: '`📝` Type', value: statusToEdit.type, inline: true },
                    { name: '`💬` Message', value: statusToEdit.name, inline: true },
                    { name: '`🌐` Status', value: statusToEdit.status, inline: true }
                )
                .setColor(this.client.color.success)
                .setTimestamp();

            await ctx.sendMessage({ embeds: [embed] });
            this.client.logger.info(`Status edited by ${ctx.author.globalName || ctx.author.username}: ${statusToEdit.name}`);

            // Reload status rotation
            await this.reloadStatusRotation();
        } catch (error) {
            this.client.logger.error(`Error editing status: ${error.message}`);
            await ctx.sendMessage({ content: '`❌` Failed to edit status message.' });
        }
    }

    async handleToggle(ctx) {
        const statusId = ctx.interaction.options.getString('id');
        const enabled = ctx.interaction.options.getBoolean('enabled');

        try {
            const statusToToggle = await Status.findById(statusId);

            if (!statusToToggle) {
                return ctx.sendMessage({
                    content: '`❌` Status not found. Use `/status list` to see available status IDs.'
                });
            }

            statusToToggle.enabled = enabled;
            await statusToToggle.save();

            const embed = this.client.embed()
                .setTitle(enabled ? '`✅` Status Enabled' : '`❌` Status Disabled')
                .setDescription(`Status has been ${enabled ? 'enabled' : 'disabled'} successfully!`)
                .addFields(
                    { name: '`📝` Status', value: `[${statusToToggle.type}] ${statusToToggle.name}` }
                )
                .setColor(enabled ? this.client.color.success : this.client.color.error)
                .setTimestamp();

            await ctx.sendMessage({ embeds: [embed] });
            this.client.logger.info(`Status toggled by ${ctx.author.globalName || ctx.author.username}: ${statusToToggle.name} -> ${enabled}`);

            // Reload status rotation
            await this.reloadStatusRotation();
        } catch (error) {
            this.client.logger.error(`Error toggling status: ${error.message}`);
            await ctx.sendMessage({ content: '`❌` Failed to toggle status.' });
        }
    }

    async handleReload(ctx) {
        try {
            await this.reloadStatusRotation();

            const embed = this.client.embed()
                .setTitle('`🔄` Status Rotation Reloaded')
                .setDescription('Status rotation has been reloaded from the database.')
                .setColor(this.client.color.success)
                .setTimestamp();

            await ctx.sendMessage({ embeds: [embed] });
            this.client.logger.info(`Status rotation reloaded by ${ctx.author.globalName || ctx.author.username}`);
        } catch (error) {
            this.client.logger.error(`Error reloading statuses: ${error.message}`);
            await ctx.sendMessage({ content: '`❌` Failed to reload status rotation.' });
        }
    }

    async handleClear(ctx) {
        const confirm = ctx.interaction.options.getBoolean('confirm');

        if (!confirm) {
            return ctx.sendMessage({
                content: '`⚠️` Please confirm by setting the confirm option to true.'
            });
        }

        try {
            const result = await Status.deleteMany({});

            const embed = this.client.embed()
                .setTitle('`🗑️` All Statuses Cleared')
                .setDescription(`Successfully deleted ${result.deletedCount} status messages.`)
                .setColor(this.client.color.error)
                .setTimestamp();

            await ctx.sendMessage({ embeds: [embed] });
            this.client.logger.info(`All statuses cleared by ${ctx.author.globalName || ctx.author.username}`);

            // Reload status rotation (will use defaults)
            await this.reloadStatusRotation();
        } catch (error) {
            this.client.logger.error(`Error clearing statuses: ${error.message}`);
            await ctx.sendMessage({ content: '`❌` Failed to clear status messages.' });
        }
    }

    getStatusEmoji(type) {
        const emojis = {
            'Playing': '🎮',
            'Streaming': '📺',
            'Listening': '🎵',
            'Watching': '👀',
            'Custom': '💬',
            'Competing': '🏆'
        };
        return emojis[type] || '📝';
    }

    getActivityType(typeString) {
        const activityTypes = {
            'Playing': ActivityType.Playing,
            'Streaming': ActivityType.Streaming,
            'Listening': ActivityType.Listening,
            'Watching': ActivityType.Watching,
            'Custom': ActivityType.Custom,
            'Competing': ActivityType.Competing
        };
        return activityTypes[typeString] || ActivityType.Playing;
    }

    async reloadStatusRotation() {
        try {
            // Clear any existing interval
            if (global.statusInterval) {
                clearInterval(global.statusInterval);
            }

            // Get enabled statuses from database
            const statuses = await Status.find({ enabled: true }).sort({ createdAt: 1 });

            let presences = [];

            if (statuses.length === 0) {
                this.client.logger.warn('No enabled status messages found in database, using default statuses');
                presences = [
                    {
                        status: 'online',
                        activities: [{
                            name: `${this.client.config.prefix}help | ${this.client.guilds.cache.size} servers`,
                            type: ActivityType.Watching
                        }]
                    }
                ];
            } else {
                // Convert database statuses to Discord format
                presences = statuses.map(status => {
                    const activityType = this.getActivityType(status.type);

                    const presence = {
                        status: status.status,
                        activities: [{
                            name: status.name,
                            type: activityType
                        }]
                    };

                    // Add URL for streaming
                    if (status.type === 'Streaming' && status.url) {
                        presence.activities[0].url = status.url;
                    }

                    return presence;
                });
            }

            // Start rotation
            let index = 0;

            // Set initial status
            if (presences.length > 0) {
                this.client.user.setPresence(presences[0]);
            }

            // Set up interval for rotation (15 seconds)
            global.statusInterval = setInterval(() => {
                if (presences.length > 0) {
                    this.client.user.setPresence(presences[index]);
                    index = (index + 1) % presences.length;
                }
            }, 15000);

            this.client.logger.info(`Status rotation initialized with ${presences.length} statuses`);
        } catch (error) {
            this.client.logger.error(`Error initializing status rotation: ${error.message}`);

            // Fallback to a simple default status
            this.client.user.setPresence({
                status: 'online',
                activities: [{
                    name: `${this.client.config.prefix}help`,
                    type: ActivityType.Watching
                }]
            });
        }
    }
}
