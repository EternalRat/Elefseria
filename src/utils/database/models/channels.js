const mongoose = require('mongoose');
const ChannelsGBW = new mongoose.Schema({
    channelWelcId: {type: String},
    channelGBId: {type: String},
    guildId: {type: String, required:true}
});

const Channels = module.exports = mongoose.model('ChannelsGBWs', ChannelsGBW);