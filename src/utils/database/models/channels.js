const mongoose = require('mongoose');
const ChannelsGBW = new mongoose.Schema({
    channelWelcId: {type: String},
    channelGBId: {type: String},
    guildId: {type: String, unique: true, required:true}
});

module.exports = mongoose.model('ChannelsGBWs', ChannelsGBW);