const mongoose = require('mongoose');
const stats = new mongoose.Schema({
	guildId: {type: String},
	userId: {type: String},
	joinedCount: {type: Number},
	leftCount: {type: Number},
	fakeCount: {type: Number},
	bonusCount: {type: Number},
	invitedUser: {type: Map},
	numberOfMsgs: {type: Number}
});

const Statistique = module.exports = mongoose.model('stats', stats);