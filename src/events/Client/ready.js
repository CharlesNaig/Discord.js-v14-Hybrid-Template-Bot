import Event from "../../structures/Event.js";
import { reloadStatusRotation } from "../../utils/statusRotation.js";

export default class ClientReady extends Event {
  constructor(...args) {
    super(...args, { name: "clientReady" });
  }

  async run() {
    this.client.logger.ready(`Logged in as ${this.client.user.tag}`);
    this.client.logger.ready(`Serving ${this.client.guilds.cache.size} guilds with ${this.client.users.cache.size} users`);
    this.client.logger.ready(`Loaded ${this.client.commands.size} commands & ${this.client.events.size} events`);
    await reloadStatusRotation(this.client);
    this.initializeAntiCrash();
  }

  initializeAntiCrash() {
    process.on("unhandledRejection", (reason, promise) => {
      this.client.logger.error(`Unhandled Rejection at: ${promise}`);
      this.client.logger.error(`Reason: ${reason}`);
    });
    process.on("uncaughtException", (error) => {
      this.client.logger.error(`Uncaught Exception: ${error.message}`);
      this.client.logger.error(error.stack);
    });
    process.on("uncaughtExceptionMonitor", (error, origin) => {
      this.client.logger.error(`Uncaught Exception Monitor: ${error.message}`);
      this.client.logger.error(`Origin: ${origin}`);
    });
    process.on("warning", (warning) => {
      this.client.logger.warn(`Warning: ${warning.name}`);
      this.client.logger.warn(warning.message);
    });
    this.client.logger.info("Anti-crash handlers initialized");
  }
}
