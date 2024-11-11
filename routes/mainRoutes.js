const express=require('express');
const router=express.Router();
const {logout}=require("../controllers/loginControllers")

//routing
router.get("/logout",logout)

//export module
module.exports=router