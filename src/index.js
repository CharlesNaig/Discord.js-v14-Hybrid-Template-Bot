import { BotClient } from "./structures/Client.js";

const client = new BotClient();

// ─── Anti-crash handlers ───
process.on('unhandledRejection', (reason, promise) => {
    client.logger.error(`Unhandled Rejection: ${reason}`);
});

process.on('uncaughtException', (error) => {
    client.logger.error(`Uncaught Exception: ${error.message}`);
    client.logger.error(error.stack);
});

process.on('uncaughtExceptionMonitor', (error) => {
    client.logger.error(`Uncaught Exception Monitor: ${error.message}`);
});

process.on('warning', (warning) => {
    client.logger.warn(`Warning: ${warning.message}`);
});

(async () => {
    await client.start();
})();

export default client;