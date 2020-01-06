const express = require('express')
const router = express.Router()
const Material = require('../models/material')
const Supplier = require('../models/supplier')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

// All Materials Route
router.get('/', async (req, res) => {
    let query = Material.find()
    if (req.query.title != null && req.query.title != '') {
      query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
      query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
      query = query.gte('publishDate', req.query.publishedAfter)
    }
    try {
      const materials = await query.exec()
      res.render('materials/index', {
        materials: materials,
        searchOptions: req.query
      })
    } catch {
      res.redirect('/')
    }})


// New Material Route
router.get('/new', async (req,res) => { 
    renderNewPage(res, new Material())
})

// Create New Material Route
router.post('/', async (req, res) => { 
    const fileName = req.file != null ? req.file.filename : null
    const material = new Material({
        title: req.body.title,
        supplier: req.body.supplier,
        publishDate: new Date(req.body.publishDate),
        cost: req.body.cost,
        description: req.body.description
    })

    saveThumbnail(material, req.body.thumbnail)

    try {
        const newMaterial = await material.save()
        // res.redirect(`materials/${newMaterial.id}`)
        res.redirect(`materials`)
    } catch {
        renderNewPage(res, material, true)
    }
})

async function renderNewPage(res, material, hasError = false) {
    try {
        const suppliers = await Supplier.find({})
        const params = {
            suppliers: suppliers,
            material: material
        }
        if (hasError) params.errorMessage = 'Error Creating Material'
        res.render('materials/new', params) 
    } catch {
        res.redirect('/materials')
    }
}

function saveThumbnail(material, thumbnailEncoded) {
    if (thumbnailEncoded == null) return
    const thumbnail = JSON.parse(thumbnailEncoded)
    if (thumbnail != null && imageMimeTypes.includes(thumbnail.type)) {
        material.thumbnailImage = new Buffer.from(thumbnail.data, 'base64')
        material.thumbnailImageType = thumbnail.type
    }
}

module.exports = router 