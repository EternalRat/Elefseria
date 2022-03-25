const mongoose = require('mongoose');
const NbrAddWarn = new mongoose.Schema({
    id: {type: String, required:true},
    count: {type: Number, required:true}
});

const NbrWarnModel = module.exports = mongoose.model('nbrwarns', NbrAddWarn);