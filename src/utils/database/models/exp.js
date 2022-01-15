const mongoose = require('mongoose');
const expSchema = new mongoose.Schema({
	guildId: {type: String},
	userId: {type: String},
	exp: {type: Number},
	level: {type: Number},
	lastDateMessage: {type: Date}
});

const exp = module.exports = mongoose.model('levels', expSchema);