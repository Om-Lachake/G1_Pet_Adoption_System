const mongoose = require("mongoose")

const formschema=new mongoose.Schema({
    name:{
        type:String,
        require:[true,'must provide a name'],
        trim:true
    },
    petid: {
        type:String,
    },
    email:{
        type:String,
        require:[true,"must provide a email"],
        trim:true
    },
    address:{
        type:String,
        require:[true,"must provide an address"],
        trim:true
    },
    firstpet: {
        type:Boolean,
        require:[true,"must provide details"]
    },
    whyadopt: {
        type:String,
        require:[true,"must provide reason"]
    },
    status: {
        type:String,
        default: "pending"
    }
})
module.exports=mongoose.model('formschema',formschema)

