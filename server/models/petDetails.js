const mongoose = require('mongoose');
const petSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    type:{
        type:String,
        require:true
    },
    gender:{
        type:String,
        require:true
    },
    imageUrl:{
        type:String,
        require:true
    },
    age:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    }
});
module.exports = mongoose.model('Pet', petSchema);
