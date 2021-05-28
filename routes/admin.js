var express = require('express');
var router = express.Router();
var adminHelper = require('../helpers/admin-helper')

const varifyLogin=(req,res,next)=>{
  if(req.session.admin){
    next()
  }else{
    res.redirect('/admin')
  }
}

router.get('/', function(req, res, next) {
  res.render('admin/index');
});

router.post('/login',(req,res,next)=>{
  adminHelper.doLogin(req.body).then((response)=>{
    if(response.status){
      
      req.session.admin=response.admin
      req.session.admin.loggedIn=true
      res.json('success')
    }else{
      req.session.adminloginError="Invalid username or password"
      res.json('Invalid username or password')
    }
  })
})

router.get('/singup',(req,res,next)=>{
  res.render('admin/sing-up')
})

router.post('/singup',(req,res,next)=>{
  adminHelper.doSingup(req.body).then((response)=>{
  req.session.loggedIn=true
  req.session.admin=response
  res.json('success')
}).catch((err)=>{
  req.session.error=err
  res.json(err)
})

})

router.get('/dashboard',varifyLogin,async(req,res,next)=>{
  let totalOrders = await adminHelper.totalOrders()
  let pendingOrders = await adminHelper.pendingOrdersGet()
  let completedOrders = await adminHelper.completedOrdersGet()
  let amountGet = await adminHelper.amountGet()
  let service = await adminHelper.getService()
  res.render('admin/dashboard',{admin:true,dashboard:true,service,totalOrders,pendingOrders,completedOrders,amountGet})
})

router.get('/users',varifyLogin,async(req,res,next)=>{
  let client =await adminHelper.getClient()
  res.render('admin/users',{admin:true,users:true,client})
})

router.post('/passwordUpdate',varifyLogin,(req,res,next)=>{
  adminHelper.passwordUpdate(req.session.admin._id,req.body).then((status)=>{
    if(status==true){
      res.json('success')
    }else{
      res.json('passwords are difrent')
    }
})
})

router.get('/logout',varifyLogin,(req,res)=>{
  req.session.admin=null
  res.redirect('/admin')
})

router.get('/services',varifyLogin,async(req,res)=>{
  let services =await adminHelper.getService()
  res.render('admin/services',{admin:true,services:true,services})
})

router.get('/about',varifyLogin,async(req,res)=>{
  let about = await adminHelper.getAbout()
  res.render('admin/about',{admin:true,about:true,about})
})

router.post('/about',varifyLogin,(req,res,next)=>{
  adminHelper.setAbout(req.body)
  res.redirect('/admin/dashboard')
})

router.get('/contact',varifyLogin,async(req,res)=>{
  let contacts = await adminHelper.contacts()
  res.render('admin/contact',{admin:true,contact:true,contacts})
})

router.get('/view_contact',varifyLogin,async(req,res)=>{
  let viewContacts = await adminHelper.viewContacts(req.query.id)
  res.render('admin/view_contact',{admin:true,contact:true,viewContacts})
})

router.post('/add-service',varifyLogin,(req,res)=>{
  adminHelper.addServices(req.body)
  .then((id)=>{
    if (req.files.image){
      let image = req.files.image
      image.mv('./public/images/service/'+id+'.jpg',(err,done)=>{
        if (!err){
          res.redirect('/admin/services')
        }else{
          console.log(err)
        }
      })
    }
  })
})

router.post('/add-sub-service',varifyLogin,async(req,res)=>{
  adminHelper.addSubServices(req.body)
  console.log(req.body);
  res.redirect('/admin/services')
})

router.get('/plans',varifyLogin,async(req,res)=>{
  let service = req.query.service
  let id = req.query.id
  let plans = await adminHelper.getPlans(id,service)
  res.render('admin/plans',{admin:true,services:true,service,id,plans})
})

router.post('/add-plan',varifyLogin,async(req,res)=>{
  let service = req.query.service
  let id = req.query.id
  adminHelper.addPlan(req.body,id,service)
  res.redirect('/admin/plans?service='+service+'&id='+id)
})

router.get('/delete',varifyLogin,async(req,res)=>{
  let service = req.query.service
  let id = req.query.id
  adminHelper.delete(id,service)
  res.redirect('/admin/services')
})

router.get('/deletePlan',varifyLogin,async(req,res)=>{
  let plan = req.query.plan
  let service = req.query.service
  let id = req.query.id
  adminHelper.deletePlan(plan,id,service)
  res.redirect('/admin/plans?service='+service+'&id='+id)
})

router.get('/orders', varifyLogin, async (req, res) => {
  let allOrders = await adminHelper.getOrder()
  let pendingOrders = await adminHelper.pendingOrders()
  let unpaidOrders = await adminHelper.unpaidOrders()
  let completedOrders = await adminHelper.completedOrders()
  res.render('admin/orders', { admin: true, Orders: true,allOrders,pendingOrders,unpaidOrders,completedOrders})
})

router.get('/completed-order', varifyLogin,(req, res) => {
  adminHelper.completedOrder(req.query.id)
  res.redirect('/admin/orders')
})


module.exports = router;
