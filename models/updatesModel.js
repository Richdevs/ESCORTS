const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var updatesSchema = new mongoose.Schema({
    current_location:{
        type:String,
        required:true,
    },
    period:{
        type:String,
        required:true,
        default:"NULL",
       enum:["MORNING","NOON","EVENING","NULL"]
    },
    comments:{
        type:String,
        required:true,
      
    },
    
},{timestamps:true});

//Export the model
module.exports = mongoose.model('Updates', updatesSchema);