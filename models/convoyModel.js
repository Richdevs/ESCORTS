const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var convoySchema = new mongoose.Schema({
    convoy_name: {
        type: String,
        required: true,
        unique: true,

    },
    start_date: {
        type: Date,

    },
    start_location: {
        type: String,
    },
    end_date: {
        type: Date,

    },
    end_location: {
        type: String,

    },
    escorted_trucks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Truck",
    }],
    convoy_updates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Updates",
    }],
    convoy_status: {
        type: String,
        default: "INITIAL-STOP",
        enum: ["MOVING", "STOPPED", "ENDED", "INITIAL-STOP"],
    },
    color: {
        type: String,
        default: "GREY",
        enum: ["GREY", "GREEN", "YELLOW", "BLUE"],
    },
    checkpoints:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Checkpoint",
    },
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Convoy', convoySchema);