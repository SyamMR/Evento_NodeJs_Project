var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectID
const { ObjectID } = require('bson')
const { response } = require('express')
module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data.ops[0])
            })

        })

    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        console.log("Login Success");
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log('Login Failed');
                        resolve({ status: false })
                    }
                })
            } else {
                console.log('Login Failed');
                resolve({ status: false })
            }
        })
    },
    addBooking: (booking, callback) => {


        db.get().collection('booking').insertOne(booking).then((data) => {

            callback(data.ops[0]._id)
        })
    },
    addFeedback: (feedback, callback) => {


        db.get().collection('feedback').insertOne(feedback).then((data) => {

            callback(data.ops[0]._id)
        })
    }

}