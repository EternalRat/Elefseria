const mongoose = require('mongoose');
const ChannelsGBW = new mongoose.Schema({
    joinMsgDM: {type: Boolean},
    channelJoin: {type: String},
    joinMsg: {type: String},
    channelLeft: {type: String},
    leftMsg: {type: String},
    memberCountChannel: {type: String},
    userCountChannel: {type: String},
    botCountChannel: {type: String},
    roleCountChannel: {type: String},
    channelCountChannel: {type: String},
    inviteLog: {type: String},
    inviteMsg: {type: String},
    msgLog: {type: String},
    voiceLog: {type: String},
    normalVoice: {type: String},
    premiumVoice: {type: String},
    betaVoice: {type: String},
    guildId: {type: String, unique: true, required:true}
});

module.exports = mongoose.model('settings', ChannelsGBW);