const mongoose = require('mongoose');
module.exports = mongoose.connect('mongodb://localhost:27017/Elefseria', { useNewUrlParser: true, useUnifiedTopology: true});