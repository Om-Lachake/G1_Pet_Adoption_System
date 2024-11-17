const express=require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router=express.Router();
const {
    getAllPets,
    getOnePet,
    createPet,
    updatePet,
    deletePet,
    getPet,
    getPetDetails,
    getTest
} = require('../controllers/APIControllers')
const {restrictToAdminOnly} = require('../middleware/auth')
router.get('/',getPetDetails)
router.get('/pets',getAllPets)
router.get('/admin',restrictToAdminOnly,getTest)
router.get('/pets/:id',getPet,getOnePet)
router.post('/pets',upload.single('file'),createPet)
router.patch('/pets/:id',upload.single('file'),getPet,updatePet)
router.delete('/pets/:id',getPet,deletePet)

module.exports=router
