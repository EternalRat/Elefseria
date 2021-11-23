const mongoose = require('mongoose');
const NbrAddWarn = new mongoose.Schema({
    Id: {type: String, required:true},
    Count: {type: Number, required:true}
});

const NbrWarnModel = module.exports = mongoose.model('nbrwarns', NbrAddWarn);