import Event from '../../structures/Event.js';
import { reloadStatusRotation } from '../../utils/statusRotation.js';

export default class ShardResume extends Event {
    constructor(...args) {
        super(...args, { name: 'shardResume' });
    }

    async run() {
        await reloadStatusRotation(this.client);
    }
}
