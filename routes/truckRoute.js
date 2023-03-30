const { Router } = require("express");
const express= require("express");
const {addTruck,updateTruck,
       getAtruck,getAllTrucks,
       deleteAtruck,undoTruckAssign,
       assigntruck, addIncident, 
       editIncident, getIncident, 
       getAllIncidents,resolveIncident, deleteIncident}=require("../controllers/truckCtrl");
const {authMiddleware,isAdmin} = require("../middleware/authMiddleware");
const router = express.Router();

router.post('/',addTruck);
router.post('/incident/:id',addIncident);//Id is for the truck you want to add incident
router.put("/update-truck/:id",updateTruck);
router.put('/assign/:id',assigntruck);
router.put('/undo/:id',undoTruckAssign)
router.put('/update-incident/:id',editIncident); //Id is for particular Incident.
router.delete("/:id",deleteAtruck);
router.delete('/incident/:id',deleteIncident);
router.get("/all-trucks",getAllTrucks);
router.get("/:id",getAtruck);
router.get("/all-trucks",getAllTrucks);
router.get('/get-incidents/:id',getAllIncidents) //Id if for the truck you need to edit the incident
router.put('/res-incident/:id',resolveIncident);// Id is for the Incident being resolved


module.exports=router;