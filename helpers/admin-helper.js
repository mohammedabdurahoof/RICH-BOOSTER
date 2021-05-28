var db=require('../confiq/connection')
var collection=require('../confiq/collections')
var bcrypt=require('bcrypt')
var objectId=require('mongodb').ObjectID

module.exports={
    doSingup:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                let admin=await db.get().collection(collection.ADMIN_COLLECTION).findOne({username:adminData.username})
                if(admin){
                    reject('username is invaild')
                }else{
                    if (adminData.password===adminData.c_password){
                        adminData.password=await bcrypt.hash( adminData.password, 10)
                        adminData.c_password=await bcrypt.hash( adminData.c_password, 10)
                    db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData).then((data)=>{
                        resolve(data.ops[0])
                    })
                }else{
                    reject('error1')
                }

                }
                

            }catch(error){
                reject(error)
                console.log(error)
            }
            
        })
    },
    doLogin:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let respondes={}
            let admin=await db.get().collection(collection.ADMIN_COLLECTION).findOne({username:adminData.username})
            if(admin){
                bcrypt.compare(adminData.password,admin.password).then((status)=>{
                    if(status){
                        console.log('ture')
                        respondes.admin=admin
                        respondes.status=true
                        resolve(respondes)
                    }else{
                        console.log('file')
                        resolve({status:false})
                    }
                
                }
                )
            }else{
                console.log('file in r')
                resolve({status:false})
            }
        })
    },
    getClient:()=>{
        return new Promise(async(resolve,reject)=>{
            let client =await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(client) 
        })
    },
    contacts:()=>{
        return new Promise(async(resolve,reject)=>{
            let contacts =await db.get().collection(collection.CONTACT_COLLECTION).find().sort({_id: -1}).toArray()
            resolve(contacts) 
        })
    },
    viewContacts:(contactId)=>{
        return new Promise(async(resolve,reject)=>{
            let viewContacts =await db.get().collection(collection.CONTACT_COLLECTION).findOne({_id:objectId(contactId)})
            resolve(viewContacts) 
        })
    },
    addServices:(service)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.SERVICE_COLLECTION).insertOne(service).then((data)=>{
                resolve(data.ops[0]._id)
            })
        })
    },
    getService:()=>{
        return new Promise((resolve,reject)=>{
            let services =  db.get().collection(collection.SERVICE_COLLECTION).find().toArray()
            resolve(services)
        })
    },
    addSubServices:(subServices)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.SERVICE_COLLECTION).updateOne( { "_id" : objectId(subServices.id) },{ $push: { subServices: {serviceName : subServices.serviceName} } }).then((data)=>{
                resolve(data.ops[0]._id)
            })
        })
    },
    addPlan:(plan,id,service)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.SERVICE_COLLECTION).updateOne( { "_id" : objectId(id),"subServices.serviceName":service },{ $push: { "subServices.$.plans":plan} }).then((data)=>{
                resolve(data.ops[0]._id)
            })
        })
    },
    getPlans:(id,service)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.SERVICE_COLLECTION).findOne( { "_id" : objectId(id)}).then((data)=>{
                let plans=data.subServices
                plans.forEach(element => {
                    if(element.serviceName==service){
                        resolve(element.plans)
                    }else{
                        console.log('false')
                    }
                });
            })
        })
    },
    delete:(id,service)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.SERVICE_COLLECTION).updateOne( { "_id" : objectId(id)},{$pull:{subServices:{serviceName:service}}}).then((data)=>{
                resolve(data.ops[0]._id)
            })
        })
    },
    deletePlan:(plan,id,service)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.SERVICE_COLLECTION).update( { "_id" : objectId(id),"subServices.serviceName":service},{ $pull: { 'subServices.$.plans': { planName: plan}  } },
            { multi: true })
            resolve()
        })
    },
    passwordUpdate:(userId,passwords)=>{
        return new Promise(async(resolve,reject)=>{
            let user= await db.get().collection(collection.ADMIN_COLLECTION).findOne({_id:objectId(userId)})
            if (user){
                let newpasswordHash = await bcrypt.hash( passwords.newpassword, 10)
                let c_newpasswordHash = await bcrypt.hash( passwords.c_newpassword, 10)
                bcrypt.compare(passwords.currentpassword,user.password).then((status)=>{
                    if(status){
                        if (passwords.newpassword === passwords.c_newpassword){
                            db.get().collection(collection.ADMIN_COLLECTION).updateOne({_id:objectId(userId)},{
                                $set:{
                                    password:newpasswordHash,
                                    c_password:c_newpasswordHash
                                }
                            }).then((response)=>{
                                resolve({status:true})
                            })

                        }else{
                            resolve({status:false})
                        }
                    }else{
                        resolve({status:false})
                    }
                })
            }
        })
    },
    setAbout:(about)=>{
        return new Promise((resolve,reject)=>{
            let aboutUs =  db.get().collection(collection.ABOUT_COLLECTION).find()
            if(aboutUs){
                db.get().collection(collection.ABOUT_COLLECTION).remove()
            }
            db.get().collection(collection.ABOUT_COLLECTION).insertOne(about).then((data)=>{
                resolve(data.ops[0]._id)
            })
        })
    },
    getAbout:(about)=>{
        return new Promise((resolve,reject)=>{
            let about = db.get().collection(collection.ABOUT_COLLECTION).findOne()
            resolve(about)
        })
    },
    getOrder:(id) => {
        return new Promise((resolve, reject) => {
            let orders = db.get().collection(collection.ORDER_COLLECTION).find().toArray()
            resolve(orders)
        })
    },
    completedOrder:(orderId) => {
        return new Promise((resolve, reject) => {
            let orders = db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objectId(orderId)},
            {
                $set:{
                    status:'completed'
                }
            }).then(()=>{
                resolve()
            }).catch((err)=>{
                console.log(err)
            })
        })
    },
    pendingOrders:() => {
        return new Promise((resolve, reject) => {
            let orders = db.get().collection(collection.ORDER_COLLECTION).find({PaymentStatus:'paid',status:'pending'}).toArray()
            resolve(orders)
        })
    },
    unpaidOrders:() => {
        return new Promise((resolve, reject) => {
            let orders = db.get().collection(collection.ORDER_COLLECTION).find({PaymentStatus:'pending'}).toArray()
            resolve(orders)
        })
    },
    completedOrders:() => {
        return new Promise((resolve, reject) => {
            let orders = db.get().collection(collection.ORDER_COLLECTION).find({status:'completed'}).toArray()
            resolve(orders)
        })
    },
    totalOrders:()=> {
        return new Promise(async(resolve, reject) => {
            let orders = await db.get().collection(collection.ORDER_COLLECTION).find().toArray()
            let orderNo = orders.length
            resolve(orderNo)
        })
    },
    pendingOrdersGet:()=> {
        return new Promise(async(resolve, reject) => {
            let orders = await db.get().collection(collection.ORDER_COLLECTION).find({PaymentStatus:'paid',status:'pending'}).toArray()
            let orderNo = orders.length
            resolve(orderNo)
        })
    },
    completedOrdersGet:()=> {
        return new Promise(async(resolve, reject) => {
            let orders = await db.get().collection(collection.ORDER_COLLECTION).find({status:'completed' }).toArray()
            let orderNo = orders.length
            resolve(orderNo)
        })
    },
    amountGet:()=> {
        return new Promise(async(resolve, reject) => {
            let orders = await db.get().collection(collection.ORDER_COLLECTION).find({PaymentStatus:'paid'}).toArray()
            let totalPrice = 0
            orders.forEach(element => {
                totalPrice = totalPrice + parseInt(element.totalAmount)
            });
            resolve(totalPrice)
        })
    }
}