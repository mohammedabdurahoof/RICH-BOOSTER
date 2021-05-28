var db = require('../confiq/connection')
var collection = require('../confiq/collections')
var bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectID
const urlExistSync = require("url-exist-sync");
const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'live', //sandbox or live
    'client_id': 'AY2APsiS1vwuv_pevzZwk_ZFWdMf3vasMjqBlM2qlXwsUA25pRkKDhG11ypnDGhFcp6-yxkDsc0aQ0v0',
    'client_secret': 'EEIHfVrQNuK-8XnN-3oW6M70nKNcS2XQ06bHO0ZvxMyS4T6-Vot0hJ1ZX4jeQ12wqGhcXRd3kHwDisSR'
});

module.exports = {
    doSingup: (userData) => {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await db.get().collection(collection.USER_COLLECTION).findOne({ username: userData.username })
                if (user) {
                    reject('username is invaild')
                } else {
                    if (userData.password === userData.c_password) {
                        userData.password = await bcrypt.hash(userData.password, 10)
                        userData.c_password = await bcrypt.hash(userData.c_password, 10)
                        db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                            resolve(data.ops[0])
                        })
                    } else {
                        reject('error')
                    }

                }


            } catch (error) {
                console.log('error')
            }

        })
    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let respondes = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ username: userData.username })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        console.log('ture')
                        respondes.user = user
                        respondes.status = true
                        resolve(respondes)
                    } else {
                        console.log('file')
                        resolve({ status: false })
                    }

                }
                )
            } else {
                console.log('file in r')
                resolve({ status: false })
            }
        })
    },
    profileUpdate: (userId, userDetiles) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(userId) }, {
                $set: {
                    username: userDetiles.username,
                    email: userDetiles.email,
                    name: userDetiles.name,
                    number: userDetiles.number,
                    city: userDetiles.city,
                    country: userDetiles.country,
                    zip_code: userDetiles.zip_code

                }
            }).then((response) => {
                resolve()
            })

        })

    },
    passwordUpdate: (userId, passwords) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(userId) })
            if (user) {
                let newpasswordHash = await bcrypt.hash(passwords.newpassword, 10)
                let c_newpasswordHash = await bcrypt.hash(passwords.c_newpassword, 10)
                bcrypt.compare(passwords.currentpassword, user.password).then((status) => {
                    if (status) {
                        if (passwords.newpassword === passwords.c_newpassword) {
                            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(userId) }, {
                                $set: {
                                    password: newpasswordHash,
                                    c_password: c_newpasswordHash
                                }
                            }).then((response) => {
                                resolve({ status: true })
                            })

                        } else {
                            resolve({ status: false })
                        }
                    } else {
                        resolve({ status: false })
                    }
                })
            }
        })
    },
    contact: (formData) => {
        return new Promise((resolve, reject) => {
            console.log(formData)
            db.get().collection(collection.CONTACT_COLLECTION).insertOne(formData).then((data) => {
                resolve(data.ops[0])
            })
        })
    },
    getAbout: (about) => {
        return new Promise((resolve, reject) => {
            let about = db.get().collection(collection.ABOUT_COLLECTION).findOne()
            resolve(about)
        })
    },
    getService: () => {
        return new Promise((resolve, reject) => {
            let services = db.get().collection(collection.SERVICE_COLLECTION).find().toArray()
            resolve(services)
        })
    },
    getPlans: (id, service) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.SERVICE_COLLECTION).findOne({ "_id": objectId(id) }).then((data) => {
                let plans = data.subServices
                plans.forEach(element => {
                    if (element.serviceName == service) {
                        resolve(element.plans)
                    } else {
                        console.log('false')
                    }
                });
            })
        })
    },
    palceOrder: (order, userId) => {
        return new Promise((resolve, reject) => {
            let linkChek = urlExistSync(order.link);
            console.log(linkChek)
            if (linkChek === true) {
                let status = 'pending'
                let PaymentStatus = 'pending'
                let d = new Date()
                let orderObj = {
                    transactionId: Date.now(),
                    userId: objectId(userId),
                    date: d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear(),
                    product: order.service,
                    quantity: order.quantity,
                    link: order.link,
                    totalAmount: order.planPrice,
                    status: status,
                    PaymentStatus: PaymentStatus
                }
                db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response) => {
                    resolve(response.ops[0])
                })
            } else {
                resolve()
            }

        })
    },
    getOrder: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).findOne({ "_id": objectId(id) }).then((data) => {
                resolve(data)
                console.log(data);
            })
        })
    },
    cancelOrder: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).removeOne({ "_id": objectId(id) }).then((data) => {
                resolve(data)
            })
        })
    },
    getUserOrder: (id) => {
        return new Promise((resolve, reject) => {
            let orders = db.get().collection(collection.ORDER_COLLECTION).find({ "userId": objectId(id) }).toArray()
            resolve(orders)
        })
    },  
    changePaymentStatus: (orderId) => {
        return new Promise(async (resolve, reject) => {
            console.log(orderId)
            await db.get().collection(collection.ORDER_COLLECTION)
                .updateOne({ _id: objectId(orderId) },
                    {
                        $set: {
                            PaymentStatus: 'paid'
                        }
                    }).then(() => {
                        resolve()
                    }).catch((err) => {
                        console.log(err)
                    })
        })
    },
    totalOrders: (userId) => {
        return new Promise(async (resolve, reject) => {
            let orders = await db.get().collection(collection.ORDER_COLLECTION).find({ "userId": objectId(userId) }).toArray()
            let orderNo = orders.length
            resolve(orderNo)
        })
    },
    approvedOrders: (userId) => {
        return new Promise(async (resolve, reject) => {
            let orders = await db.get().collection(collection.ORDER_COLLECTION).find({ "userId": objectId(userId), PaymentStatus: 'paid', status: 'pending' }).toArray()
            let orderNo = orders.length
            resolve(orderNo)
        })
    },
    completedOrders: (userId) => {
        return new Promise(async (resolve, reject) => {
            let orders = await db.get().collection(collection.ORDER_COLLECTION).find({ "userId": objectId(userId), status: 'completed' }).toArray()
            let orderNo = orders.length
            resolve(orderNo)
        })
    },
    amountSpent: (userId) => {
        return new Promise(async (resolve, reject) => {
            let orders = await db.get().collection(collection.ORDER_COLLECTION).find({ "userId": objectId(userId), PaymentStatus: 'paid' }).toArray()
            let totalPrice = 0
            orders.forEach(element => {
                totalPrice = totalPrice + parseInt(element.totalAmount)
            });
            resolve(totalPrice)
        })
    },
    paypalPayment:(orderId)=>{
        return new Promise (async(resolve,reject)=>{
            let order = await db.get().collection(collection.ORDER_COLLECTION).findOne({_id:objectId(orderId)})
            const create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": "http://localhost:3000/success/"+orderId,
                    "cancel_url": "http://localhost:3000/cancel"
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": order.product,
                            "sku": "001",
                            "price": order.totalAmount,
                            "currency": "USD",
                            "quantity": 1
                        }]
                    },
                    "amount": {
                        "currency": "USD",
                        "total": order.totalAmount
                    },
                    "description": "Boost your social media with us"
                }]
            };
            
            paypal.payment.create(create_payment_json, function (error, payment) {
              resolve({error,payment})
            });
        })
    },
    successPayment:(orderId,paymentId,payerId)=>{
        return new Promise (async(resolve,reject)=>{
            let order = await db.get().collection(collection.ORDER_COLLECTION).findOne({_id:objectId(orderId)})
            const execute_payment_json = {
                "payer_id": payerId,
                "transactions": [{
                    "amount": {
                        "currency": "USD",
                        "total": order.totalAmount
                    }
                }]
              };
            
              paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
                resolve({error,payment})
            });
        })
    }
}