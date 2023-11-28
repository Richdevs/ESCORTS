const { json } = require("body-parser");
const Truck = require("../models/TruckModel");
const Convoy = require("../models/convoyModel");
const Incident = require("../models/incidentsModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");

/**
 * TRUCKS FUNCTIONS
 */

// Add a new truck

const addTruck = asyncHandler(async (req, res) => {
    const truck_registration = req.body.truck_registration;
    const findTruck = await Truck.findOne({ truck_registration: truck_registration });
    if (!findTruck) {
        //Create a new truck
        const newtruck = await Truck.create(req.body);
        res.json(newtruck);
    } else {
        // truck already exists
        throw new Error('Truck Already Exists');
    }
});

//update truck
const updateTruck = asyncHandler(async (req, res) => {
    const id = req.params
    validateMongoDbId(id);
    try {
        const updatetruck = await Truck.findOneAndUpdate({ id }, req.body, {
            new: true,
        });
        res.json(updatetruck);

    } catch (error) {
        throw new Error(error)
    }
});

//get a single truck
const getAtruck = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const findtruck = await Truck.findById(id);
        res.json(findtruck);

    } catch (error) {
        throw new Error(error);

    }
});
//get all trucks
const getAllTrucks = asyncHandler(async (req, res) => {

    try {
        const Alltrucks = await Truck.find();
        res.json(Alltrucks);

    } catch (error) {
        throw new Error(error);

    }
});
//delete a single truck 
const deleteAtruck = asyncHandler(async (req, res) => {

    const { id } = req.params

    try {
        const deleteAtruck = await Truck.findByIdAndDelete(id);
        res.json({
            deleteAtruck,
        });

    } catch (error) {
        throw new Error(error)
    }

});
//assign truck to convoy

const assigntruck = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { truckId } = req.body;
    validateMongoDbId(id);

    try {
        const convoy = await Convoy.findById(id);
        const alreadyAdded = convoy.escorted_trucks.find((id) => id.toString() === truckId);
        if (alreadyAdded) {
            //throw new Error("Truck already assigned to Convoy");
            res.status(200).send({"msg":"Truck already assigned to convoy "})
        } else {
            let convoy = await Convoy.findByIdAndUpdate(id, {
                $push: { escorted_trucks: truckId },
            }, {
                new: true,
            });
            res.status(200).json(convoy);
        }
    } catch (error) {
        throw new Error(error);
    }

});
//remove truck to convoy

const undoTruckAssign = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { truckId } = req.body;
    validateMongoDbId(id);
    try {
        const convoy = await Convoy.findById(id);
        const alreadyAdded = convoy.escorted_trucks.find((id) => id.toString() === truckId);
        if (!alreadyAdded) {
            throw new Error("Truck Not Found");
        } else {
            let convoy = await Convoy.findByIdAndUpdate(id, {
                $pull: { escorted_trucks: truckId },
            }, {
                new: true,
            });
            res.status(200).json(convoy);
        }
    } catch (error) {
        throw new Error(error);
    }

});

/**
 * INCIDENTS FUNCTIONS
 */

/**
 * ADD INCIDENT
 */
const addIncident = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const newIncident = await Incident.create(req.body);
        
        res.status(200).json(newIncident);

        //add incident to the truck model. One truck can have many incidents. 
        const updateTruck = await Truck.findByIdAndUpdate(id,
            {
                $push: { incidents: newIncident._id }
            }, { new: true, });
        // res.json(updateTruck);

    } catch (error) {
        throw new Error(error);
    }
});

/**
 * EDIT INCIDENT
 */

const editIncident=asyncHandler(async(req,res)=>{
    const { id } = req.params;
    validateMongoDbId(id);
    try {

        const editIncident = await Incident.findOneAndUpdate(id, req.body, { new: true, });
        res.status(200).json(editIncident);
    } catch (error) {
        throw new Error(error);
    }
});

/**
 * RESOLVE INCIDENT
 */
const resolveIncident=asyncHandler(async(req,res)=>{
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const resolved=await Incident.findById(id);
        let status =resolved.incident_status;
        const alreadyResolved= status=== "RESOLVED";
        console.log(!alreadyResolved);
        if(!alreadyResolved){
            //throw new Error("Incident already resolved");
            res.send({"msg":"Incident already resolved"});
        }else{
            const editIncident = await Incident.findOneAndUpdate(id, req.body, { new: true, });
        res.status(200).json(editIncident);

        }
        } catch (error) {
        throw new Error(error);
    }

});

/**
 * REMOVE INCIDENT
 */
const deleteIncident = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { incidentId } = req.body;

    
    validateMongoDbId(id);
    try {
        const truck = await Truck.findById(id);
        //checks if there is a checkpoint associated with a convoy on the convoy document
     
        const alreadyAdded = truck.incidents.find((id)=>id.toString() === incidentId);
      
        if (!alreadyAdded) {
           // throw new Error("The incident couldn't be found");
           res.status(200).send({"msg":"No incident found"});
            
        } else {
            //removes the incident Id from convoy document if one is found
            let convoy = await Truck.updateOne({id}, {
                $pull: {incidents:incidentId}, },{new:true,}
           );
           console.log(convoy);
            // deletes checkpoint from checkpoints document
            const delIncident=await Incident.findByIdAndDelete(incidentId);
            res.json(delIncident);
        }
    } catch (error) {
        throw new Error(error);
    }
});
//get an incident based on truck
const getIncident=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    try {
        const incidents = await Truck.findOne({id})
        .populate({path:"incidents"});
        res.json(incidents);

    } catch (error) {
        throw new Error(error)
    }
});
//get all incidents
const getAllIncidents=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    try {
        const incidents = await Truck.findOne({id},{incidents:1,_id:0})
        .populate({path:"incidents"});
        res.json(incidents);

    } catch (error) {
        throw new Error(error)
    }
});

module.exports = {
    addTruck, updateTruck,
    getAtruck, getAllTrucks,
    deleteAtruck, assigntruck,
    undoTruckAssign,addIncident,
    editIncident,deleteIncident,
    getIncident,getAllIncidents,
    resolveIncident
};