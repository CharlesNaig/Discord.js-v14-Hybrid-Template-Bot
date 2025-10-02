import Event from "../../structures/Event.js";
import Context from "../../structures/Context.js";
import { InteractionType, Collection, PermissionFlagsBits, CommandInteraction } from "discord.js";

export default class InteractionCreate extends Event {
    constructor(...args) {
        super(...args, {
            name: 'interactionCreate'
        });
    }
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    async run(interaction) {
        if (interaction.type === InteractionType.ApplicationCommand) {
            const { commandName } = interaction;
            if (!commandName) return await interaction.reply({ content: 'Unknown interaction!' }).catch(() => { });
            
            const cmd = this.client.commands.get(interaction.commandName);
            if (!cmd || !cmd.slashCommand) return;
            
            const command = cmd.name.toLowerCase();
            const ctx = new Context(interaction, interaction.options.data);
            
            this.client.logger.cmd('%s used by %s from %s', command, ctx.author.id, ctx.guild?.id || 'DM');
            
            if (!interaction.inGuild() || !interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ViewChannel)) {
                return await interaction.reply({ content: 'I cannot see this channel!', ephemeral: true }).catch(() => { });
            }

            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) {
                return await interaction.author.send({ content: `I don't have **\`SEND_MESSAGES\`** permission in \`${interaction.guild.name}\`\nchannel: <#${interaction.channelId}>` }).catch(() => { });
            }

            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.EmbedLinks)) {
                return await interaction.reply({ content: 'I don\'t have **`EMBED_LINKS`** permission.', ephemeral: true }).catch(() => { });
            }

            // Check permissions
            if (cmd.permissions) {
                if (cmd.permissions.client) {
                    if (!interaction.guild.members.me.permissions.has(cmd.permissions.client)) {
                        return await interaction.reply({ content: 'I don\'t have enough permissions to execute this command.', ephemeral: true }).catch(() => { });
                    }
                }

                if (cmd.permissions.user) {
                    if (!interaction.member.permissions.has(cmd.permissions.user)) {
                        return await interaction.reply({ content: 'You don\'t have enough permissions to execute this command.', ephemeral: true }).catch(() => { });
                    }
                }
                
                if (cmd.permissions.dev) {
                    if (this.client.config.ownerID) {
                        const findDev = this.client.config.ownerID.find((x) => x === interaction.user.id);
                        if (!findDev) {
                            return await interaction.reply({ content: 'This command is only for developers.', ephemeral: true }).catch(() => { });
                        }
                    }
                }
            }

            // Cooldown handling
            if (!this.client.cooldowns.has(commandName)) {
                this.client.cooldowns.set(commandName, new Collection());
            }
            
            const now = Date.now();
            const timestamps = this.client.cooldowns.get(commandName);
            const cooldownAmount = Math.floor(cmd.cooldown || 5) * 1000;
            
            if (!timestamps.has(interaction.user.id)) {
                timestamps.set(interaction.user.id, now);
                setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
            } else {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
                const timeLeft = (expirationTime - now) / 1000;
                if (now < expirationTime && timeLeft > 0.9) {
                    return interaction.reply({ 
                        content: `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${commandName}\` command.`,
                        ephemeral: true
                    });
                }
                timestamps.set(interaction.user.id, now);
                setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
            }
            
            try {
                return await cmd.run(ctx, ctx.args);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    ephemeral: true,
                    content: 'An unexpected error occurred, the developers have been notified.',
                }).catch(() => { });
            }
        }
    }
}