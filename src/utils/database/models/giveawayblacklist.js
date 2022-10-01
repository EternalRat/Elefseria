const mongoose = require('mongoose');
const blacklistGiveaway = new mongoose.Schema({
    guildId: {type: String, required:true},
	users: {type: Array, required: true}
});

module.exports = mongoose.model('blacklistgiveaway', blacklistGiveaway);