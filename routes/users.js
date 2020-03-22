const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')

// User model
const User = require('../models/User.js')
const Material = require('../models/material')
const Supplier = require('../models/supplier')
const Company = require('../models/Company.js')
const Project = require('../models/project.js')



g_userID = '';
g_userName = '';
g_companyID='';
g_companyName='';
const updateCompanyRoute = '/companies/index/'+ g_companyID + '/edit';




const { ensureAuthenticated } = require('../config/auth');


// // Login / Register Page (Welcome Page)
// router.get('/welcome', (req, res) => res.render('welcome'));

// Login Page
router.get('/login', (req, res) => res.render('users/login'));

// Register Page
router.get('/register', (req, res) => res.render('users/register'));

// Register Handle
router.post('/register', (req, res) => {
    const { name, email, phone, weChat, role, password, password2 } = req.body;
    let errors = [];
    
    // Check required fields
    if(!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // Check passwords match
    if(password != password2) {
        errors.push({ msg: 'Passwords do not match '});
    }

    // Check pass length
    if(password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            phone,
            weChat,
            role,
            password,
            password2
        });

    } else {
        //res.send('pass');
        // Validation passed
        User.findOne({ email: email })
            .then(user => {
                if(user) {
                    // User exists
                    errors.push({ msg: 'Email is already registered' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        phone,
                        weChat,
                        role,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        phone,
                        role,
                        weChat,
                        password
                    });

                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        // Set password to hashed
                        newUser.password = hash;
                        // Save user
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'You are now registered and can log in');
                            // const newUser = user.save();
                            // res.redirect('/users/login');
                            res.redirect(`/users/${newUser.id}`)
                        })
                        .catch(err => console.log(err));
                    }))
                }
            });
    }
});

// Dashboard (similar to 'show' in the supplier router, one user shows many materials that he/she uploaded)
router.get('/:id', ensureAuthenticated, async(req, res) => {
    try {
            const user = await User.findById(req.user.id)
            const materials = await Material.find({ userID : req.user.id }).sort({ createdAt: 'desc' }).limit(10).exec() // .limit(6) this limits the search result in the show page, to 6 pictures at a time.
            // const company = await Company.findById(req.user.company)
            
            if (req.user.company != null) {
              const company = await Company.findById(req.user.company)
              g_companyID = company.id
              g_companyName = company.name

            } else {
              g_companyID = "0"
              g_companyName = "You haven't registered your company yet."
            }
            
            // console.log(g_companyID);
            // console.log(g_companyName);

            res.render('users/dashboard', {
                user: user,
                userName: req.user.name,
                userID: req.user.id,
                userRole: req.user.role,
                materialsByUser: materials,
                companyID: g_companyID,
                companyName: g_companyName,
                g_userProfPic_URL: "https://material-image-list.oss-cn-beijing.aliyuncs.com/" + req.user.id + "/" + req.user.name,
            })
            g_userID = req.user.id
            g_userName = req.user.name
            g_userRole = user.role
            // console.log(g_userRole)

            // g_userProfilePicName = user.userProfilePicName
            
            // console.log(g_userID)
            // console.log(g_userName)
            // console.log(user.userProfilePicName)
            // console.log(user)
            // console.log(materials)
            // res.redirect('/materials/index')

    } catch (err) {
        console.log(err)
        if(company != null) {
          renderEditPage(res,material,true)
        } else {
          res.redirect('/login')
        }
    }
}); //after adding ensureAuthenticated, the dashboard is protected from viewing without logging in

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true 
    })(req, res, next);
})

// Logout Handle
router.get('/dashboard/logout', async (req, res) => {
    try {
    const logout = await req.logout(); //logging out is easy, using the passport middleware, it gives us a logout function.
    req.flash('success_msg', 'You are logged out'); //but we want to send a flash message and redirect. 
    res.redirect('/users/login'); //redirect us to login page.
    } catch(err) {
        console.log(err)
    }
})

// Edit User Route (GET)
router.get('/:id/editUser', ensureAuthenticated, async (req,res) => { 
    let user 
    // let company
    const companies = await Company.find({})
    try {
        user = await User.findById(g_userID).exec()

        user.userProfilePicURL =  "https://material-image-list.oss-cn-beijing.aliyuncs.com/" + g_userID + "/" + g_userName
       
        res.render('users/editUser', {
            user: user,
            userRole: g_userRole,
            companies: companies,
            userName: g_userName,
            userID: g_userID,
            companyName: g_companyName,
            companyID: g_companyID,
            g_userProfPic_URL: "https://material-image-list.oss-cn-beijing.aliyuncs.com/" + g_userID + "/" + g_userName,
        })

    } catch (err) {
        console.log(err)
        res.redirect('/users/dashboard')
    }
})

