const { response } = require('express');
var express = require('express');
const { payment } = require('../helpers/user-helper');
var router = express.Router();
var userHelper = require('../helpers/user-helper')

const varifyLogin = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    res.redirect('/')
  }
}




router.get('/', function (req, res, next) {
  res.render('user/index');
});

router.post('/login', (req, res, next) => {
  userHelper.doLogin(req.body).then((response) => {
    if (response.status) {

      req.session.user = response.user
      req.session.user.loggedIn = true
      res.json('success')
    } else {
      req.session.userloginError = "Invalid username or password"
      res.json('Invalid username or password')
    }
  })
})

router.get('/singup', (req, res, next) => {
  res.render('user/sing-up')
})

router.post('/singup', (req, res, next) => {
  userHelper.doSingup(req.body).then((response) => {
    req.session.loggedIn = true
    req.session.user = response
    res.json('success')
  }).catch((err) => {
    req.session.error = err
    res.json(err)
  })

})

router.get('/dashboard', varifyLogin, async (req, res, next) => {
  let totalOrders = await userHelper.totalOrders(req.session.user._id)
  let approvedOrders = await userHelper.approvedOrders(req.session.user._id)
  let completedOrders = await userHelper.completedOrders(req.session.user._id)
  let amountSpent = await userHelper.amountSpent(req.session.user._id)
  let service = await userHelper.getService()
  res.render('user/dashboard', { user: true, dashboard: true, service,totalOrders,approvedOrders,completedOrders,amountSpent })
})

router.get('/user-profile', varifyLogin, (req, res, next) => {
  res.render('user/user-profile', { user: true, userprofile: true, user: req.session.user })
})

router.post('/profileUpdate', varifyLogin, (req, res, next) => {
  userHelper.profileUpdate(req.session.user._id, req.body).then((response) => {
    res.json('success')
  }).catch((err) => {
    req.session.error = 'error'
    res.json('error')
  })

})

router.post('/passwordUpdate', varifyLogin, (req, res, next) => {
  userHelper.passwordUpdate(req.session.user._id, req.body).then((status) => {
    if (status) {
      res.json('success')
    } else {
      res.json('passwords are difrent')
    }
  })
})

router.get('/logout', varifyLogin, (req, res) => {
  req.session.user = null
  res.redirect('/')
})

router.get('/services', varifyLogin, async (req, res) => {
  let service = await userHelper.getService()
  res.render('user/services', { user: true, services: true, service })
})

router.get('/about', varifyLogin, async (req, res) => {
  let about = await userHelper.getAbout()
  res.render('user/about', { user: true, about: true, about })
})

router.get('/contact', varifyLogin, (req, res) => {
  res.render('user/contact', { user: true, contact: true, user: req.session.user._id })
})

router.post('/contact', (req, res, next) => {
  userHelper.contact(req.body).then((response) => {
    res.json('success')
  }).catch((err) => {
    req.session.error = 'error'
    res.json('error')
  })

})

router.get('/plans', varifyLogin, async (req, res) => {
  let service = req.query.service
  let id = req.query.id
  let plans = await userHelper.getPlans(id, service)
  res.render('user/plans', { user: true, services: true, service, id, plans })
})

router.post('/place-order', (req, res, next) => {
  userHelper.palceOrder(req.body, req.session.user._id).then((response) => {
    if (response) {
      res.json({ status: 'success', id: response._id })
    } else {
      res.json('link is invalid')
    }
  })
})

router.get('/order-details', varifyLogin, async (req, res) => {
  let id = req.query.id
  let order = await userHelper.getOrder(id)
  res.render('user/order-details', { user: true, Orders: true, order })
})

router.get('/cancelOrder', varifyLogin, async (req, res) => {
  let id = req.query.id
  let order = await userHelper.cancelOrder(id)
  res.redirect('/services')
})

router.get('/orders', varifyLogin, async (req, res) => {
  let orders = await userHelper.getUserOrder(req.session.user._id)
  res.render('user/orders', { user: true, Orders: true, orders,paymentStatus:req.session.paymentStatus })
  req.session.paymentStatus = false
})

router.post('/pay',varifyLogin, (req, res) => {
  let orderId = req.query.id
  userHelper.paypalPayment(orderId).then(({error,payment})=>{
    if (error) {
      throw error;
  } else {
      for(let i = 0;i < payment.links.length;i++){
        if(payment.links[i].rel === 'approval_url'){
          res.redirect(payment.links[i].href);
        }
      }
  }
  })
});

router.get('/success/:id',varifyLogin, (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  let orderId = req.params.id

  userHelper.successPayment(orderId,paymentId,payerId).then(({error,payment})=>{
    if (error) {
      console.log(error.response);
      throw error;
  } else {
    req.session.paymentStatus ='Successfully completed your payment'
      console.log(JSON.stringify(payment));
      userHelper.changePaymentStatus(orderId)
      res.redirect('/orders')
  }
  })
});

router.get('/cancel',varifyLogin, (req, res) => {
  req.session.paymentStatus ='Filed your payment'
  res.redirect('/orders')

});

module.exports = router;
