import Event from "../../structures/Event.js";
import { ActivityType } from "discord.js";
import Status from "../../schemas/status.js";
export default class ClientReady extends Event {
  constructor(...args) {
    super(...args, {
      name: "clientReady",
      once: true,
    });
  }
  async run() {
    this.client.logger.ready(`Logged in as ${this.client.user.tag}`);
    this.client.logger.ready(
      `Serving ${this.client.guilds.cache.size} guilds with ${this.client.users.cache.size} users`,
    );
    this.client.logger.ready(
      `Loaded ${this.client.commands.size} commands & ${this.client.events.size} events`,
    );

    // Initialize status rotation from database
    await this.initializeStatusRotation();

    // Initialize anti-crash handler
    this.initializeAntiCrash();
  }

  /**
   * Initialize status rotation from database
   * Falls back to default statuses if none are configured
   */
  async initializeStatusRotation() {
    try {
      // Clear any existing interval
      if (global.statusInterval) {
        clearInterval(global.statusInterval);
      }

      // Get enabled statuses from database
      const statuses = await Status.find({ enabled: true }).sort({
        createdAt: 1,
      });

      let presences = [];

      if (statuses.length === 0) {
        this.client.logger.warn(
          "No enabled status messages found in database, using default statuses",
        );
        presences = [
          {
            status: "online",
            activities: [
              {
                name: `${this.client.config.prefix}help | ${this.client.guilds.cache.size} servers`,
                type: ActivityType.Watching,
              },
            ],
          },
          {
            status: "online",
            activities: [
              {
                name: "discord.gg/tambayan247",
                type: ActivityType.Custom,
              },
            ],
          },
        ];
      } else {
        // Convert database statuses to Discord format
        presences = statuses.map((status) => {
          const activityType = this.getActivityType(status.type);

          const presence = {
            status: status.status,
            activities: [
              {
                name: status.name,
                type: activityType,
              },
            ],
          };

          // Add URL for streaming
          if (status.type === "Streaming" && status.url) {
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

      this.client.logger.info(
        `Status rotation initialized with ${presences.length} statuses`,
      );
    } catch (error) {
      this.client.logger.error(
        `Error initializing status rotation: ${error.message}`,
      );

      // Fallback to a simple default status
      this.client.user.setPresence({
        status: "online",
        activities: [
          {
            name: `${this.client.config.prefix}help`,
            type: ActivityType.Watching,
          },
        ],
      });
    }
  }

  /**
   * Get Discord ActivityType from string
   * @param {string} typeString - Activity type string
   * @returns {ActivityType} Discord activity type
   */
  getActivityType(typeString) {
    const activityTypes = {
      Playing: ActivityType.Playing,
      Streaming: ActivityType.Streaming,
      Listening: ActivityType.Listening,
      Watching: ActivityType.Watching,
      Custom: ActivityType.Custom,
      Competing: ActivityType.Competing,
    };

    return activityTypes[typeString] || ActivityType.Playing;
  }

  /**
   * Initialize anti-crash error handlers
   */
  initializeAntiCrash() {
    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason, promise) => {
      this.client.logger.error(`Unhandled Rejection at: ${promise}`);
      this.client.logger.error(`Reason: ${reason}`);
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      this.client.logger.error(`Uncaught Exception: ${error.message}`);
      this.client.logger.error(error.stack);
    });

    // Handle uncaught exception monitor
    process.on("uncaughtExceptionMonitor", (error, origin) => {
      this.client.logger.error(`Uncaught Exception Monitor: ${error.message}`);
      this.client.logger.error(`Origin: ${origin}`);
    });

    // Handle warnings
    process.on("warning", (warning) => {
      this.client.logger.warn(`Warning: ${warning.name}`);
      this.client.logger.warn(warning.message);
    });

    this.client.logger.info("Anti-crash handlers initialized");
  }
}
