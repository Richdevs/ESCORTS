const { json } = require("body-parser");
const Convoy = require("../models/convoyModel");
const Updates=require("../models/updatesModel");
const Checkpoint=require("../models/checkPointsModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");
// Add a new convoy

const createConvoy = asyncHandler(async (req, res) => {
    const convoy_name = req.body.convoy_name;
    const findConvoy = await Convoy.findOne({ convoy_name: convoy_name });
    if (!findConvoy) {
        //Create a new convoy
        const newConvoy= await Convoy.create(req.body);
        res.json(newConvoy);
    } else {
        // convoy already exists
        throw new Error('Convoy Already Exists');
    }
});

//update a convoy
const updateConvoy=asyncHandler(async(req,res)=>{
    const id = req.params
    validateMongoDbId(id);
    try {
        const updateconvoy = await Convoy.findOneAndUpdate({id}, req.body, {
            new: true,
        });
        res.json(updateconvoy);

    } catch (error) {
        throw new Error(error)
    }
});

//get a single convoy
const getAconvoy=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    try{
        const findconvoy=await Convoy.findById(id);
        res.json(findconvoy);
        
    }catch(error){
        throw new Error(error);

    }
});
//get all convoys
const getAllconvoys=asyncHandler(async(req,res)=>{
   
    try{
        const AllConvoys=await Convoy.find();
        res.json(AllConvoys);
        
    }catch(error){
        throw new Error(error);

    }
});
//delete a single truck 
const deleteAconvoy= asyncHandler(async (req, res) => {

    const { id } = req.params

    try {
        const deleteAconvoy= await Convoy.findByIdAndDelete(id);
        res.json(
            deleteAconvoy
        );
        
    } catch (error) {
        throw new Error(error)
    }

});
//start a convoy
const startConvoy = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id);
    let convStatus="MOVING";
    let statusColor="GREEN";
    const convoy=await Convoy.findById(id);
    const checkStatus = convoy.convoy_status;
    if (checkStatus == "MOVING") {
        throw new Error("Can't start a convoy when is already moving");
    } else if (checkStatus == "ENDED") {
        throw new Error("Can't start an ended convoy");
    } else {
        const startConvoy = await Convoy.findOneAndUpdate({ id }, {
            convoy_status:convStatus,
            color: statusColor,
            start_date:req?.body?.start_date,
            start_location:req?.body?.start_location,
        },{new:true,});

        res.json(startConvoy);
    }

});
//End a convoy
const endConvoy = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id); 
    const convoy=await Convoy.findById(id);
    const checkStatus = convoy.convoy_status;
    if (checkStatus == "INITIAL-STOP") {
        throw new Error("Convoy not started yet");
    } else if (checkStatus == "ENDED") {
        throw new Error("Convoy already ended");
    } else {
        const endConvoy = await Convoy.findOneAndUpdate({ id }, {
            convoy_status: "ENDED",
            color: "BLUE",
            end_date:req?.body?.end_date,
            end_location:req?.body?.end_location,
        });
         res.status(200).json(endConvoy);
    }

});
//stop a convoy
const stopConvoy = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id);
    const convoy=await Convoy.findById(id);
    const checkStatus = convoy.convoy_status;
    if (checkStatus == "STOPPED") {
        throw new Error("Can't stop a convoy when is already stopped");
    } else if (checkStatus == "ENDED") {
        throw new Error("Can't stop an ended convoy");
    } else {
        const stopConvoy = await Convoy.findOneAndUpdate({ id }, {
            convoy_status: "STOPPED",
            color: "YELLOW"

        });

        res.status(200).json(stopConvoy);
    }

});
//add convoy update
 const addConvoyUpdate=asyncHandler(async(req,res)=>{
    const {id}=req.params;
   try{
     const newConvoyUpdate=await Updates.create(req.body);
     res.status(200).json(newConvoyUpdate);
     //Update Convoy 
     
        const updateConvoy=await Convoy.findByIdAndUpdate(id,
            {
                $push:{convoy_updates:newConvoyUpdate._id}
            },{new:true,});
            res.json(updateConvoy);
     
     }catch(error){
    throw new Error(error);
   }
 });
