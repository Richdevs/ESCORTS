const bodyParser = require("body-parser");
const cookieParser=require("cookie-parser");
const express= require("express");
const morgan = require("morgan");
const dbConnect =require("./configs/dbConn");
const { notFound, ErrorHandler } = require("./middleware/errorHandler");
const authRouter=require("./routes/authRoute");
const truckRouter=require("./routes/truckRoute");
const convoyRouter=require("./routes/convoyRoute");
const app=express();
const dotenv = require("dotenv").config();
const PORT = process.env.port || 5000;
dbConnect();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(morgan("dev"));


app.use("/api/user",authRouter);
app.use("/api/truck",truckRouter);
app.use("/api/convoy",convoyRouter);

app.use(notFound);
app.use(ErrorHandler);





app.listen( PORT,()=>{
   console.log(`Server is running at Port ${PORT}`)
});