// Edit User Handle (POST)
router.put('/:id', ensureAuthenticated, async (req, res) => {
    let user 
    
    try {
        user = await User.findById(g_userID).exec()
        user.name = req.body.name
        user.phone = req.body.phone
        user.role = req.body.role
        user.weChat = req.body.weChat
        user.description = req.body.description
        user.company = req.body.company
        user.userProfilePicURL =  "https://material-image-list.oss-cn-beijing.aliyuncs.com/" + g_userID + "/" + g_userName

        await user.save()

        g_userRole = req.body.role
        g_companyName = req.body.company

        console.log(g_userRole)
        res.redirect('/users/dashboard')
    } catch(err) {
        console.log(err)
    }
})






// *****---------- materials ROUTES ----------***** //

// Materials Alliance (feed)
router.get('/materials/feed', ensureAuthenticated, async(req, res) => {
    let query = Material.find({ company: g_companyID })

    // let query = Material.find({})

    let user = await User.findById(g_userID).exec()
    
    if (req.query.searchKeywords != null && req.query.searchKeywords != '') {
      query = query.regex('searchKeywords', new RegExp(req.query.searchKeywords, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
      query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
      query = query.gte('publishDate', req.query.publishedAfter)
    }
    try {
      const materials = await query.exec()
      const companies = await Company.find({}).limit(10)
      var index = companies.map(x => {
        return x.id;
      }).indexOf(g_companyID);
      // console.log(index);
      if (index > -1) {
        companies.splice(index, 1);
      }
      // console.log(companies);
      res.render('materials/feed', {
        companies: companies,
        user: user,
        materials: materials,
        searchOptions: req.query,
        userID: g_userID, 
        userName: g_userName, 
        userRole: g_userRole,
        companyName: g_companyName,
        companyID: g_companyID,
      })
    } catch(err) {
      res.redirect('/')
      console.log(err)
    }
}); //after adding ensureAuthenticated, the dashboard is protected from viewing without logging in



// All Materials
router.get('/materials/index', ensureAuthenticated, async(req, res) => {
    let query = Material.find({ company: g_companyID })
    // let query = Material.find({})

    let user = await User.findById(g_userID).exec()
    
    if (req.query.searchKeywords != null && req.query.searchKeywords != '') {
      query = query.regex('searchKeywords', new RegExp(req.query.searchKeywords, 'i'))
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
        user: user,
        materials: materials,
        searchOptions: req.query,
        userID: g_userID, 
        userName: g_userName, 
        userRole: g_userRole,
        companyName: g_companyName,
        companyID: g_companyID,
      })
    } catch(err) {
      res.redirect('/')
      console.log(err)
    }
}); //after adding ensureAuthenticated, the dashboard is protected from viewing without logging in



// New Material Route (build up MongoDB schema)
router.get('/materials/new', ensureAuthenticated, async (req,res) => { 
    renderNewPage(res, new Material())
})

// Create New Material Route 1
router.post('/materials/index', ensureAuthenticated, async (req, res) => { 
  //  const tags_input_string =''
   const material = new Material({
        title: req.body.title,
        supplier: req.body.supplier,
        userID: g_userID,
        userName: g_userName,
        ossFileName: req.body.ossFileName,
        tags_input : req.body.tags_input,
        tags_input_string : req.body.tags_input_string,
        project: req.body.project,
        company: g_companyID,
        publishDate: new Date(req.body.publishDate),
        cost: req.body.cost,
        description: req.body.description,
        isPublic: req.body.isPublic,
        searchKeywords: req.body.title+req.body.userName+req.body.description,
    })

    try {
        material.tags_input_string = material.tags_input.join() // this should be ahead of const newMaterial = await material.save
        const newMaterial = await material.save()

        console.log(material.searchKeywords)
                res.redirect(`/users/materials/index`)

    } catch(err) {
        console.log(err)

        renderNewPage(res, material, true)
    }
})

