const {Schema, model} = require("mongoose");
const Guilds = Schema({
	guildName: {type: String},
	guildId: {type: String, unique: true},
	guildIcon: {type: String},
	userCount: {type: Number}
})

module.exports = model("guilds", Guilds);