//update convoy update
const editConvoyUpdate = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {

        const editUpdate = await Updates.findOneAndUpdate(id, req.body, { new: true, });
        res.status(200).json(editUpdate);
    } catch (error) {
        throw new Error(error);
    }
});
 //delete convoy location update
const deleteConvoyUpdate = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { updateId } = req.body;

    
    validateMongoDbId(id);
    try {
        const convoy = await Convoy.findById(id);
        const alreadyAdded = convoy.convoy_updates.find((id) => id.toString() === updateId);
        if (!alreadyAdded) {
            throw new Error("Update Not Found");
        } else {
            let convoy = await Convoy.findByIdAndUpdate(id, {
                $pull: { convoy_updates: updateId },
            }, {
                new: true,
            });
            const delUpdate=await Updates.findByIdAndDelete(updateId);
            res.json(convoy);
        }
    } catch (error) {
        throw new Error(error);
    }
});
//get aUpdates based on Id from convoy 

const getUpdates = asyncHandler(async (req, res) => {
    try {
        const updates = await Convoy.find()
        .populate({path:"convoy_updates"});
        res.json(updates);

    } catch (error) {
        throw new Error(error)
    }
});
//get Updates based by convoy Id 

const getAnupdate = asyncHandler(async (req, res) => {
    const {id}=req.params;
    try {
        const updates = await Convoy.findOne({id})
        .populate({path:"convoy_updates"});
        res.json(updates);

    } catch (error) {
        throw new Error(error)
    }
});
//update a convoy checkpoint 
const checkpointUpdate = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const chkUpdate = await Checkpoint.create(req.body);
        res.status(200).json(chkUpdate);

        //Update Convoy Model checkpoints with Checkpoint ID.
        let chkId=chkUpdate._id;
        console.log(chkId);
        const updateConvoy = await Convoy.findOneAndUpdate({id},
            {checkpoints:chkId
            },{new:true});
       // res.json(updateConvoy);

    } catch (error) {
        throw new Error(error);
    }
});
//update checkpoint
const editCheckpoint = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {

        const editChkpoint = await Checkpoint.findOneAndUpdate(id, req.body, { new: true, });
        res.status(200).json(editChkpoint);
    } catch (error) {
        throw new Error(error);
    }
});
//delete convoy location update
const delChkpoint = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { chkId } = req.body;

    
    validateMongoDbId(id);
    try {
        const convoy = await Convoy.findById(id);
        //checks if there is a checkpoint associated with a convoy on the convoy document
        const alreadyAdded = (convoy.checkpoints === chkId);
       
        if (!alreadyAdded) {
            throw new Error(" No checkpoints Found");
        } else {
            //removes the checkpoint Id from convoy document if one is found
            let convoy = await Convoy.updateOne({id}, {
                $unset: {checkpoints:chkId}, },{new:true,}
           );
           console.log(convoy);
            // deletes checkpoint from checkpoints document
            const delChkpoint=await Checkpoint.findByIdAndDelete(chkId);
            res.json(delChkpoint);
        }
    } catch (error) {
        throw new Error(error);
    }
});


/**
 * GET A CHECKPOINT UPDATE
 */
const getCheckpoint=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    try {
        const checkpoint = await Convoy.findOne({id},{checkpoints:1})
        .populate({path:"checkpoints"});
        res.json(checkpoint);

    } catch (error) {
        throw new Error(error)
    }
});

/**
 * GET ALL CHECKPOINT UPDATES BY CONVOY ID
 */
const getAllCheckpoints=asyncHandler(async(req,res)=>{
    try {
        const checkpoints = await Checkpoint.find();
        res.json(checkpoints);

    } catch (error) {
        throw new Error(error)
    }
});
module.exports={createConvoy,updateConvoy,
                getAconvoy,getAllconvoys,
                deleteAconvoy,startConvoy,
                endConvoy,stopConvoy,
                checkpointUpdate,editCheckpoint,
                addConvoyUpdate,editConvoyUpdate,
                deleteConvoyUpdate,getUpdates,
                getAnupdate,delChkpoint,
                getAllCheckpoints,getCheckpoint
                 };