// Show Material Route
router.get('/materials/index/:id', ensureAuthenticated, async (req, res) => {

  try {
    const material = await Material.findById(req.params.id)
                                   .populate('supplier')
                                   .exec()
    const project = await Project.findById(material.project)

    let companyWhoPosted = ''
    if (material.company != null  && material.company !== '') {
        companyWhoPosted = await Company.findById(material.company).exec()
        companyWhoPosted = companyWhoPosted.name
      } else if (material.company == null) {
        companyWhoPosted = ""
      }

    res.render('materials/show', 
    {   material: material, 
        projectName: project.name,
        post_Company: companyWhoPosted,
        userID: g_userID, 
        userName: g_userName,
        userRole: g_userRole,
        companyID: g_companyID,
        companyName: g_companyName
    })
}
 catch (err) {
    res.redirect('/')
    console.log(err)
  }
})




// Edit Material Route
router.get('/materials/index/:id/edit', ensureAuthenticated, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
    renderEditPage(res, material)
    // console.log(materials.isPublic)
  } catch {
    res.redirect('/')
  }
})

// Update Material Route
router.put('/materials/index/:id', ensureAuthenticated, async (req, res) => {
  let material
  let company

  try {
    material = await Material.findById(req.params.id)
    company = await Company.findById(material.company).exec()
    material.companyName = company.name
    material.title = req.body.title
    material.ossFileName = req.body.ossFileName
    material.tags_input = req.body.tags_input
    material.tags_input_string = material.tags_input.join() 
    material.isPublic = req.body.isPublic
    material.supplier = req.body.supplier
    material.project = req.body.project
    material.company = g_companyID
    material.publishDate = new Date(req.body.publishDate)
    material.cost = req.body.cost
    material.description = req.body.description
    material.searchKeywords = material.title + material.tags_input + material.userName + material.description,
    // let searchKeywords = [material.title, material.tags_input_string, material.description]
    // console.log(material.tags_input_string)
    console.log(material.searchKeywords)


    await material.save()
    // console.log(material.tags_input)
    res.redirect(`/users/materials/index/${material.id}`)
  } catch (err){
      console.log(err)
    if(material != null) {
      renderEditPage(res,material,true)
    } else {
      redirect('/users/materials/index')
    }
  }
})


