const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var truckSchema = new mongoose.Schema({
    srn_no:{
        type:String,
        required:true,
       
    },
    truck_registration:{
        type:String,
        required:true,
        unique:true,
    },
    transporter:{
        type:String,
        required:true,
    },
    convoy_no:{
        type:String,
        required:true,
    },
    truck_driver:{
        type:String,
        required:true,
    },
    driver_id:{
        type:String,
        required:true,
    },
    incidents:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Incident",
    }],
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Truck', truckSchema);