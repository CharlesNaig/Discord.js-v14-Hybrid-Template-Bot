import pkg from 'mongoose';
const { Schema, model } = pkg;

const Warning = new Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    moderatorId: { type: String, required: true },
    reason: { type: String, default: 'No reason provided' },
    createdAt: { type: Date, default: Date.now },
});

Warning.index({ guildId: 1, userId: 1 });

export default model('Warning', Warning);