// Delete Material Page
router.delete('/materials/index/:id', async (req, res) => {
  let material
  try {
    material = await Material.findById(req.params.id)
    await material.remove()
    req.flash('success_msg', 'Successfully deleted the material data'); 

    res.redirect(`/users/materials/index`)

} catch {
    // if (material != null) {
    //   req.flash('error_msg', 'Cannot deleted the material data'); 

    //   res.render('/materials/show', {
    //     material: material,
    //     userRole: g_userRole,
    //     errorMessage: 'Could not remove material'
    //   })
    // } else {
    //   res.redirect('/')
    // }
    if (material == null) {
      res.redirect('/users/materials/index')
  } else {
      res.redirect(`/materials/index/${material.id}`)
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
    const projects = await Project.find({})
    const company = await Company.findById(g_companyID).exec()

    // const user = await User.findById(g_userID)
    console.log(g_userID)
    console.log(g_userName)

    const params = {
      suppliers: suppliers,
      projects: projects,
      company: company,
      material: material,
      // user: user,
      userID: g_userID, // just added
      userName: g_userName, // just added
      userRole: g_userRole,
      // userProfilePicName: g_userProfilePicName,
      companyName: g_companyName,
      companyID: g_companyID,

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
    res.redirect('/users/materials')
  }
}


    // let query = Material.find({ company: g_companyID })
    // if (req.query.searchKeywords != null && req.query.searchKeywords != '') {
    //   query = query.regex('searchKeywords', new RegExp(req.query.searchKeywords, 'i'))
    // }
    // try {
    //   const materials = await query.exec()
    //   res.render('materials/index', {

// *****---------- suppliers ROUTES ----------***** //
// All Suppliers Route
router.get('/suppliers/index', async (req, res) => {
    // let searchOptions = {}
    let query = Supplier.find({ company: g_companyID })
    
    if (req.query.name != null && req.query.name !== '') {
        // searchOptions.name = new RegExp(req.query.name, 'i')
        query = query.regex('name', new RegExp(req.query.name, 'i'))
    }

    try {
        const suppliers = await query.exec()
        // const materials = await query.exec()

        res.render('suppliers/index', { 
            suppliers: suppliers, 
            // companyWhoPosted: companyWhoPosted,
            searchOptions: req.query,
            userID: g_userID, // just added
            userName: g_userName, // just added
            userRole: g_userRole,
            // userProfilePicName: g_userProfilePicName,
            companyName: g_companyName,
            companyID: g_companyID,


        }) // - we're going to render suppliers/index, instead of rendering all the index for entire application.
    } catch {
        res.redirect('/suppliers/index')
    }
})

// New Supplier Route
router.get('/suppliers/new', async(req,res) => { 
    try {
        res.render('suppliers/new', 
            { supplier: new Supplier(), 
              userID: g_userID, 
              userName: g_userName,
              userRole: g_userRole,
              companyName: g_companyName,
              companyID: g_companyID,
            })
    } catch(err) {
    res.redirect('suppliers/index')
    console.log(err);
    }
    // res.render('suppliers/new', { supplier: new Supplier() }) // - this is just for displaying the form.
    // - pass this as variable and send this to the schema. pass a 'supplier' variable, and it's equal to 'new Supplier'. 
})

// Create New Supplier Route // - This is actually going to be creating the supplier.
router.post('/suppliers/index', async (req, res) => { // - we use 'post' for creation. to create a new supplier.
    const supplier = new Supplier({
        name: req.body.name,
        phone: req.body.phone,
        weChat: req.body.weChat,
        company: req.body.company,
        userName: g_userName, // just added
        companyID: g_companyID,
        companyName: g_companyName,
        errorMessage: 'Error creating Supplier'
    })
    try {
       const newSupplier = await supplier.save()
       
    //    res.redirect(`/users/suppliers/index/${newSupplier.id}`)
           res.redirect(`/users/suppliers/index`)

    //    res.render('users/suppliers/new', {
    //     userID: g_userID, // just added
    //     userName: g_userName, // just added
    //     errorMessage: 'Error creating Supplier'
    //     })
    } catch {
        res.render('suppliers/new', {
        supplier: supplier,
        userID: g_userID, // just added
        userName: g_userName, // just added
        userRole: g_userRole,
        errorMessage: 'Error creating Supplier',
        // userProfilePicName: g_userProfilePicName,
        companyName: g_companyName,
        companyID: g_companyID,

        })
    }
})

// Show page 
router.get('/suppliers/index/:id', async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id)
        const materials = await Material.find({ supplier: supplier.id }).limit(6).exec() // .limit(6) this limits the search result in the show page, to 6 pictures at a time.
        // const materials = await Material.find({ supplier: supplier.id }).exec() // .limit(6) this limits the search result in the show page, to 6 pictures at a time.
        // - ? if I want to view all the materials that this suppliers uploaded, it's gonna take forever to upload all the photos at one time.
        // - ? Can i put the infinite scroll challenge code right here to view the search result?
        // console.log("this is suppliers showpage, got" + g_userName)
        // console.log("this is suppliers showpage, got" + g_userID)
        res.render('suppliers/show', {
            supplier: supplier,
            materialsBySupplier: materials,
            userID: g_userID, // just added
            userName: g_userName, // just added
            userRole: g_userRole,
            // userProfilePicName: g_userProfilePicName,
            companyName: g_companyName,
            companyID: g_companyID,


        })

    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})


router.get('/suppliers/index/:id/edit', async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id)
        res.render('suppliers/edit', 
        { supplier: supplier, 
            userID: g_userID, // just added
            userName: g_userName,
            userRole: g_userRole,
            // userProfilePicName: g_userProfilePicName,
            companyName: g_companyName,
            companyID: g_companyID,
        }) // - this is just for displaying the form.
    } catch {
        res.redirect('/users/suppliers')
    }
})

// Update 
router.put('/suppliers/index/:id', async (req, res) => {
    let supplier 
    try {
        supplier = await Supplier.findById(req.params.id)
        supplier.name = req.body.name
        supplier.phone = req.body.phone
        supplier.weChat = req.body.weChat
        await supplier.save()
        res.redirect(`/users/suppliers/index/${supplier.id}`)
    } catch {
        if (supplier == null) {
            res.redirect('/users/suppliers/index')
        } else {
            res.render('suppliers/index/edit', {
                supplier: supplier,
                userID: g_userID, 
                userName: g_userName,
                userRole: g_userRole,
                companyID: g_companyID,
                companyName: g_companyName,
                errorMessage: 'Error updating Supplier'
            })
        }
    }
})

// Delete Supplier Route
router.delete('/suppliers/index/:id', async (req, res) => {
    let supplier 
    try {
        supplier = await Supplier.findById(req.params.id)
        await supplier.remove()
        req.flash('success_msg', 'Successfully deleted the supplier data'); 
        // req.flash('error_msg', 'failed to deleted the supplier data'); 

        res.redirect('/users/suppliers/index')
    } catch {
        if (supplier == null) {
            res.redirect('/users/suppliers/index')
        } else {
            res.redirect(`/suppliers/index/${supplier.id}`)
        }
    }
})


