const { json } = require("body-parser");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const genSalt = require("bcrypt");
const {sendEmail}=require("../controllers/emailCtrl");
const { genToken } = require("../configs/jwtToken");
const {generateRefreshToken}=require("../configs/refreshToken");
const validateMongoDbId = require("../utils/validateMongoDbId");
const crypto=require("crypto");
const jwt = require("jsonwebtoken");
const secret=process.env.JWT_SECRET;

//Add a new User
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        //Create a new user
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        //User Already exists
        throw new Error('User Already Exists');
    }
});
//For handling refresh token
const handleRefreshToken=asyncHandler(async(req,res)=>{
    const cookie=req.cookies;
    console.log(cookie);
    if(!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken=cookie.refreshToken;
    console.log(refreshToken);
    const user=await User.findOne({refreshToken});
    if(!user) throw new Error('No Refresh token present in DB or not matched');
    jwt.verify(refreshToken,`${secret}`,(err,decoded)=>{
        if(err || user.id !== decoded.id){
            throw new Error("There is something wrong with refresh token");
        }
        const accessToken = genToken(user?._id);
        res.json({accessToken});
    });
    res.json(user);

});
//logout functionality
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204); //forbidden 
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: "",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    return res.sendStatus(204); //forbidden
});

//User login 
const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //check if user exists or not
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateuser = await User.findByIdAndUpdate(findUser?.id, {
            refreshToken: refreshToken,
        }, { new: true, });
        res.cookie("refreshToken",refreshToken,{httpOnly:true,
        maxAge:72*60*60*1000,});
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            phone: findUser?.phone,
            token: genToken(findUser?._id),
        });

    } else {
        throw new Error("Invalid Credentials");
    }
});
// Pull all users from the database

const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);

    } catch (error) {
        throw new Error(error)
    }
});
//pull a single User from the database
const getAuser = asyncHandler(async (req, res) => {

    const { id } = req.params
    validateMongoDbId(id);
    try {
        const getAuser = await User.findById(id);
        res.json({
            getAuser,
        });
    } catch (error) {
        throw new Error(error)
    }
});
//update a single User from the database
const updateAuser = asyncHandler(async (req, res) => {

    const { _id } = req.user
    validateMongoDbId(id);
    try {
        const updateAuser = await User.findByIdAndUpdate(_id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            phone: req?.body?.phone,
        }, {
            new: true,
        });
        res.json(updateAuser);

    } catch (error) {
        throw new Error(error)
    }
});



//delete a single User from the database
const deleteAuser = asyncHandler(async (req, res) => {

    const { id } = req.params

    try {
        const deleteAuser = await User.findByIdAndDelete(id);
        res.json({
            deleteAuser,
        });
        
    } catch (error) {
        throw new Error(error)
    }

});
const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const block = await User.findByIdAndUpdate(id, {
            isBlocked: true
        }, { new: true, });
        res.json({
            message:"User Blocked"
        })
    } catch (error) {
        throw new Error(error)
    }
});
const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const unblock = await User.findByIdAndUpdate(id, {
            isBlocked: false
        }, { new: false, });
        res.json({
            message: "User Unblocked"
        })
    } catch (error) {
        throw new Error(error)
    }
});
const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const UpdatedPassword = await user.save();
        res.json(UpdatedPassword);
    } else {
        res.json(user);
    }
});
const forgotPasswordToken=asyncHandler(async(req,res)=>{
    const {email}=req.body;
    const user=await User.findOne({email});
    if(!user) throw new Error("User with this email not found!");
    try{
       const token=await user.createPasswordToken();
       await user.save();
       const resetURL=`Hello, Kindly follow this link to reset your password. This link is only valid for 10 Minutes from Now,
       <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here`
       const data={
        to:email,
        text:"Hey User",
        subject:"Forgot Password Reset Link",
        htm:resetURL
       };
       sendEmail(data);
       res.json(token);
    }catch(error){
        throw new Error(error)

    }
});
const resetPassword=asyncHandler(async(req,res)=>{
    const {password}=req.body;
    const {token}=req.params;
    const hashedToken=crypto.createHash("sha256").update(token).digest("hex");
    const user=await User.findOne({
        passwordResetToken:hashedToken,
        passwordResetExpires:{$gt:Date.now()},
    });
    if(!user) throw new Error("Token Expired,Try again later");
    user.password=password;
    user.passwordResetToken=undefined;
    user.passwordResetExpires=undefined;
    await user.save();
    res.json(user);
});
//Add to shopping Cart


module.exports = {
    createUser, loginUserCtrl,
    getAllUsers, updateAuser,
    getAuser, deleteAuser,
    unblockUser, blockUser,
    handleRefreshToken, logout,
    updatePassword,forgotPasswordToken,
    resetPassword
};