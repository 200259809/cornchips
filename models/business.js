// link to the database
var mongoose = require('mongoose');

// define what types of data the input will be
var BusinessSchema = new mongoose.Schema({
    filename: String,
    company: String,
    specialty: String,
    description: String,
    phonenumber: Number
});

// Make it so the model can be accessed by other pages
module.exports = mongoose.model('Business', BusinessSchema);