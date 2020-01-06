const express = require('express')
const router = express.Router()
const Material = require('../models/material')

router.get('/', async (req, res) => {
    let materials
    try {
        materials = await Material.find().sort({ createdAt: 'desc' }).limit(10).exec()
    } catch {
        materials = []
    }
    res.render('index', { materials: materials })
})


module.exports = router 