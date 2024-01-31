const mongoose = require('mongoose');

const lessonsSchema = mongoose.Schema({
    expert: {
        type: Boolean,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    data: {
        type: Object,
        default: {
            editor: null,
            quiz: []
        },
    },
    deletedAt: {
        type: Date,
        default: null,
    }
}, { timestamps: true });

module.exports = mongoose.model('Lessons', lessonsSchema)