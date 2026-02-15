import { config } from '../config.js';

/**
 * Get a custom emoji from config, fallback to unicode with backticks
 * @param {string} name - Emoji key from config.emojis
 * @param {string} fallback - Unicode fallback emoji
 * @returns {string}
 */
export function getEmoji(name, fallback = '▪️') {
    const emoji = config.emojis?.[name];
    if (emoji && !emoji.includes('EMOJI_ID')) return emoji;
    return `\`${fallback}\``;
}

// Pre-built status emojis (always unicode with backticks — for status messages)
export const StatusEmojis = {
    success: '`✅`',
    error: '`❌`',
    warning: '`⚠️`',
    loading: '`⏳`',
    info: '`ℹ️`',
    reload: '`🔄`',
};
