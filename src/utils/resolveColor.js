/**
 * Resolve a hex color string to a decimal number for discord.js
 * @param {string|number} color - Hex string ("#5865F2") or number (0x5865F2)
 * @returns {number}
 */
export function resolveColor(color) {
    if (typeof color === 'number') return color;
    if (typeof color === 'string') {
        return parseInt(color.replace('#', ''), 16);
    }
    return 0x5865F2; // Default blurple
}
