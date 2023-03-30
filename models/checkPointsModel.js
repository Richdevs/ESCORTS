const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var checkpointSchema = new mongoose.Schema({
    atd_msa:{
        type:Date,
        
    },
    ata_kampala:{
        type:Date,
    },
    atd_kampala:{
        type:Date,
    },
    ata_bulisa:{
        type:Date,
    },
    atd_bulisa:{
        type:Date,

    },
    ata_mombasa:{
        type:Date,

    },
},{timestamps:true});

//Export the model
module.exports = mongoose.model('Checkpoint', checkpointSchema);