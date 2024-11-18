//import
const jwt=require("jsonwebtoken")
require('dotenv').config()

//create cookie
function setUser(user) {
    return jwt.sign({
        _id:user._id,
        email:user.email,
        username:user.username,
        admin:user.admin
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

function setAdmin(user) {
    return jwt.sign({
        _id:user._id,
        email:user.email,
        username:user.username,
        admin:user.admin

    },process.env.AKEY);
}

function getAdmin(token) { 
    if(!token) return null
    try {
        return jwt.verify(token,process.env.AKEY);
    } catch (error) {
        return null
    }
    
}

//export module
module.exports={
    setUser,
    getUser,
    setAdmin,
    getAdmin
}