//import
const jwt=require("jsonwebtoken")
require('dotenv').config()

//create cookie
function setUser(user) {
    return jwt.sign({
        _id:user._id,
        email:user.email,
    },process.env.KEY);
}

//verify cookie
function getUser(token) { 
    if(!token) return null
    try {
        return jwt.verify(token,process.env.KEY);
    } catch (error) {
        return null
    }
    
}

//export module
module.exports={
    setUser,
    getUser
}