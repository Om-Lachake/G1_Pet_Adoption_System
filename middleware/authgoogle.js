//imports
require('dotenv').config()
const passport=require("passport");
const loginschema = require('../models/loginschema');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {setUser,getUser} = require("../service/auth.js")

//create GoogleStrategy to access sign in via google
passport.use(new GoogleStrategy({
    clientID:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/happytails/main",
    scope:['profile','email']
  },
  async (accessToken, refreshToken, profile, done) => {
    const id=profile.id;
    const email = profile.emails[0].value; //get email
    var firstTime=false;
    var user=await loginschema.findOne({email:email}) //check if user exist
    if(!user || !user.id) { //create user in db if not exist
      await loginschema.deleteOne({email:email});
      const newuser= new loginschema({
        id:id,
        email:email,
        verified:true,
      })
      var user=await newuser.save()
      var firstTime=true;
    }
    const token=setUser(user) //create cookie
    return done(null,{user,token,firstTime}) //pass cookie forward
  }
));

//serialize and deserialize function
passport.serializeUser(function({user},done){
  done(null,user.id)
}) 
passport.deserializeUser(async (id,done)=>{
  const user=await loginschema.findOne({id:id});
  done(null,user)
}) 