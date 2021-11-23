const mongoose = require('mongoose');
const addUsersChannel = new mongoose.Schema({
    channelId: {type: String, required:true},
    guildId: {type: String, required:true}
});

const UsersChannel = module.exports = mongoose.model('users', addUsersChannel);