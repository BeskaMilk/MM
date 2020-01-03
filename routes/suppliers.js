const express = require('express')
const router = express.Router()
const Supplier = require('../models/supplier')


// All Suppliers Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const suppliers = await Supplier.find(searchOptions)
        res.render('suppliers/index', { 
            suppliers: suppliers, 
            searchOptions: req.query 
        }) // - we're going to render suppliers/index, instead of rendering all the index for entire application.
    } catch {
        //res.redirect('/')
    }
})


// New Supplier Route
router.get('/new', (req,res) => { // - this is going to be a new route for suppliers
    res.render('suppliers/new', { supplier: new Supplier() }) // - this is just for displaying the form.
    // - pass this as variable and send this to the schema. pass a 'supplier' variable, and it's equal to 'new Supplier'. 
})

// Create New Supplier Route
// - This is actually going to be creating the supplier.
router.post('/', async (req, res) => { // - we use 'post' for creation. to create a new supplier.
    const supplier = new Supplier({
        name: req.body.name
    })
    try {
       const newSupplier = await supplier.save()
       // res.redirect(`authors/${newSupplier.id}`)
       res.redirect(`suppliers`)
    } catch {
        // res.render('suppliers/new', {
        // supplier: supplier,
        // errorMessage: 'Error creating Supplier'
        // })
    }
})


// About the index.ejs, and new.ejs inside the suppliers folder in the view folder:
// we're nesting this index.ejs, and new.ejs files inside the suppliers folder, because each one of the routes should be inside their own folder. except for the index route. 
// so when we create a books route, it'll be inside the books folder in the views that'll create views for that. 


module.exports = router 