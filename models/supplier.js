const mongoose = require('mongoose') // - a library that we use to connect to mongoDB (mongoose library)
const material = require('./material')

const supplierSchema = new mongoose.Schema({ // - in mongoDB, Schema = table, in a normal SQL database. 
    name: {
        type: String,                        // - different columns for our schema (table), in JSON form.
        required: true                       // - there are tons of different configurations you can add. 
    },
    phone: {
        type: Number,                        // - different columns for our schema (table), in JSON form.
        required: true                       // - there are tons of different configurations you can add. 
    },
    weChat: {
        type: String,                        // - different columns for our schema (table), in JSON form.
        required: true                       // - there are tons of different configurations you can add. 
    }
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