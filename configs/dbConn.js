const mongoose =require("mongoose");
const dbauth= process.env.dbPwd
const dbConnect= ()=>{
    try{
    mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        family: 4,
    });
    console.log("Database connection Successful");
    }catch(err){
console.log("Database Error!");
    }
};
module.exports=dbConnect;