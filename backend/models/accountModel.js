const mongoose = require('mongoose');
var crypto = require('crypto');

const accountSchema = mongoose.Schema({
    pseudo: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    admin: {
        type: Boolean,
        default: false,
    },
    lessonEnded: {
        type: Array,
        required: true,
    },
    lessonInProgress: {
        type: Array,
        required: true,
    },
    expert: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        required: false,
        default: null,
    },
    hash: String,
    salt: String,
}, { timestamps: true });

accountSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
}

accountSchema.methods.validPassword = function (password) {
    console.log(this.salt);
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
}

module.exports = mongoose.model('Account', accountSchema)