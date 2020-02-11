const express = require('express')
const router = express.Router()
const Material = require('../models/material')
// var Public = "public";


// Welcome / feed page (public)
router.get('/', async (req, res) => {
    // let materials
    try {
        // materials = await Material.find().sort({ createdAt: 'desc' }).limit(10).exec()

        // const supplier = await Supplier.find({})
        const materials = await Material.find({ isPublic : 'public' }).sort({ createdAt: 'desc' }).limit(10).exec() // .limit(6) this limits the search result in the show page, to 6 pictures at a time.
        
        res.render('index_public', {
            // supplier: supplier,
            publicMaterials: materials
        })

    } catch {
        materials = []

        // console.log(err)
        res.redirect('/')
    }
    // res.render('index_public', { materials: materials })
})


const { ensureAuthenticated } = require('../config/auth');

module.exports = router 