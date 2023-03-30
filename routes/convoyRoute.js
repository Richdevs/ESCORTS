const express= require("express");

const {createConvoy,updateConvoy,getAconvoy,
       getAllconvoys,deleteAconvoy,
       startConvoy,endConvoy,stopConvoy, addConvoyUpdate, editConvoyUpdate, deleteConvoyUpdate, getUpdates, getAnupdate, checkpointUpdate, editCheckpoint, delChkpoint, getAllCheckpoints, getCheckpoint}=require("../controllers/convoyCtrl");
const {authMiddleware,isAdmin} = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/",createConvoy);
router.post('/checkpoint/:id',checkpointUpdate);
router.post("/updates/:id",addConvoyUpdate);
router.put("/update/:id",updateConvoy);
router.put('/check-update/:id',editCheckpoint);
router.put('/edit-updates/:id',editConvoyUpdate);
router.put('/start/:id',startConvoy);
router.put('/stop/:id',stopConvoy);
router.put('/end/:id',endConvoy);
router.delete("/:id",deleteAconvoy);
router.delete('/del-update/:id',deleteConvoyUpdate);
router.delete('/del-checkpoint/:id',delChkpoint);
router.get("/convoy-updates",getUpdates);
router.get('/get-update/:id',getAnupdate);
router.get("/all-convoys",getAllconvoys);
router.get("/:id",getAconvoy);
router.get('/checkpoint/all',getAllCheckpoints);
router.get('/checkpoint/:id',getCheckpoint)



 

module.exports=router;