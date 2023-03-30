const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var incidentSchema = new mongoose.Schema({
    location:{
        type:String,
       
    },
     reason:{
        type:String,
        required:true,
     
    },
    action_taken:{
        type:String,
        required:true,
    },
    incident_status:{
        type:String,
        default:"PENDING",
        enum:["RESOLVED","PENDING"],
    }
    
},{timestamps:true});

//Export the model
module.exports = mongoose.model('Incident', incidentSchema);