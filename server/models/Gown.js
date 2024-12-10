const mongoose = require('mongoose');

const GownSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true }, // Example: "evening", "bridal"
    availability: { type: Array, default: [] }, // Availability dates (if needed)
}, { timestamps: true });

module.exports = mongoose.model('Gown', GownSchema);
