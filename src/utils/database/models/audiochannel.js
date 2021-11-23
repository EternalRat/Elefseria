const mongoose = require("mongoose")
const audioChannel = new mongoose.Schema({
    normalChannelId: {type: String, required: true},
    premiumChannelId: {type: String, required: true},
    guildId: {type: String, required: true}
})

const audioModel = module.exports = mongoose.model("audiochannels", audioChannel);