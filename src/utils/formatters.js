/**
 * Format milliseconds to human-readable uptime
 * @param {number} ms - Milliseconds
 * @returns {string}
 */
export function formatUptime(ms) {
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / 60000) % 60;
    const hours = Math.floor(ms / 3600000) % 24;
    const days = Math.floor(ms / 86400000);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

/**
 * Format bytes to human-readable
 * @param {number} bytes
 * @returns {string}
 */
export function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Truncate text to max length
 * @param {string} str
 * @param {number} max
 * @returns {string}
 */
export function truncate(str, max = 1024) {
    return str.length > max ? str.slice(0, max - 3) + '...' : str;
}

/**
 * Format a Discord timestamp
 * @param {Date} date
 * @param {string} style - R (relative), F (full), f (short), D (date), d (short date), T (time), t (short time)
 * @returns {string}
 */
export function timestamp(date, style = 'R') {
    const unix = Math.floor(date.getTime() / 1000);
    return `<t:${unix}:${style}>`;
}

/**
 * Format a number with commas
 * @param {number} num
 * @returns {string}
 */
export function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Capitalize first letter
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
