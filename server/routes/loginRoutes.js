//imports
const express=require('express');
const passport=require("passport")
const router=express.Router();
const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const {setUser,getUser} = require("../service/auth.js")
const loginschema=require('../models/loginschema.js')
require("../middleware/authgoogle.js")
require('dotenv').config()

//import functions from login controller
const {
    createLoginData,
    checkLoginCredential,
    postNewPassword,
    postForgotPassword,
    postPassword
}=require('../controllers/loginControllers')
//import functions from OTP controller
const {
    checkOTP,
    postResendOTP
} = require('../controllers/OTPControllers')
const {restrictToLoggedInUserOnly,restrictToAdminOnly} = require('../middleware/auth.js')
//routing
router.get('/check-auth', restrictToLoggedInUserOnly, (req, res) => {
    // If the user passed the middleware check, return user info
    res.status(200).json({ success: true, message: "User authenticated", user: req.user });
  });
router.get('/check-admin',restrictToAdminOnly, (req,res) => {
  res.json({success:true,message:"admin access granted", user:req.user, isAdmin:true})
})
router.post('/signup',createLoginData)
router.post('/login', checkLoginCredential)
router.post("/verifyOTP",checkOTP)
router.post("/resendOTP",postResendOTP)
router.post("/newpassword",postNewPassword)
router.post("/forgotpassword",postForgotPassword)
router.post("/password",postPassword)
router.get("/auth/google",passport.authenticate('google',{scope:['email','profile']})) //authenticate for google OAuth2
router.get("/happytails/main", 
    passport.authenticate('google', { 
        session:true,
        failureRedirect: '/',
     }), 
    async (req, res) => {
        const token = req.user.token;
        const atoken = req.user?.atoken;
        const firstTime = req.user.firstTime;
        const message = firstTime ? "create password before login" : "logged in successfully";
        const isadmin= req.user.isadmin;
        // Generate the script for postMessage
        //console.log(isadmin)
        const script = `
          <script>
            window.opener.postMessage(
              ${JSON.stringify({ success: true, firsttime: firstTime, message, token,atoken,isadmin })},
              "http://localhost:5173"
            );
            window.close();
          </script>
        `;

        // Send the HTML with the script to the client
        res.send(script);
    }
);
router.get('/auth/logout', (req, res) => {
    res.clearCookie('uid', { path: '/', httpOnly: true, sameSite: 'strict' });
    res.clearCookie('aid', { path: '/', httpOnly: true, sameSite: 'strict' });
    return res.status(200).json({ success: true, message: 'Logged out successfully!' });
  });
//export module
module.exports=router;