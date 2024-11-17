//imports
const loginschema=require('../models/loginschema')
const nodemailer=require('nodemailer')
const bcrypt=require('bcrypt')
const OTPverification = require('../models/OTPverification')
require('dotenv').config()
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

//set up for sending OTP verification emails
const setGmailForOTP = async () => {
    try {
        const oauth2Client = new OAuth2( //use google OAuth2
            process.env.CLIENT_ID_SMTP,
            process.env.CLIENT_SECRET_SMTP,
            "https://developers.google.com/oauthplayground"
        );
        oauth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN,
        });
        const accessToken = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err) {
                    console.log("*ERR: ", err)
                    reject();
                }
                resolve(token); 
            });
        });
        const transporter = nodemailer.createTransport({ //specify transport details
            service: "gmail",
            auth: {
              type: "OAuth2",
              user: process.env.USER_EMAIL,
              accessToken,
              clientId: process.env.CLIENT_ID_SMTP,
              clientSecret: process.env.CLIENT_SECRET_SMTP,
              refreshToken: process.env.REFRESH_TOKEN,
            },
        });
        return transporter;
    } catch (error) {
        res.json({
            success:false,
            message:error.message,
        })
    }
}

//send OTP email 
const sendGmailOTP = async ({_id,email},res) => {
    try {
        const otp = `${Math.floor(Math.random() * 9000 + 1000)}` //create 4 digit OTP
        const mailOptions = { //email details
            from: process.env.USER_EMAIL,
            to: email,
            subject: "Verify Your HappyTails account",
            html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 500px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #f9f9f9; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <h2 style="text-align: center; color: #007BFF; font-weight: bold; margin-bottom: 20px;">Email Verification</h2>
                <p style="font-size: 16px; text-align: center;">
                    Use the following <strong style="color: #007BFF; font-size: 18px;">OTP</strong> to verify your email:
                </p>
                <div style="font-size: 24px; font-weight: bold; color: #007BFF; text-align: center; margin: 20px 0; padding: 10px; border: 1px dashed #007BFF; border-radius: 5px;">
                    ${otp}
                </div>
                <p style="font-size: 16px; text-align: center; margin-bottom: 20px;">
                    <strong>Note:</strong> This OTP is valid for <strong style="color: #FF0000;">1 hour</strong>.
                </p>
                <p style="font-size: 16px; text-align: center;">
                    Thank you for joining us! If you have any questions, feel free to reach out to our support team.
                </p>
                <p style="font-size: 16px; text-align: center; margin-top: 20px; color: #555;">
                    Best regards,<br>
                    <strong>HappyTails</strong>
                </p>
            </div>`,
        }
        const hashedOTP = await bcrypt.hash(otp, 10);
        const newOTPVerification = new OTPverification({ //create OTP details in db
            userID: _id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expireAt: Date.now() + 3600000,
            email:email,
        });
        await newOTPVerification.save();
        let emailTransporter = await setGmailForOTP();
        await emailTransporter.sendMail(mailOptions); //send OTP email
    } catch (error) {
        res.json({
            success:false,
            message:error.message,
        })
    }
}

//verify OTP 
async function checkOTP(req,res){
    try {
        const {email,OTP}=req.body;
        if(!email || !OTP) {
            return res.status(400).json({ success: false, message: "Empty OTP details" });
        } else { //check for OTP correctness
            const OTPverificationRecords=await OTPverification.find({email:email});
            if(OTPverificationRecords.length<=0) {
                return res.status(400).json({ success: false, message: "Account is either invalid or already been verified" });
            } else {
                const {expireAt}=OTPverificationRecords[0];
                const hashedOTP=OTPverificationRecords[0].otp;
                if(expireAt < Date.now()) {
                    await OTPverification.deleteMany({email:email});
                    return res.status(400).json({ success: false, message: "OTP has been expired, please request again" }); 
                } else {
                    const validOTP=bcrypt.compare(OTP,hashedOTP);
                    if(!validOTP) {
                        return res.status(404).json({ success: false, message: "Invalid OTP, try again" });
                    } else { //verify user
                        await loginschema.updateOne({email:email},{verified:true});
                        await OTPverification.deleteMany({email:email});
                        //res.redirect("/login") //redirect to login after verification
                        res.json({success : true,message:"verified",isVerified:true,user:{email:email,isVerified:true}})
                    }
                }
            }
        }
    } catch (error) {
        res.json({
            success:false,
            message:error.message,
        })
    }
}

//resend OTP process
async function postResendOTP(req,res) {
    try {
        const email=req.body.email;
        const user = await loginschema.findOne({email:email}); //get user through email
        if(!user) {
            return res.status(404).json({ success:false, message: "No such user exists" });
        } else {
            await OTPverification.deleteMany({email:email});
            const data={
                _id:user._id,
                email:email,
            }
            await sendGmailOTP(data,res); //send OTP email again
            res.json({success:true, message: "Email sent 12332,4"})
        }
    } catch (error) {
        res.json({
            success:false,
            message:error.message,
        })
    }
}

//export modules
module.exports={
    checkOTP,
    postResendOTP,
    setGmailForOTP,
    sendGmailOTP,
}