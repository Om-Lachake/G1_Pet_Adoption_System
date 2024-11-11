//imports
const {getUser}=require("../service/auth.js")
//check for uid cookie and disallow access if cookie not found
async function restrictToLoggedInUserOnly(req,res,next) {
    if(!req.cookies || !req.cookies.uid) return res.status(401).json({ success: false, message: "Authentication failed" });
    const userUID=req.cookies.uid;
    if(!userUID) return res.status(401).json({ success: false, message: "Authentication failed" });
    const user=await getUser(userUID)
    if(!user) return res.status(401).json({ success: false, message: "Authentication failed" });
    req.user=user
    next()
}
//export module
module.exports={restrictToLoggedInUserOnly}