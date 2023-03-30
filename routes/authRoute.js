const express= require("express");
const {createUser, 
    loginUserCtrl, 
    getAllUsers,
    getAuser,
    deleteAuser,
    updateAuser,
    forgotPasswordToken,
    resetPassword,
    blockUser,
    unblockUser,handleRefreshToken,updatePassword,logout}=require("../controllers/userCtrl");
const {authMiddleware,isAdmin} = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register",createUser);
router.post("/login",loginUserCtrl);
router.get("/all-users",getAllUsers);
router.post("/forgot-password",forgotPasswordToken);
router.post("/reset-password/:token",resetPassword);
router.get("/refresh",handleRefreshToken);
router.put("/password",authMiddleware,updatePassword);
router.get("/logout",logout);
router.get("/:id",authMiddleware,isAdmin, getAuser);
router.put("/edit-user",authMiddleware,updateAuser);
router.put("/block-user/:id",authMiddleware,isAdmin,blockUser);
router.put("/unblock-user/:id",authMiddleware,isAdmin,unblockUser);
router.delete("/:id",deleteAuser);


module.exports=router;