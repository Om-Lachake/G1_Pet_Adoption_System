const express=require('express');
const passport=require("passport")
const router=express.Router();

const {
    submitForm,
    getForm,
    updateStatus,
    getFormMiddleware
} = require("../controllers/FormControllers")

router.post('/submitForm',submitForm)
router.get('/getForm',getForm)
router.patch('/updateStatus/:id',getFormMiddleware,updateStatus)
module.exports=router;