//create db schema for OTP details
const mongoose=require('mongoose')
const OTPschema=new mongoose.Schema({
    userID:{
        type:String,
        require:true,
        unique:true
    },
    otp:{
        type:String,
        require:true
    },
    createdAt:{
        type:Date,
        require:true
    },
    expireAt:{
        type:Date,
        require:true
    },
    email:{
        type:String,
        require:true
    }
})
module.exports=mongoose.model('OTPschema',OTPschema);