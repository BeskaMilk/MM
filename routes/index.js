const express = require('express')
const router = express.Router()
const Material = require('../models/material')

// Welcome Page
router.get('/', async (req, res) => {
    let materials
    try {
        materials = await Material.find().sort({ createdAt: 'desc' }).limit(10).exec()
    } catch {
        materials = []
    }
    res.render('index', { materials: materials })
})

const { ensureAuthenticated } = require('../config/auth');

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => 
    res.render('Dashboard', {
        name: req.user.name
    })); //after adding ensureAuthenticated, the dashboard is protected from viewing without logging in

module.exports = router 