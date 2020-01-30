const mongoose = require('mongoose') // - a library that we use to connect to mongoDB (mongoose library)
const OSS = require('ali-oss');


// Alicloud OSS
let client = new OSS({
    region: 'oss-cn-beijing',
    accessKeyId: 'LTAI4FcLp7H4hkBF6RamDeJU',
    accessKeySecret: 'LC27jB4IfOfrsBwkxw2bo5iv07ugkY',
    bucket: 'material-image-list'
  });
  


// *****---------- MONGODB SCHEMA ----------***** //

const materialSchema = new mongoose.Schema({ // - in mongoDB, Schema = table, in a normal SQL database. 
    title: {
        type: String,                        // - different columns for our schema (table), in JSON form.
        required: true                       // - there are tons of different configurations you can add. 
    },
    description: {
        type: String,                        // - different columns for our schema (table), in JSON form.
    },
    publishDate: {
        type: Date,  
        required: true
    },
    cost: {
        type: Number,  
        required: true
    },
    createdAt: {
        type: Date,  
        required: true,
        default: Date.now
    },
    // thumbnailImageName: {
    //     type: String,
    //     required:true
    // },
    // thumbnailImageType: {
    //     type: String,
    //     requried: true,
    // },
    // thumbnail: {
    //     type: Buffer,
    //     required: true,
    // },
    ossFileName: {
        type: String,
        requried: true,
    },
    projectName: {
        type: String,
        requried: true,
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,  // - referencing another object inside of our collections. 
        required: true,
        ref: 'Supplier' // This name inside ' ' must match inside the suppliers.js inside the models folder. (model name)
    },
}) 


// materialSchema.virtual('thumbnailImagePath').get(function() {
//     if (this.thumbnailImage != null && this.thumbnailImageType != null) {
//       return `data:${this.thumbnailImageType};charset=utf-8;base64,${this.thumbnailImage.toString('base64')}`
//     }
// })

module.exports = mongoose.model('Material', materialSchema) // - exprot this schema, give a name as 'Supplier' of this table.

