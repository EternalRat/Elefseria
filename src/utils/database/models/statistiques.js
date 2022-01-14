const mongoose = require('mongoose');
const stats = new mongoose.Schema({
	guildId: {type: String},
	userId: {type: String},
	invitesCount: {type: Number},
	invitedUser: {type: Array},
	numberOfMsgs: {type: Number}
});

const Statistique = module.exports = mongoose.model('stats', stats);