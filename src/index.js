import { BotClient } from "./structures/Client.js";

const client = new BotClient();

(async () => {
    await client.start();
})();

export default client;