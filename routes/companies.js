const express = require('express')
const router = express.Router()
const Material = require('../models/material')
const Supplier = require('../models/supplier')
const Company = require('../models/Company')

// const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

const { ensureAuthenticated } = require('../config/auth');

module.exports = router 