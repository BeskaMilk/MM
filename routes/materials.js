const express = require('express')
const router = express.Router()
const Material = require('../models/material')
const Supplier = require('../models/supplier')

// const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

const { ensureAuthenticated } = require('../config/auth');



// // *****---------- ROUTES ----------***** //

// // All Materials Route
// router.get('/', async (req, res) => {
//     let query = Material.find()
//     if (req.query.title != null && req.query.title != '') {
//       query = query.regex('title', new RegExp(req.query.title, 'i'))
//     }
//     if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
//       query = query.lte('publishDate', req.query.publishedBefore)
//     }
//     if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
//       query = query.gte('publishDate', req.query.publishedAfter)
//     }
//     try {
//       const materials = await query.exec()
//       res.render('materials/index', {
//         materials: materials,
//         searchOptions: req.query
//       })
//     } catch {
//       res.redirect('/')
// }})


// // New Material Route (build up MongoDB schema)
// router.get('/new', ensureAuthenticated, async (req,res) => { 
//     renderNewPage(res, new Material())
//     // get_userID();
// })


// // Create New Material Route 1
// router.post('/', ensureAuthenticated, async (req, res) => { 
//       // get_userID();
//       const material = new Material({
//         title: req.body.title,
//         supplier: req.body.supplier,
//         // user: User.id,
//         ossFileName: req.body.ossFileName,
//         projectName: req.body.projectName,
//         publishDate: new Date(req.body.publishDate),
//         cost: req.body.cost,
//         description: req.body.description,
//     })

//     try {
//         const newMaterial = await material.save()
//         res.redirect(`materials/${newMaterial.id}`)
//     } catch(err) {
//         renderNewPage(res, material, true)
//     }
// })


// // Show Material Route
// router.get('/:id', ensureAuthenticated, async (req, res) => {
//   try {
//     const material = await Material.findById(req.params.id)
//                                    .populate('supplier')
//                                    .exec()
    
//     res.render('materials/show', { material: material })
//   } catch {
//     res.redirect('/')
//   }
// })

// // Edit Material Route
// router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
//   try {
//     const material = await Material.findById(req.params.id)
//     renderEditPage(res, material)
//   } catch {
//     res.redirect('/')
//   }
// })

// // Update Material Route
// router.put('/:id', ensureAuthenticated, async (req, res) => {
//   let material

//   try {
//     material = await Material.findById(req.params.id)
//     material.title = req.body.title
//     material.thumbnailImageName = req.body.thumbnailImageName
//     material.supplier = req.body.supplier
//     material.publishDate = new Date(req.body.publishDate)
//     material.cost = req.body.cost
//     material.description = req.body.description
//     if (req.body.thumbnail != null && req.body.thumbnail !== '') {
//       // saveThumbnail(material, req.body.thumbnail)
//       //put(material, req.body.thumbnail)
//     }
//     await material.save()
//     res.redirect(`/materials/${material.id}`)
//   } catch {
//     if(material != null) {
//       renderEditPage(res,material,true)
//     } else {
//       redirect('/')
//     }
//   }
// })

// // Delete Material Page
// router.delete('/:id', ensureAuthenticated, async (req, res) => {
//   let material
//   try {
//     material = await Material.findById(req.params.id)
//     await material.remove()
//     res.redirect('/materials')
//   } catch {
//     if (material != null) {
//       res.render('materials/show', {
//         material: material,
//         errorMessage: 'Could not remove material'
//       })
//     } else {
//       res.redirect('/')
//     }
//   }
// })



// // ----------FUNCTIONS---------- //


// async function renderNewPage(res, material, hasError = false) {
//   renderFormPage(res, material, 'new', hasError)
// }

// async function renderEditPage(res, material, hasError = false) {
//   renderFormPage(res, material, 'edit', hasError)
// }

// async function renderFormPage(res, material, form, hasError = false) {
//   try {
//     const suppliers = await Supplier.find({})
//     const params = {
//       suppliers: suppliers,
//       material: material,
//       // user: user, // ************** added
//     }
//     if(hasError) {
//       if (form == 'edit') {
//         params.errorMessage = 'Error Updating Material'
//       } else {
//         params.errorMessage = 'Error Creating Material'
//       }
//     }
//     res.render(`materials/${form}`, params)
//   } catch {
//     res.redirect('/materials')
//   }
// }



// // Get User ID
// function get_userID()
// {
//     userID = document.getElementById("userID").value;
//     g_userID = userID;
//     console.log("this is user ID: " + g_userID);
// }


// function saveThumbnail(material, thumbnailEncoded) {
//     if (thumbnailEncoded == null) return
//     const thumbnail = JSON.parse(thumbnailEncoded)
//     if (thumbnail != null && imageMimeTypes.includes(thumbnail.type)) {
//         material.thumbnailImage = new Buffer.from(thumbnail.data, 'base64')
//         material.thumbnailImageType = thumbnail.type
//     }
// }

module.exports = router 