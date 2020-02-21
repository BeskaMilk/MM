const mongoose = require('mongoose') // - a library that we use to connect to mongoDB (mongoose library)
const material = require('./material')

const supplierSchema = new mongoose.Schema({ // - in mongoDB, Schema = table, in a normal SQL database. 
    name: {
        type: String,                
        required: true                       
    },
    phone: {
        type: Number,                        
        required: true                       
    },
    weChat: {
        type: String,                        
        required: true                       
    },
    company: { //company who posted about this supplier
        type: mongoose.Schema.Types.ObjectId,  
        required: true,
        ref: 'Company'         
    },
    // searchKeywords: {
    //     type: String,
    //     required: true,
    // }
})

supplierSchema.pre('remove', function(next) {
    material.find({ supplier: this.id }, (err, materials) => {
        if (err) {
            next(err)
        } else if (materials.length > 0) {
            next(new Error('This supplier has materials still'))
        } else {
            next()
        }
    })
})

module.exports = mongoose.model('Supplier', supplierSchema) // - exprot this schema, give a name as 'Supplier' of this table.