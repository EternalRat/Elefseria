const mongoose = require("mongoose")
const moduleConfig = new mongoose.Schema({
	guildId: {type: String, unique: true},
	finalFantasyState: {type: Boolean},
	funState: {type: Boolean},
	giveawayState: {type: Boolean},
	levelingState: {type: Boolean},
	moderationState: {type: Boolean},
	reactionRoleState: {type: Boolean},
	securityState: {type: Boolean},
	settingsState: {type: Boolean},
	ticketState: {type: Boolean},
	voiceState: {type: Boolean}
})

module.exports = mongoose.model("moduleconfig", moduleConfig);