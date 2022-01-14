const mongoose = require('mongoose');
const AddWarn = new mongoose.Schema({
    userId: {type: String, required:true},
    guildId: {type: String, required:true},
    Count: {type: Number, required:true},
    Reason: {type: Map, required:true},
    userTag: {type: Array, required:true}
});

const WarnModel = module.exports = mongoose.model('warns', AddWarn);