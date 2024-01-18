const mongoose = require('mongoose');

const modulesSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    lessons: {
        type: Array,
        required: true,
    },
    expert: {
        type: Boolean,
        default: false,
    },
    rates: {
        type: Array,
        required: true,
    },
    difficulty: {
        type: Number,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    }
}, { timestamps: true });

modulesSchema.methods.addLesson = function (lessonId) {
    this.lessons.push(lessonId);
}

modulesSchema.methods.removeLesson = function (lessonId) {
    this.lessons = this.lessons.filter((id) => id !== lessonId);
}

modulesSchema.methods.addRate = function (rateId) {
    this.rates.push(rateId);
}

modulesSchema.methods.removeRate = function (rateId) {
    this.rates = this.rates.filter((id) => id !== rateId);
}

module.exports = mongoose.model('Modules', modulesSchema)