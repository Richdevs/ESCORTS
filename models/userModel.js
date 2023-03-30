const mongoose = require("mongoose"); //erase if already required
const bcrypt = require('bcrypt');
const crypto=require("crypto");
//Declare Mongodb Model Schema

var userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    },
    isBlocked:{
        type:Boolean,
        default:false,
    },
   
    refreshToken:{
        type:String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

}, {
    timestamps: true,
});
//Encrypt Password
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")){
        next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});
//Match passwords
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.createPasswordToken = async function () {
    const resettoken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resettoken)
        .digest("hex");
    this.passwordResetExpires=Date.now()+30*60*1000; //Reset in 10 MINUTES
    return resettoken;

};



module.exports = mongoose.model("User", userSchema);