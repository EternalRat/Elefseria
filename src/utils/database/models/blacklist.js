const mongoose = require('mongoose');
const AddBan = new mongoose.Schema({
    userId: {type: String, required:true},
    Reason: {type: String, required:true}
});

const BanModel = module.exports = mongoose.model('blacklists', AddBan);