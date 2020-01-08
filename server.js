if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
} 

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const indexRouter = require('./routes/index') //dot means the location of the file is 'relative' to where we are now. (server.js file)
const supplierRouter = require('./routes/suppliers') 
const materialRouter = require('./routes/materials') //let's use materials routes .
const userRouter = require('./routes/users') //let's use materials routes .



// Passport config
require('./config/passport')(passport);


//configure express app
app.set('view engine', 'ejs') //use ejs as our view engine
app.set('views', __dirname + '/views') // __dirname means our current directory name, where this 'views'is from? from our current dir, in the views folder
app.set('layout', 'layouts/layout') // hookup expresslayouts, where our layoutfile is going to be, every single file is going to be put inside the layoutfile.
//don't need to add the head part and bottom part
app.use(expressLayouts) //we want to use expresslayouts
app.use(methodOverride('_method'))
app.use(express.static('public')) //where our public files are going to be : public files are: our style sheets etc. this is just going to be a folder.
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useUnifiedTopology: false, // - tried for so long time and finally fixed this problem. 
    // - mongoose.connect should always include this 'useUnifiedTopoloty: false' it should be false!!!!! 
    // - (don't worry about the deprecation warning.
    useNewUrlParser: true //may or may not need this part according to the version (mongoose)
}) //set up a connection with our mongoDB database. here, we're going to put the url for the mongoDB connection later on.
//when our web is deployed, this should be connected to a mongodb that's on the web somewhere.

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express Session (middleware for express-session)
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

// Middleware for Passport
app.use(passport.initialize());
app.use(passport.session());

// Connect flash (middleware for connect-flash)
app.use(flash());

// Global Vars (custom middleware to colour msgs in green/yello)
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error'); 
    next();
});


// Routes
//app.use('/', require('./routes/index'));
app.use('/', indexRouter) //now the index.js (in the routes folder) is connected to this server.js file.
app.use('/suppliers', supplierRouter) //
app.use('/materials', materialRouter) //
app.use('/users', userRouter);




app.listen(process.env.PORT || 3000)
