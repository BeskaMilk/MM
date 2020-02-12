const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        requried: true
    },
    date: {
        type: Date,
        default: Date.now
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
})

const Company = mongoose.model('Company', CompanySchema);

module.exports = Company;

