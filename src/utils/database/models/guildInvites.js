const {Schema, model} = require("mongoose");
const GuildInvitesSchema = Schema({
    guildId: {type: String, required: true, unique: true},
    invites: {type: Map}
});

module.exports = model("guildInvites", GuildInvitesSchema);