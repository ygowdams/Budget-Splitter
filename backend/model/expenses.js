const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
        required: true
    },

    description: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true,
        min: 0
    },

    paidBy: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Expense", expenseSchema);