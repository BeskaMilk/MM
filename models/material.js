const mongoose = require('mongoose') // - a library that we use to connect to mongoDB (mongoose library)
const OSS = require('ali-oss');


// // Alicloud OSS
// let client = new OSS({
//     region: 'oss-cn-beijing',
//     accessKeyId: 'LTAI4FcLp7H4hkBF6RamDeJU',
//     accessKeySecret: 'LC27jB4IfOfrsBwkxw2bo5iv07ugkY',
//     bucket: 'material-image-list'
//   });
  


// *****---------- MONGODB SCHEMA ----------***** //

const materialSchema = new mongoose.Schema({ // - in mongoDB, Schema = table, in a normal SQL database. 
    title: {
        type: String,                        // - different columns for our schema (table), in JSON form.
        required: true                       // - there are tons of different configurations you can add. 
    },
    description: {
        type: String,                        // - different columns for our schema (table), in JSON form.
    },
    // publishDate: {
    //     type: Date,  
    //     required: true
    // },
    cost: {
        type: Number,  
        required: true
    },
    createdAt: {
        type: Date,  
        required: true,
        default: Date.now
    },
    ossFileName: {
        type: String,
        requried: true,
    },
    projectName: {
        type: String,
        requried: true,
    },
    isPublic: {
        type: String,
        required: true,
    },
    tags_input: {
        type: Array,
        required: true,
    },
    tags_input_string: {
        type: String,
        required: true,
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,  // - referencing another object inside of our collections. 
        required: true,
        ref: 'Supplier' // This name inside ' ' must match inside the suppliers.js inside the models folder. (model name)
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,  // - referencing another object inside of our collections. 
        required: true,
        ref: 'Project' // This name inside ' ' must match inside the suppliers.js inside the models folder. (model name)
    },
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,  // - referencing another object inside of our collections. 
    //     required: true,
    //     ref: 'user' // This name inside ' ' must match inside the suppliers.js inside the models folder. (model name)
    // },
    company: {
        type: mongoose.Schema.Types.ObjectId,  // - referencing another object inside of our collections. 
        required: true,
        ref: 'Company' // This name inside ' ' must match inside the suppliers.js inside the models folder. (model name)
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,  // - referencing another object inside of our collections. 
        required: true,
        ref: 'User' // This name inside ' ' must match inside the suppliers.js inside the models folder. (model name)
    },
    userName: {
        type: String,  // - referencing another object inside of our collections. 
        required: false,
        ref: 'User' // This name inside ' ' must match inside the suppliers.js inside the models folder. (model name)
    },
    searchKeywords: {
        type: String,
        required: true,
    }
}) 


module.exports = mongoose.model('Material', materialSchema) // - exprot this schema, give a name as 'Supplier' of this table.

