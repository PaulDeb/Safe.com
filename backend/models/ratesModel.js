const mongoose = require('mongoose');

const ratesSchema = mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    rate: {
        type: Number,
        required: true,
    },
    creator: {
        type: String,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    }
}, { timestamps: true });

module.exports = mongoose.model('Rates', ratesSchema)