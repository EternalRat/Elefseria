const mongoose = require('mongoose');
const Configs = new mongoose.Schema({
    raidmode: {type: Boolean, required:true},
    blacklist: {type: Boolean, required:true},
    time: {type: Number, required: true},
    people: {type: Number, required: true},
    guildId: {type: String, required: true, unique: true}
});

const configmodel = module.exports = mongoose.model('securityconfigs', Configs);