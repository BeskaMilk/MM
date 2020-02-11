const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        requried: true
    },
    // admin: {
    //     type: mongoose.Schema.Types.ObjectId,  // - referencing another object inside of our collections. 
    //     ref: 'User' // This name inside ' ' must match inside the suppliers.js inside the models folder. (model name)
    // },
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

