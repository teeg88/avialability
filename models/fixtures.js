const mongoose = require('mongoose');

const availableSchema = mongoose.Schema({
    userId : String,
    available: String,
    firstName: String,
    lastName: String,
});

// define mongoose schema
const fixtureSchema = mongoose.Schema({
    fixDate: { type : Date, required : true },
    against: { type : String, required : true },
    team: { type : String, required : true },
    location: { type : String, required : true },
    players: [availableSchema],
});

module.exports = mongoose.model('Fixture', fixtureSchema);
