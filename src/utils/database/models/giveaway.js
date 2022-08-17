const mongoose = require('mongoose');
const addGiveAway = new mongoose.Schema({
    guildId: {type: String, required: true},
    messageId: {type: String, required: true},
    channelId: {type: String, required: true},
    HostId: {type: String, required: true},
    prize: {type: String, required: true},
    winners: {type: Number, required: true},
    createdOn: {type: Date, required: true},
    endsOn: {type: Date, required: true},
    duration: {type: String, required: true}
});

const Giveaway = module.exports = mongoose.model('giveaway', addGiveAway);