// Company Route ----------------------------------------

// New Company Render Route
router.get('/companies/new', (req, res) => res.render('companies/new', {
  company: new Company(),
  userID: g_userID,
  userName: g_userName,
  userRole: g_userRole,
  companyID: g_companyID,
  companyName: g_companyName,
  g_userProfPic_URL: "https://material-image-list.oss-cn-beijing.aliyuncs.com/" + g_userID + "/" + g_userName,
}));

// New Company Post Route
router.post('/companies/index', (req, res) => {
    const { name, description } = req.body;
    const userID = g_userID
    const userName = g_userName
    const userRole = g_userRole
    const companyID = g_companyID
    const companyName = g_companyName
    

    let errors = [];

    // Check required fields
    if(!name ) {
        errors.push({ msg: 'Please fill in all fields' });
    }
    if(errors.length > 0) {
        res.render('companies/new', {
            errors,
            name,
            description,
            userID,
            userName,
            userRole,
            companyID,
            companyName,
        });
    } else {
        // Validation passed
        Company.findOne({ name: name })
            .then(company => {
                if(company) {
                    // Company exists
                    errors.push({ msg: 'The company name is already registered' });
                    res.render('companies/new', {
                        errors,
                        userID,
                        userName,
                        userRole,
                        companyID,
                        companyName,
                        name,
                        description,

                    });
                } else {
                    const newCompany = new Company({
                        name,
                        description,
                    });

                        newCompany.save()
                        .then(company => {
                            req.flash('success_msg', 'Your company is now registered.');
                            res.redirect(`/users/${userID}`)
                        })
                        .catch(err => console.log(err));
                }
          });
    }
});

// All Companies Route
router.get('/companies/index', async (req, res) => {
  try {
      const company = await Company.findById(g_companyID).exec();
      const users = await User.find({ company: g_companyID});
      const user = await User.findById(g_userID).exec();
      res.render('companies/index', { 
          peopleFromThisCompany: users, 
          company: company,
          user: user,
          userID: g_userID, 
          userName: g_userName,
          userRole: g_userRole,
          companyID: g_companyID,
          companyName: g_companyName,
        }) 
  } catch(err) {
      res.redirect('/companies/index')
      console.log(err)
  }
})

// Show Company Route



// Edit Company Route
router.get('/companies/index/:id/edit', async (req, res) => {
  try {
      const company = await Company.findById(g_companyID).exec()
      res.render('companies/edit', { 
          company: company, 
          searchOptions: req.query,
          userID: g_userID, // just added
          userName: g_userName, // just added
          userRole: g_userRole,
          companyID: g_companyID,
          companyName: g_companyName,
        }) // - we're going to render suppliers/index, instead of rendering all the index for entire application.
  } catch(err) {
      res.redirect('/companies/index')
      console.log(err)
  }
})

 
// Update Company Route
router.put('/companies/index/:id', async (req, res) => {
  let company
  let user 
  try {
      user = await User.findById(g_userID).exec()
      company = await Company.findById(g_companyID).exec()

      company.name = req.body.name
      company.name_eng = req.body.name_eng
      company.description = req.body.description
      company.location = req.body.location


      await company.save()

      // g_companyID = company.id
      // g_companyName = company.name
      req.flash('success_msg', 'Successfully updated your company data'); //but we want to send a flash message and redirect. 

      res.redirect('/users/companies/index')

  } catch (err) {
    console.log(err)
      // if (company == null) {
      //     res.redirect('/companies/index')
      // } else {
      //     res.render('companies/edit', {
      //         company: company,
      //         userID: g_userID, // just added
      //         userName: g_userName, // just added
      //         userRole: g_userRole,
      //         companyName: g_companyName,
      //         companyID: g_companyID,
      //         errorMessage: 'Error updating Supplier'
      //     })
      // }
  }
})

// Delete Company Route
router.delete('/companies/index/:id', async (req, res) => {
  let company 
  try {
      // user = await User.findById(g_userID)
      company = await Company.findById(g_companyID)
      await company.remove()
      req.flash('success_msg', 'Your company is now deleted and deregisterd.'); 
      res.redirect('/users/:id')

      console.log(g_companyID)
      res.render('users/dashboard', {
        // companyID: companyID,
        userName: req.user.name,
        userID: g_userID,
        userRole: g_userRole,
        materialsByUser: materials,
        // companyID: g_companyID,
        // usersCompanyName: user.companyName,
        companyID: user.companyID,
        // userProfilePicName: user.userProfilePicName,
        companyName: "g_companyName",
        g_userProfPic_URL: "https://material-image-list.oss-cn-beijing.aliyuncs.com/" + req.user.id + "/" + req.user.name,
    })

  } catch {
      if (company == null) {
          res.redirect('/users/:id')
          req.flash('error_msg', 'Failed to delete your company data.'); 
      } else {
          res.redirect(`/users/:id`)
      }
  }
})




