const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        requried: true
    },
    name_eng: {
        type: String,
        requried: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        requried: true
    },
    comProfPicName: {
        type: String,
    },
    comProfPicURL: {
        type: String,
    },
    alliances: {
        type: Array,
    },
    alliances_string: {
        type: String,
    },
})

const Company = mongoose.model('Company', CompanySchema);

module.exports = Company;

