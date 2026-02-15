import { 
    EmbedBuilder, ContainerBuilder, TextDisplayBuilder, 
    SeparatorBuilder, SeparatorSpacingSize, MediaGalleryBuilder,
    MediaGalleryItemBuilder
} from 'discord.js';
import { resolveColor } from './resolveColor.js';

/**
 * Build all 3 message type formats at once for a command response.
 * Usage:
 *   const response = new MessageBuilder()
 *     .setTitle('`✅` Success')
 *     .setDescription('Operation completed.')
 *     .setColor('#57F287')
 *     .addField('`⏱️` Duration', '2.5s', true)
 *     .build();
 *   return ctx.sendTypedMessage(response);
 */
export class MessageBuilder {
    constructor() {
        this._title = '';
        this._description = '';
        this._color = 0x5865F2;
        this._fields = [];
        this._footer = '';
        this._thumbnail = null;
        this._image = null;
        this._timestamp = true;
    }

    setTitle(title) { this._title = title; return this; }
    setDescription(desc) { this._description = desc; return this; }
    setColor(color) { this._color = resolveColor(color); return this; }
    addField(name, value, inline = false) { this._fields.push({ name, value, inline }); return this; }
    setFooter(text) { this._footer = text; return this; }
    setThumbnail(url) { this._thumbnail = url; return this; }
    setImage(url) { this._image = url; return this; }
    setTimestamp(enabled = true) { this._timestamp = enabled; return this; }

    /**
     * Build embed format
     * @returns {EmbedBuilder}
     */
    buildEmbed() {
        const embed = new EmbedBuilder().setColor(this._color);
        if (this._title) embed.setTitle(this._title);
        if (this._description) embed.setDescription(this._description);
        if (this._fields.length) embed.addFields(this._fields);
        if (this._footer) embed.setFooter({ text: this._footer });
        if (this._thumbnail) embed.setThumbnail(this._thumbnail);
        if (this._image) embed.setImage(this._image);
        if (this._timestamp) embed.setTimestamp();
        return embed;
    }

    /**
     * Build V2 container format
     * @returns {ContainerBuilder}
     */
    buildV2() {
        const container = new ContainerBuilder().setAccentColor(this._color);
        
        if (this._image) {
            container.addMediaGalleryComponents(
                new MediaGalleryBuilder().addItems(
                    new MediaGalleryItemBuilder().setURL(this._image)
                )
            );
        }

        if (this._title) {
            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`# ${this._title}`)
            );
            container.addSeparatorComponents(
                new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
            );
        }

        if (this._description) {
            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(this._description)
            );
        }

        for (const field of this._fields) {
            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`**${field.name}**\n${field.value}`)
            );
        }

        if (this._footer) {
            container.addSeparatorComponents(
                new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
            );
            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`-# ${this._footer}`)
            );
        }

        return container;
    }

    /**
     * Build plain message format
     * @returns {string}
     */
    buildMessage() {
        const lines = [];
        if (this._title) lines.push(`**${this._title}**`);
        if (this._description) lines.push(this._description);
        if (lines.length && this._fields.length) lines.push('');
        for (const field of this._fields) {
            lines.push(`**${field.name}:** ${field.value}`);
        }
        if (this._footer) {
            lines.push('');
            lines.push(`-# ${this._footer}`);
        }
        return lines.join('\n');
    }

    /**
     * Build all three formats and return as object for ctx.sendTypedMessage()
     * @returns {{ embed: EmbedBuilder, componentsv2: ContainerBuilder[], message: string }}
     */
    build() {
        return {
            embed: this.buildEmbed(),
            componentsv2: [this.buildV2()],
            message: this.buildMessage(),
        };
    }
}
