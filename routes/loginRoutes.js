//imports
const express=require('express');
const passport=require("passport")
const router=express.Router();
const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const {setUser,getUser} = require("../service/auth.js")
const loginschema=require('../models/loginschema')
require("../middleware/authgoogle")
require('dotenv').config()

//import functions from login controller
const {
    getHome,
    getLogin,
    getSignup,
    createLoginData,
    checkLoginCredential,
    getForgotPassword,
    getNewPassword,
    postNewPassword,
    postForgotPassword,
    getPassword,
    postPassword
}=require('../controllers/loginControllers')
//import functions from OTP controller
const {
    getverifyOTP,
    checkOTP,
    getResendOTP,
    postResendOTP
} = require('../controllers/OTPControllers')

//routing
router.get("/",getHome)
router.get("/signup",getSignup).post('/signup',createLoginData)
router.get("/login",getLogin).post('/login', checkLoginCredential)
router.get("/verifyOTP",getverifyOTP).post("/verifyOTP",checkOTP)
router.get("/resendOTP",getResendOTP).post("/resendOTP",postResendOTP)
router.get("/newpassword",getNewPassword).post("/newpassword",postNewPassword)
router.get("/forgotpassword",getForgotPassword).post("/forgotpassword",postForgotPassword)
router.get("/password",getPassword).post("/password",postPassword)
router.get("/auth/google",passport.authenticate('google',{scope:['email','profile']})) //authenticate for google OAuth2
router.get("/happytails/main", 
    passport.authenticate('google', { 
        session:true,
        failureRedirect: '/',
     }), 
    async (req, res) => {
        const token=req.user.token //cookie created from the middleware
        const firstTime=req.user.firstTime
        const email=req.user.user.email
        const thatUser = await loginschema.findOne({email:email}); //check if user exists
        if(firstTime) {
            res.user=thatUser;
            res.cookie("uid",token,{httpOnly:true}) //create cookie
            res.redirect('/password') //redirect to create password
        }
        else {
            res.cookie("uid",token,{httpOnly:true}) //create cookie
            res.redirect('/happytails/user/main'); //redirect to main page
        }
        
    }
);
router.get("/auth/logout", (req, res) => {
    req.session.destroy(function() {
        res.clearCookie("connect.sid"); //clear cookie after logout
        res.clearCookie('uid')
        res.redirect("/"); //back to home page
    });
});

//export module
module.exports=router;