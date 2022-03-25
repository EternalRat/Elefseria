const mongoose = require('mongoose');
const AddWarn = new mongoose.Schema({
    userId: {type: String, required:true},
    userName: {type: String, required: true},
    userIcon: {type: String, required: true},
    guildId: {type: String, required:true},
    count: {type: Number, required:true},
    reason: {type: Map, required:true},
    userTag: {type: Array, required:true},
    active: {type: Boolean}
});

const WarnModel = module.exports = mongoose.model('warns', AddWarn);