const mongoose = require("mongoose")
const ticketChannel = new mongoose.Schema({
    ticketType: {type: String, required: true},
    channelId: {type: String, required: true},
    messageId: {type: String, required: true},
    guildId: {type: String, required: true}
})

const ticketModel = module.exports = mongoose.model("ticketchannels", ticketChannel);