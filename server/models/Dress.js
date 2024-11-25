const mongoose = require('mongoose');

const dressSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    availableDates: [Date],
    images: [String],
});

module.exports = mongoose.model('Dress', dressSchema);
