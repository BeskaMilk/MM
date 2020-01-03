const mongoose = require('mongoose') // - a library that we use to connect to mongoDB (mongoose library)

const supplierSchema = new mongoose.Schema({ // - in mongoDB, Schema = table, in a normal SQL database. 
    name: {
        type: String,                        // - different columns for our schema (table), in JSON form.
        required: true                       // - there are tons of different configurations you can add. 
    }
})

module.exports = mongoose.model('Supplier', supplierSchema) // - exprot this schema, give a name as 'Supplier' of this table.