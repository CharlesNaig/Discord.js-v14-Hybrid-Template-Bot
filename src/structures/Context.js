import { CommandInteraction, Message, MessageFlags } from "discord.js";

export default class Context {
    constructor(ctx, args) {
        this.ctx = ctx;
        this.isInteraction = ctx instanceof CommandInteraction;
        this.interaction = this.isInteraction ? ctx : null;
        this.message = this.isInteraction ? null : ctx;
        this.id = ctx.id;
        this.channelId = ctx.channelId;
        this.client = ctx.client;
        this.author = ctx instanceof Message ? ctx.author : ctx.user;
        this.channel = ctx.channel;
        this.guild = ctx.guild;
        this.createdAt = ctx.createdAt;
        this.createdTimestamp = ctx.createdTimestamp;
        this.member = ctx.member;
        this.setArgs(args);
    }

    setArgs(args) {
        if (this.isInteraction) {
            this.args = args ? args.map(arg => arg.value) : [];
        } else {
            this.args = args || [];
        }
    }

    async sendMessage(content) {
        if (this.isInteraction) {
            this.msg = await this.interaction.reply(content);
            return this.msg;
        } else {
            this.msg = await this.message.channel.send(content);
            return this.msg;
        }
    }

    async editMessage(content) {
        if (this.isInteraction) {
            this.msg = await this.interaction.editReply(content);
            return this.msg;
        } else {
            this.msg = await this.msg.edit(content);
            return this.msg;
        }
    }

    async sendDeferMessage(content) {
        if (this.isInteraction) {
            this.msg = await this.interaction.deferReply({ fetchReply: true });
            return this.msg;
        } else {
            this.msg = await this.message.channel.send(content);
            return this.msg;
        }
    }

    async sendFollowUp(content) {
        if (this.isInteraction) {
            return await this.interaction.followUp(content);
        } else {
            return await this.channel.send(content);
        }
    }

    // ─── Get guild message type preference ───
    async getMessageType() {
        if (!this.guild) return this.client.config.defaultMessageType || 'embed';
        const settings = await this.client.getGuildSettings(this.guild.id);
        return settings?.messageType || this.client.config.defaultMessageType || 'embed';
    }

    // ─── Send with automatic message type routing ───
    async sendTypedMessage({ embed, componentsv2, message, ephemeral = false }) {
        const type = await this.getMessageType();

        switch (type) {
            case 'componentsv2':
                if (componentsv2) {
                    return this.sendMessage({
                        flags: MessageFlags.IsComponentsV2,
                        components: Array.isArray(componentsv2) ? componentsv2 : [componentsv2],
                        ...(ephemeral && { ephemeral: true })
                    });
                }
                if (embed) return this.sendMessage({ embeds: [embed], ...(ephemeral && { ephemeral: true }) });
                break;

            case 'message':
                if (message) return this.sendMessage({ content: message, ...(ephemeral && { ephemeral: true }) });
                if (embed) return this.sendMessage({ embeds: [embed], ...(ephemeral && { ephemeral: true }) });
                break;

            case 'embed':
            default:
                if (embed) return this.sendMessage({ embeds: [embed], ...(ephemeral && { ephemeral: true }) });
                if (message) return this.sendMessage({ content: message, ...(ephemeral && { ephemeral: true }) });
                break;
        }

        return this.sendMessage({ content: message || '`❌` No content to display.', ...(ephemeral && { ephemeral: true }) });
    }

    // ─── Edit with automatic message type routing ───
    async editTypedMessage({ embed, componentsv2, message }) {
        const type = await this.getMessageType();

        switch (type) {
            case 'componentsv2':
                if (componentsv2) {
                    return this.editMessage({
                        flags: MessageFlags.IsComponentsV2,
                        components: Array.isArray(componentsv2) ? componentsv2 : [componentsv2],
                        content: null, embeds: []
                    });
                }
                break;
            case 'message':
                if (message) return this.editMessage({ content: message, embeds: [], components: [] });
                break;
            case 'embed':
            default:
                if (embed) return this.editMessage({ embeds: [embed], content: null, components: [] });
                break;
        }
    }
}
