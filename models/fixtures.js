const mongoose = require('mongoose');

// define mongoose schema
const fixtureSchema = mongoose.Schema({
    fixDate: { type : Date, required : true },
    against: { type : String, required : true },
    team: { type : String, required : true },
    location: { type : String, required : true }
});

module.exports = mongoose.model('Fixture', fixtureSchema);
