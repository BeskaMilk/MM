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
    phone: {
        type: String,
        required: true
    },
    weChat: {
        type: String,
        required: true
    },
    description: {
        type: String,                        // - different columns for our schema (table), in JSON form.
    },
    password: {
        type: String,
        requried: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    userProfilePicURL: {
        type: String,
        required: false,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,  // - referencing another object inside of our collections. 
        ref: 'Company' // This name inside ' ' must match inside the suppliers.js inside the models folder. (model name)
    },
    role: {
        type: String, // master / special / standard 
        required: true,
    },
})

const User = mongoose.model('User', UserSchema);

module.exports = User;

