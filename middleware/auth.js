//imports
const {getUser}=require("../service/auth.js")
//check for uid cookie and disallow access if cookie not found
async function restrictToLoggedInUserOnly(req,res,next) {
    if(req.cookies===null) return res.redirect("/login")
    const userUID=req.cookies.uid;
    if(!userUID) return res.redirect("/login")
    const user=getUser(userUID)
    if(!user) return res.redirect("/login")
    req.user=user
    next()
}
//export module
module.exports={restrictToLoggedInUserOnly}