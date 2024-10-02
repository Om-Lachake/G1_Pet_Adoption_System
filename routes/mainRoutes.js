//imports
const express=require('express');
const router=express.Router();
const {getMain,logout}=require("../controllers/loginControllers")

//routing
router.get("/main",getMain)
router.get("/logout",logout)

//export module
module.exports=router