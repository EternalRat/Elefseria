const mongoose = require("mongoose")
const moduleConfig = new mongoose.Schema({
	guildId: {type: String},
	funState: {type: Boolean},
	giveawayState: {type: Boolean},
	moderationState: {type: Boolean},
	reactionRoleState: {type: Boolean},
	securityState: {type: Boolean},
	settingsState: {type: Boolean},
	ticketState: {type: Boolean},
	voiceState: {type: Boolean}
})

const ModuleConfig = module.exports = mongoose.model("moduleconfig", moduleConfig);