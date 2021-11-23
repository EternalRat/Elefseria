const mongoose = require('mongoose');
const addGiveAwayCH = new mongoose.Schema({
    channelId: {type: String, required:true},
    count: {type: String, required:true},
    guildId: {type: String, required:true}
});

const GiveAwayCH = module.exports = mongoose.model('giveawaych', addGiveAwayCH);