const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        requried: true
    },
    email: {
        type: String,
        requried: true
    },
    password: {
        type: String,
        requried: true
    },
    date: {
        type: Date,
        default: Date.now
    },
})

const User = mongoose.model('User', UserSchema);

module.exports = User;
