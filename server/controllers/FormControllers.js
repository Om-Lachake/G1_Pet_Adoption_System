const formschema = require('../models/formschema')

async function submitForm(req,res) {
    try {
        const {name,email,address,firstpet,whyadopt,petid} =req.body;
        //console.log(name,email,address,firstpet,whyadopt);
        const existingForm = formschema.findOne({email:email,petid:petid});
        if(existingForm) {
            return res.json({success:false,message:"you have already applied for this pet"});
        } else {
            if(!name || !email || !address || !firstpet || !whyadopt) {
                return res.json({success:false,message:"all fields required"});
            }
            const newForm = new formschema({ 
                name: name,
                email: email,
                address: address,
                firstpet: firstpet,
                whyadopt: whyadopt,
                petid:petid,
                status: "pending"
            });
            const result = await newForm.save();
            return res.json({success:true,message:"form submitted succesfully"});
        }
    } catch (error) {
        return res.json({success:false, message: "error during form submition", error: error.message });
    }
}

async function getForm(req, res) {
    try {
        const { petid, _id, status, email } = req.query;
        const query = {};
        if (petid) {
            query.petid = petid;
        }
        if (_id) {
            query._id = _id; 
        }
        if (status) {
            query.status = status;
        }
        if (email) {
            query.email = email;
        }
        const forms = await formschema.find(query);
        res.json({ success: true, message: "Filtered forms retrieved", forms });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

async function getFormMiddleware(req,res,next) {
    let form
    try {
        form = await formschema.findById(req.params.id)
        if(form==null) {
            return res.status(400).json({success:false,message:"cannot find form"})
        } 
    } catch (error) {
        return res.status(500).json({success:false,message:err.message})
    }
    res.form=form
    next()
}

async function updateStatus(req,res) {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ success: false, message: "Status is required" });
        }
        if (!res.form) {
            return res.status(404).json({ success: false, message: "No form found" });
        }
        res.form.status = status;
        const updatedForm = await res.form.save();
        res.json({ success: true, message: "Status updated", updatedForm });
    } catch (error) {
        res.status(400).json({ success:false,message: error.message });
    }
}

module.exports = {
    submitForm,
    getForm,
    updateStatus,
    getFormMiddleware
}