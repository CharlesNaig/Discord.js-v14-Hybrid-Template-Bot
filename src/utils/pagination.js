import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

/**
 * Pagination utility for embed/V2 lists
 * Supports button-based page navigation with all 3 message types
 * 
 * Usage:
 *   const pages = [embed1, embed2, embed3]; // or build pages dynamically
 *   const paginator = new Paginator(ctx, pages, { timeout: 60000 });
 *   await paginator.start();
 */
export class Paginator {
    /**
     * @param {import('../structures/Context.js').default} ctx
     * @param {Array} pages - Array of embeds or content objects
     * @param {Object} options
     * @param {number} options.timeout - Collector timeout in ms (default: 60000)
     */
    constructor(ctx, pages, options = {}) {
        this.ctx = ctx;
        this.pages = pages;
        this.currentPage = 0;
        this.timeout = options.timeout || 60000;
    }

    /**
     * Build navigation buttons
     * @returns {ActionRowBuilder}
     */
    buildButtons() {
        return new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('paginator_first')
                .setEmoji('⏮️')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(this.currentPage === 0),
            new ButtonBuilder()
                .setCustomId('paginator_prev')
                .setEmoji('◀️')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(this.currentPage === 0),
            new ButtonBuilder()
                .setCustomId('paginator_page')
                .setLabel(`${this.currentPage + 1}/${this.pages.length}`)
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('paginator_next')
                .setEmoji('▶️')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(this.currentPage === this.pages.length - 1),
            new ButtonBuilder()
                .setCustomId('paginator_last')
                .setEmoji('⏭️')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(this.currentPage === this.pages.length - 1),
        );
    }

    /**
     * Start the paginator
     */
    async start() {
        if (this.pages.length === 0) return;

        if (this.pages.length === 1) {
            return this.ctx.sendMessage({ embeds: [this.pages[0]] });
        }

        const row = this.buildButtons();
        const msg = await this.ctx.sendMessage({ 
            embeds: [this.pages[0]], 
            components: [row] 
        });

        const collector = msg.createMessageComponentCollector({
            filter: (i) => i.user.id === this.ctx.author.id,
            time: this.timeout,
        });

        collector.on('collect', async (interaction) => {
            switch (interaction.customId) {
                case 'paginator_first':
                    this.currentPage = 0;
                    break;
                case 'paginator_prev':
                    this.currentPage = Math.max(0, this.currentPage - 1);
                    break;
                case 'paginator_next':
                    this.currentPage = Math.min(this.pages.length - 1, this.currentPage + 1);
                    break;
                case 'paginator_last':
                    this.currentPage = this.pages.length - 1;
                    break;
            }

            await interaction.update({
                embeds: [this.pages[this.currentPage]],
                components: [this.buildButtons()],
            });
        });

        collector.on('end', async () => {
            const disabledRow = new ActionRowBuilder().addComponents(
                ...row.components.map(btn => ButtonBuilder.from(btn).setDisabled(true))
            );
            await msg.edit({ components: [disabledRow] }).catch(() => {});
        });
    }
}
