const mongoose = require('mongoose');

const planetsSchema = new mongoose.Schema({
    keplerName: {
        type: String,
        required: true
    }
});

const planetModel = mongoose.model('Planet', planetsSchema);

module.exports = planetModel;