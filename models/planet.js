const mongoose = require('mongoose');

const planetSchema = mongoose.Schema({
    name: String,
    isGasGiant: Boolean
});

module.exports = mongoose.model('Planet', planetSchema); 