const mongoose = require('mongoose') 
const material = require('./material')

const projectSchema = new mongoose.Schema({
    name: {
        type: String,                       
        required: true                       
    },
    // byUser: {
    //     type: String,                        
    //     required: true                      
    // },
    // byCompany: {
    //     type: String,                        
    //     required: true                        
    // },
    user: {
        type: mongoose.Schema.Types.ObjectId,  // - referencing another object inside of our collections. 
        required: true,
        ref: 'User' // This name inside ' ' must match inside the suppliers.js inside the models folder. (model name)
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,  // - referencing another object inside of our collections. 
        required: true,
        ref: 'Company' // This name inside ' ' must match inside the suppliers.js inside the models folder. (model name)
    },
})

projectSchema.pre('remove', function(next) {
    material.find({ project: this.id }, (err, materials) => {
        if (err) {
            next(err)
        } else if (materials.length > 0) {
            next(new Error('This project has materials still, thus, cannot delete this project'))
        } else {
            next()
        }
    })
})

module.exports = mongoose.model('Project', projectSchema) 