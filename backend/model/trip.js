const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        required: true,
        min: 0
    },
    members: {
        type: [String],
        required: true
    }
});

module.exports = mongoose.model("Trip", tripSchema);