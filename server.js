if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
} 

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')

const indexRouter = require('./routes/index') //dot means the location of the file is 'relative' to where we are now. (server.js file)
const supplierRouter = require('./routes/suppliers') 



//configure express app
app.set('view engine', 'ejs') //use ejs as our view engine
app.set('views', __dirname + '/views') // __dirname means our current directory name, where this 'views'is from? from our current dir, in the views folder
app.set('layout', 'layouts/layout') // hookup expresslayouts, where our layoutfile is going to be, every single file is going to be put inside the layoutfile.
//don't need to add the head part and bottom part
app.use(expressLayouts) //we want to use expresslayouts
app.use(express.static('public')) //where our public files are going to be : public files are: our style sheets etc. this is just going to be a folder.
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true //may or may not need this part according to the version (mongoose)
}) //set up a connection with our mongoDB database. here, we're going to put the url for the mongoDB connection later on.
//when our web is deployed, this should be connected to a mongodb that's on the web somewhere.

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))


app.use('/', indexRouter) //now the index.js (in the routes folder) is connected to this server.js file.
app.use('/suppliers', supplierRouter) //


app.listen(process.env.PORT || 3000)
