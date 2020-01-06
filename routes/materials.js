const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')  // - this stands for ' file system'
const Material = require('../models/material')
const Supplier = require('../models/supplier')
const uploadPath = path.join('public', Material.thumbnailImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath, // - dest means destination of the img files that's gonna be on the website and public.
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})


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
router.post('/', upload.single('thumbnail'), async (req, res) => { 
    const fileName = req.file != null ? req.file.filename : null
    const material = new Material({
        title: req.body.title,
        supplier: req.body.supplier,
        publishDate: new Date(req.body.publishDate),
        cost: req.body.cost,
        thumbnailImageName: fileName,
        description: req.body.description
    })

    try {
        const newMaterial = await material.save()
        // res.redirect(`materials/${newMaterial.id}`)
        res.redirect(`materials`)
    } catch {
        if (material.thumbnailImageName != null) {
            removeMaterialThumbnail(material.thumbnailImageName)
        }
        renderNewPage(res, material, true)
    }
})

function removeMaterialThumbnail(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if(err) console.error(err)
    })
}

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

module.exports = router 