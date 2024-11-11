//imports
const loginschema=require('../models/loginschema')
const nodemailer=require('nodemailer')
const bcrypt=require('bcrypt')
const OTPverification = require('../models/OTPverification')
const {sendGmailOTP} = require ('./OTPControllers.js')
const {setUser} = require("../service/auth.js")
const passport=require("passport")


//render pages
async function getHome(req,res){
    res.render("home")
}
async function getLogin(req,res){
    //if user has already logged in direct to the main page
    if(req.cookies!==null && req.cookies.uid!==undefined) return res.redirect("/happytails/user/main")
    else return res.render("login")
}
async function getSignup(req,res){
    res.render("signup")
}
async function getMain(req,res){
    res.render("main")
}
async function getForgotPassword(req,res){
    res.render("forgotpassword")
}
async function getNewPassword(req,res){
    res.render("newpassword")
}
async function getPassword(req,res) {
    res.render("password")
}

//for sign up process
async function createLoginData(req, res) {
    try {
        const existingUser = await loginschema.findOne({email:req.body.email });
        if (existingUser) { //if user already exist
            throw new Error("User is already registered, use a different email");
        } else if (req.body.password !== req.body.rpassword) { //if password donot match
            res.render("signup", { message: "Passwords do not match." });
            return;
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const newUser = new loginschema({ //create entry in db
                id:Date.now(),
                email: req.body.email,
                password: hashedPassword,
                verified: false,
            });
            const result = await newUser.save();
            await sendGmailOTP(result,res); //send verification OTP
            res.render("verifyOTP")
        }
    } catch (error) {
        res.render("signup", { message: "An error occurred during signup." });
    }
}

//for login process
async function checkLoginCredential(req, res) {
    try {
        const user = await loginschema.findOne({ email: req.body.email });
        if (!user) { //if no user exists
            return res.render("login", { error: "Invalid email or password." });
        } 
        if (!user.verified) { //if user has not been verified
            return res.redirect("/resentOTP", { error: "User is not verified" });
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if (isPasswordMatch) {
            const token=setUser(user)
            res.cookie("uid",token) //create cookie
            return res.redirect("/happytails/user/main"); //redirect to main page
        } else {
            return res.render("login", { error: "Invalid email or password." });
        } 
    } catch (error) {
        return res.render("login", { error: error.message });
    }
}

//for updating password
async function postNewPassword(req,res){
    try {
        const {email,OTP}=req.body;
        if(!email || !OTP) {
            throw Error("empty OTP details");
        } else { //verify OTP 
            const OTPverificationRecords=await OTPverification.find({email:email});
            if(OTPverificationRecords.length<=0) {
                throw new Error("No OTP verification records found");
            } else {
                const {expireAt}=OTPverificationRecords[0];
                const hashedOTP=OTPverificationRecords[0].otp;
                if(expireAt < Date.now()) {
                    await OTPverification.deleteMany({email:email});
                    throw new Error("OTP has been expired,please request again") 
                } else {
                    const validOTP=bcrypt.compare(OTP,hashedOTP);
                    await OTPverification.deleteMany({email:email});
                    if(!validOTP) {
                        throw new Error("Invalid OTP, try again")
                    } else {
                        const password=req.body.password;
                        const rpassword=req.body.rpassword;
                        if(password!==rpassword) {
                            throw new Error("passwords do not match")
                        } else {
                            const user=await loginschema.findOne({email:email});
                            if(!user) {
                                throw new Error("No such user found")
                            } else {
                                const newhashedPassword = await bcrypt.hash(req.body.password, 10);
                                user.password=newhashedPassword //update password
                                await user.save()
                                res.redirect("login");
                            }
                        }
                    }
                }
            }
        }
    } catch (error) {
        res.json({
            status:"FAILED",
            message:error.message,
        })
    }
}

//forgot password process
async function postForgotPassword(req,res) {
    try {
        const email=req.body.email;
        const user = await loginschema.findOne({email:email}); //find user
        if(!user) {
            throw new Error("no such user exists");
        } else {
            await OTPverification.deleteMany({email:email});
            const data={
                _id:user._id,
                email:email,
            }
            await sendGmailOTP(data,res); //send OTP
            res.redirect("/newpassword")
        }
    } catch (error) {
        res.json({
            status:"FAILED",
            message:error.message,
        })
    }
}

//logout process
async function logout(req,res) {
    try {
        res.clearCookie("uid") //clear cookies
        return res.redirect("/login") //redirect to login
    } catch (error) {
        res.json({
            status:"FAILED",
            message:error.message,
        })
    }
}

//create password process for googleAuth
async function postPassword(req,res) {
    const email=req.user.email;
    const password=req.body.password;
    const rpassword=req.body.rpassword;
    if(password!==rpassword) {
        throw new Error("passwords do not match")
    } else {
        const user=await loginschema.findOne({email:email});
        if(!user) {
            throw new Error("No such user found")
        } else {
            const newhashedPassword = await bcrypt.hash(req.body.password, 10);
            console.log(user.password)
            user.password=newhashedPassword
            await user.save()
            res.redirect("/happytails/user/main");
        }
    }
}

//export modules
module.exports={
    getHome,
    getLogin,
    getSignup,
    createLoginData,
    checkLoginCredential,
    getMain,
    getForgotPassword,
    getNewPassword,
    postNewPassword,
    postForgotPassword,
    logout,
    getPassword,
    postPassword,
}