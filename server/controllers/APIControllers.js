const Pet = require('../models/petDetails');
const { bucket } = require('../service/firebaseConfig');
const path = require('path');
async function getPetDetails(req,res) {
    res.render("pets")
}
async function getTest(req,res) {
    res.render("test")
}
async function getAllPets(req,res) {
    try {
        // Build the query object based on request parameters
        let query = {};

        // Exact match filters
        if (req.query.type) query.type = req.query.type;
        if (req.query.gender) query.gender = req.query.gender;
        

        // Partial match filters (using regex for case-insensitive matching)
        if (req.query.name) query.name = new RegExp(req.query.name, 'i');
        if (req.query.description) query.description = new RegExp(req.query.description, 'i');

        // Age range filter
        if (req.query.minAge || req.query.maxAge) {
            query.age = {};
            if (req.query.minAge) query.age.$gte = parseInt(req.query.minAge);
            if (req.query.maxAge) query.age.$lte = parseInt(req.query.maxAge);
        }

        // Execute query
        const pets = await Pet.find(query);
        res.status(200).json({success:true,message:"pets found",pets});
    } catch (error) {
        res.status(500).json({success:false,messahe:"error", error: error.message });
    }
}
async function getOnePet(req,res) {
    res.json(res.pet)
}
async function createPet(req,res) {
    try {
        const { name, type, gender, age, description} = req.body;
        const file = req.file;
        //console.log(name, type, gender, age, description, file);
        // Upload image to Firebase Storage
        const blob = bucket.file(Date.now() + path.extname(file.originalname));
        const blobStream = blob.createWriteStream({
            resumable: false,
        });

        blobStream.on('error', (err) => {
            console.error(err);
            return res.json({success:false,message:'Something went wrong during the upload.'});
        });

        blobStream.on('finish', async () => {
            const imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            const pet = new Pet({ name, type, gender, imageUrl, age, description});
            await pet.save();
            res.status(201).json({success:true,message:"pet created",pet});
        });
        blobStream.end(file.buffer);
    } catch (error) {
        res.status(400).json({ success:false,message: error.message });
    }
}
async function updatePet(req,res) {
    const { name, type, gender, age, description } = req.body;
    const file = req.file;
    try {
        if (!res.pet) {
            return res.status(404).json({ success:false,message: 'Pet not found' });
        }
        // If an image file is provided, upload it to Firebase Storage
        if (file) {
            const blob = bucket.file(Date.now() + path.extname(file.originalname));
            const blobStream = blob.createWriteStream({
                resumable: false,
            });

            blobStream.on('error', (err) => {
                console.error(err);
                return res.status(500).json({success:false,message:'Something went wrong during the upload.'});
            });

            blobStream.on('finish', async () => {
                const imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                
                // Update pet fields including new imageUrl
                if (name != null) res.pet.name = name;
                if (type != null) res.pet.type = type;
                if (gender != null) res.pet.gender = gender;
                if (age != null) res.pet.age = age;
                if (description != null) res.pet.description = description;
                res.pet.imageUrl = imageUrl; // Set the new image URL

                // Save updated pet
                const updatedPet = await res.pet.save();
                res.json({success:true,message:"pet detail updated",updatedPet});
            });

            blobStream.end(file.buffer); // End the stream
        } else {
            // Update fields if no new image file is provided
            if (name != null) res.pet.name = name;
            if (type != null) res.pet.type = type;
            if (gender != null) res.pet.gender = gender;
            if (age != null) res.pet.age = age;
            if (description != null) res.pet.description = description;

            const updatedPet = await res.pet.save();
            res.json({success:true,message:"pet detail updated",updatedPet});
        }
    } catch (error) {
        res.status(400).json({ success:false,message: error.message });
    }
}
async function deletePet(req,res) {
    try {
        await res.pet.deleteOne()
        res.json({success:true,message:"deleted pet detail"})
    } catch (error) {
        res.status(500).json({ success:false,error: error.message });
    }
}
async function getPet(req,res,next) {
    let pet
    try {
        pet = await Pet.findById(req.params.id)
        if(pet==null) {
            return res.status(400).json({success:false,message:"cannot find pet"})
        } 
    } catch (error) {
        return res.status(500).json({success:false,message:err.message})
    }
    res.pet=pet
    next()
}
module.exports={
    getAllPets,
    getOnePet,
    createPet,
    updatePet,
    deletePet,
    getPet,
    getPetDetails,
    getTest
}
