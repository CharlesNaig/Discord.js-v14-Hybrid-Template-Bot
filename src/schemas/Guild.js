import pkg from 'mongoose';
const { Schema, model } = pkg;

const GuildSettings = new Schema({
    _id: String,                                     // Guild ID
    prefix: { type: String, default: '!' },
    messageType: { 
        type: String, 
        enum: ['embed', 'componentsv2', 'message'], 
        default: 'embed' 
    },
    logging: {
        enabled: { type: Boolean, default: false },
        channel: { type: String, default: null },     // Log channel ID
        events: {
            messageDelete: { type: Boolean, default: true },
            messageUpdate: { type: Boolean, default: true },
            memberJoin: { type: Boolean, default: true },
            memberLeave: { type: Boolean, default: true },
            memberUpdate: { type: Boolean, default: true },
            channelCreate: { type: Boolean, default: true },
            channelDelete: { type: Boolean, default: true },
            channelUpdate: { type: Boolean, default: true },
            roleCreate: { type: Boolean, default: true },
            roleDelete: { type: Boolean, default: true },
            roleUpdate: { type: Boolean, default: true },
            banAdd: { type: Boolean, default: true },
            banRemove: { type: Boolean, default: true },
            voiceUpdate: { type: Boolean, default: true },
        }
    },
    welcome: {
        enabled: { type: Boolean, default: false },
        channel: { type: String, default: null },
        message: { type: String, default: 'Welcome {user} to {server}!' },
    },
    farewell: {
        enabled: { type: Boolean, default: false },
        channel: { type: String, default: null },
        message: { type: String, default: 'Goodbye {user}!' },
    },
    voiceSettings: {
        twentyFourSeven: { type: Boolean, default: false },
        voiceChannel: { type: String, default: null },
        textChannel: { type: String, default: null },
    },
    autoRole: {
        enabled: { type: Boolean, default: false },
        roles: [{ type: String }],
    },
}, { timestamps: true });

export default model('Guild', GuildSettings);
