import { config } from "./src/config.js";
import { ShardingManager } from "discord.js";
import Logger from "./src/structures/Logger.js";
import figlet from 'figlet';
import axios from 'axios';
import chalk from 'chalk';

const logger = new Logger({
  displayTimestamp: true,
  displayDate: true,
});

(async () => {
  console.clear();

  try {
    // Fetch bot username from Discord API
    const res = await axios.get('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bot ${config.token}` }
    });
    const botName = res.data.username;

    // Generate ASCII art banner
    const art = await new Promise((resolve, reject) => {
      figlet(botName, { font: 'Standard' }, (err, data) => { 
        if (err) {
          logger.warn('figlet failed to generate ASCII banner.');
          resolve('');
        } else {
          resolve(data);
        }
      });
    });

    // Log colored banner
    if (art) {
      console.log(chalk.hex(config.color.default)(art)); // Can change in config.js to use different color for banner
    }
  } catch (error) {
    logger.error('Failed to fetch bot info or generate banner:', error.message);
  }

  // Proceed with shard spawning
  const manager = new ShardingManager("./src/index.js", {
    respawn: true,
    autoSpawn: true,
    token: config.token,
    totalShards: 1,
    shardList: "auto",
  });

  manager.spawn({ amount: manager.totalShards, delay: null, timeout: -1 }).then((shards) => {
      logger.start(`[CLIENT] ${shards.size} shard(s) spawned.`);
    }).catch((err) => {
      logger.error("[CLIENT] An error has occurred :", err);
    });

  manager.on("shardCreate", (shard) => {
    shard.on("ready", () => {
      logger.start(`[CLIENT] Shard ${shard.id} connected to Discord's Gateway.`);
    });
  });

  manager.on("error", (error) => {
      logger.error(`[SHARD MANAGER] An error occurred: ${error.message}`);
  });
})();