// *****---------- projects ROUTES ----------***** //
// All Projects Route
router.get('/projects/index', async (req, res) => {
  let query = Project.find({ company: g_companyID })

  if (req.query.name != null && req.query.name !== '') {
    query = query.regex('name', new RegExp(req.query.name, 'i'))
  }
  try {
      const projects = await query.exec()
      res.render('projects/index', { 
          projects: projects, 
          searchOptions: req.query,
          userID: g_userID, // just added
          userName: g_userName, // just added
          userRole: g_userRole,
          companyName: g_companyName,
          companyID: g_companyID,
      }) // - we're going to render suppliers/index, instead of rendering all the index for entire application.
  } catch {
      res.redirect('/projects/index')
  }
})


// New Project Route
router.get('/projects/new', async(req,res) => { 
  try {
      res.render('projects/new', 
          { project: new Project(), 
            user: g_userID,
            company: g_companyID,
            userID: g_userID, 
            userName: g_userName,
            userRole: g_userRole,
            companyName: g_companyName,
            companyID: g_companyID,
          }) 
  } catch(err) {
  res.redirect('/projects/index')
  console.log(err);
  }
})

// Post New Project 
router.post('/projects/index', async (req, res) => {

  const project = new Project({
      name: req.body.name,
      user: g_userID,
      company: g_companyID,
      userName: g_userName, 
      userRole: g_userRole,
      companyID: g_companyID,
      companyName: g_companyName,
      errorMessage: 'Error creating Project'
  })
  try {
     const newProject = await project.save()
         res.redirect(`/users/projects/index`)
  } catch {
      res.render('projects/new', {
      project: project,
      userID: g_userID, 
      userName: g_userName, 
      userRole: g_userRole,
      errorMessage: 'Error creating Project',
      companyName: g_companyName,
      companyID: g_companyID,

      })
  }
})

// Show Project Page 
router.get('/projects/index/:id', async (req, res) => {
  try {
      // const projects = await Project.find({})

      // const params = {
      //   projects: projects,
      // }

      const project = await Project.findById(req.params.id)
      const materials = await Material.find({ project: project.id }).limit(6).exec() 
      res.render('projects/show', {
          supplier: supplier,
          materialsByProject: materials,
          userID: g_userID, 
          userName: g_userName, 
          userRole: g_userRole,
          companyName: g_companyName,
          companyID: g_companyID,
      })

  } catch (err) {
      console.log(err)
      res.redirect('/')
  }
})

// Edit Project Route
router.get('/projects/index/:id/edit', ensureAuthenticated, async (req, res) => {
  try {
      const project = await Project.findById(req.params.id)
      res.render('projects/edit', 
      { project: project, 
        userID: g_userID, 
        userName: g_userName,
        userRole: g_userRole,
        companyName: g_companyName,
        companyID: g_companyID,
        
      }) 
  } catch {
      res.redirect('/users/projects')
  }
})

// Update Project Route
router.put('/projects/index/:id', ensureAuthenticated, async (req, res) => {
  let project 
  try {
      project = await Project.findById(req.params.id)
      project.name = req.body.name
      project.user = req.body.user
      project.company = req.body.company
      await project.save();
      res.redirect('/users/projects/index')
  } catch (err) {

    console.log(err);

      if (project == null) {
          res.redirect('/')
      } else {
          res.render('projects/index/edit', {
              project: project,
              userID: g_userID, 
              userName: g_userName, 
              userRole: g_userRole,
              companyID: g_companyID,
              companyName: g_companyName,
              errorMessage: 'Error updating Supplier'
      })
    }
  }
})

// Delete Project Route
router.delete('/projects/index/:id', async (req, res) => {
  let project 
  try {
      project = await Project.findById(req.params.id)
      await project.remove()
      req.flash('success_msg', 'Successfully deleted the project data'); 
      res.redirect('/users/projects/index')
  } catch {
      if (project == null) {
          res.redirect('/users/projects/index')
      } else {
          res.redirect(`/projects/index/${project.id}`)
      }
  }
})

module.exports = router;