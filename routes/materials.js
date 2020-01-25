const express = require('express')
const router = express.Router()
const Material = require('../models/material')
const Supplier = require('../models/supplier')
// const Upload = require('../public/upload')

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const OSS = require('ali-oss')



// Alicloud OSS
let client = new OSS({
  region: 'oss-cn-beijing',
  //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
  accessKeyId: 'LTAI4FcLp7H4hkBF6RamDeJU',
  accessKeySecret: 'LC27jB4IfOfrsBwkxw2bo5iv07ugkY',
  bucket: 'material-image-list'
});



// *****---------- ROUTES ----------***** //

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



// function getFileName() {
//   if (fullPath) {

//       var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
//       var fullPath = document.getElementById('upload').value;

//       if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
//           filename = filename.substring(1);
//       }
//       alert(filename);
//   }
//   return filename
// }

// Create New Material Route
router.post('/', async (req, res) => { 
    const material = new Material({
        title: req.body.title,
        supplier: req.body.supplier,
        // thumbnailImageName: req.body.thumbnailImageName,
        // thumbnail: req.body.thumbnail,
        // ossFileName: req.body.supplier,
        publishDate: new Date(req.body.publishDate),
        cost: req.body.cost,
        description: req.body.description,
    })

    // saveThumbnail(material, req.body.thumbnail)
    // getFileName()
    // console.log("created"+req.body.filename)

    try {
        const newMaterial = await material.save()
        // let r1 = await client.put(req.body.thumbnailImageName, req.body.thumbnail); 
        // console.log(req.body.thumbnailImageName)
        // res.redirect(`materials/${newMaterial.id}`)
        res.redirect(`materials`)
    } catch(err) {
        renderNewPage(res, material, true)
    }
})

// Show Material Route
router.get('/:id', async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
                                   .populate('supplier')
                                   .exec()
    // const url = concat('https://material-image-list.oss-cn-beijing.aliyuncs.com/', material.thumbnailImageName, '.', material.thumbnailImageType)
    // material.URL = url
    
    res.render('materials/show', { material: material })
  } catch {
    res.redirect('/')
  }
})

// Edit Material Route
router.get('/:id/edit', async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
    renderEditPage(res, material)
  } catch {
    res.redirect('/')
  }
})

// Update Material Route
router.put('/:id', async (req, res) => {
  let material

  try {
    material = await Material.findById(req.params.id)
    material.title = req.body.title
    material.thumbnailImageName = req.body.thumbnailImageName
    material.supplier = req.body.supplier
    material.publishDate = new Date(req.body.publishDate)
    material.cost = req.body.cost
    material.description = req.body.description
    if (req.body.thumbnail != null && req.body.thumbnail !== '') {
      // saveThumbnail(material, req.body.thumbnail)
      //put(material, req.body.thumbnail)
    }
    await material.save()
    res.redirect(`/materials/${material.id}`)
  } catch {
    if(material != null) {
      renderEditPage(res,material,true)
    } else {
      redirect('/')
    }
  }
})

// Delete Material Page
router.delete('/:id', async (req, res) => {
  let material
  try {
    material = await Material.findById(req.params.id)
    await material.remove()
    res.redirect('/materials')
  } catch {
    if (material != null) {
      res.render('materials/show', {
        material: material,
        errorMessage: 'Could not remove material'
      })
    } else {
      res.redirect('/')
    }
  }
})



// ----------FUNCTIONS---------- //


async function renderNewPage(res, material, hasError = false) {
  renderFormPage(res, material, 'new', hasError)
}

async function renderEditPage(res, material, hasError = false) {
  renderFormPage(res, material, 'edit', hasError)
}

async function renderFormPage(res, material, form, hasError = false) {
  try {
    const suppliers = await Supplier.find({})
    const params = {
      suppliers: suppliers,
      material: material
    }
    if(hasError) {
      if (form == 'edit') {
        params.errorMessage = 'Error Updating Material'
      } else {
        params.errorMessage = 'Error Creating Material'
      }
    }
    res.render(`materials/${form}`, params)
  } catch {
    res.redirect('/materials')
  }
}



// function saveThumbnail(material, thumbnailEncoded) {
//     if (thumbnailEncoded == null) return
//     const thumbnail = JSON.parse(thumbnailEncoded)
//     if (thumbnail != null && imageMimeTypes.includes(thumbnail.type)) {
//         material.thumbnailImage = new Buffer.from(thumbnail.data, 'base64')
//         material.thumbnailImageType = thumbnail.type
//     }
// }

module.exports = router 