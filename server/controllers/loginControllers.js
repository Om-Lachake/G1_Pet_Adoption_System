//imports
const loginschema=require('../models/loginschema')
const nodemailer=require('nodemailer')
const bcrypt=require('bcrypt')
const OTPverification = require('../models/OTPverification')
const {sendGmailOTP} = require ('./OTPControllers.js')
const {setUser} = require("../service/auth.js")
const passport=require("passport")


//for sign up process
async function createLoginData(req, res) {
    try {
        const existingUser = await loginschema.findOne({ email: req.body.email });
        
        if (existingUser) { // If user already exists
            return res.json({success:false, message: "User is already registered, use a different email" });
        } else if (req.body.password !== req.body.rpassword) { // If passwords do not match
            return res.json({success:false, message: "Passwords do not match." });
            
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const newUser = new loginschema({ // Create entry in DB
                username: req.body.username,
                id: Date.now(),
                email: req.body.email,
                password: hashedPassword,
                verified: false,
            });
            const result = await newUser.save();
            await sendGmailOTP(result, res); // Send verification OTP
            return res.json({success:true,message:"email sent successfully"})
        }
    } catch (error) {
        return res.json({success:false, message: "An error occurred during signup.", error: error.message });
    }
}


//for login process
async function checkLoginCredential(req, res) {
    try {
        const user = await loginschema.findOne({ email: req.body.email });
        if (!user) { //if no user exists
            return res.json({success:false, message: "Invalid email or password." }); //render login
        } 
        if (!user.verified) { //if user has not been verified
            return res.json({success:false, message: "User is not verified" }); //render resendotp
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if (isPasswordMatch) {
            const token=setUser(user)
            res.cookie("uid", token, { 
                httpOnly: true, // The cookie is not accessible via JavaScript
                sameSite: "strict", // Restrict the cookie to same-site requests
                path: "/"
              });
            return res.json({success:true,message:"logged in successfully",user:user})//create cookie
        } else {
            return res.json({success:false, message: "Invalid email or password." }); //render login
        } 
    } catch (error) {
        return res.json({success:false, error: error.message }); //render login
    }
}

//for updating password
async function postNewPassword(req,res){
    try {
        const {email,OTP}=req.body;
        if(!email || !OTP) {
            return res.json({success:false, message: "Empty OTP details" });
        } else { //verify OTP 
            const OTPverificationRecords=await OTPverification.find({email:email});
            if(OTPverificationRecords.length<=0) {
                return res.json({success:false, message: "No OTP verification records found" });
            } else {
                const {expireAt}=OTPverificationRecords[0];
                const hashedOTP=OTPverificationRecords[0].otp;
                if(expireAt < Date.now()) {
                    await OTPverification.deleteMany({email:email});
                    return res.json({success:false, message: "OTP has expired, please request again" });
                } else {
                    const validOTP=bcrypt.compare(OTP,hashedOTP);
                    await OTPverification.deleteMany({email:email});
                    if(!validOTP) {
                        return res.json({success:false, message: "Invalid OTP, try again" });
                    } else {
                        const password=req.body.password;
                        const rpassword=req.body.rpassword;
                        if(password!==rpassword) {
                            return res.json({success:false, message: "Passwords do not match" });
                        } else {
                            const user=await loginschema.findOne({email:email});
                            if(!user) {
                                return res.json({success:false, message: "No such user found" });
                            } else {
                                const newhashedPassword = await bcrypt.hash(req.body.password, 10);
                                user.password=newhashedPassword //update password
                                await user.save()
                                return res.status(200).json({success:true,message: "Password Changed Successfully", redirectTo: "/login" });
                            }
                        }
                    }
                }
            }
        }
    } catch (error) {
        return res.json({
            success:false,
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
            return res.json({
                success: false,
                message: "User doesn't exists! Please register first",
              });
        } else {
            await OTPverification.deleteMany({email:email});
            const data={
                _id:user._id,
                email:email,
            }
            await sendGmailOTP(data,res); //send OTP
            res.status(200).json({ success:true,message: "Enter new password", redirectTo: "/newpassword" });
        }
    } catch (error) {
        return res.json({
            success: false,
            message:error.message,
        })
    }
}

//logout process
async function logout(req,res) {
    try {
        res.clearCookie("uid") //clear cookies
        return res.json({
            success: true,
            message:"Logged Out successfully"
        }) //redirect to login
    } catch (error) {
        res.json({
            success: false,
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
        return res.json({
            success: false,
            message: "Password doesn't match",
          });
    } else {
        const user=await loginschema.findOne({email:email});
        if(!user) {
            return res.json({
                success: false,
                message: "User doesn't exists! Please register first",
              });
        } else {
            const newhashedPassword = await bcrypt.hash(req.body.password, 10);
            console.log(user.password)
            user.password=newhashedPassword
            await user.save()
            res.status(200).json({ success:true,message: "User registered", redirectTo: "/happytails/user/main" });
        }
    }
}

//export modules
module.exports={
    createLoginData,
    checkLoginCredential,
    postNewPassword,
    postForgotPassword,
    logout,
    postPassword,
}