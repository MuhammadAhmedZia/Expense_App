const mongoose = require('mongoose');
const ExpenseSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    type: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

});

const Expense = mongoose.model('Expense',ExpenseSchema);

module.exports = Expense;