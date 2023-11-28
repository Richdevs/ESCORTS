//Not found error handling

const notFound=(req,res,next)=>{
    const error = new Error(`Not Found: ${req.originalUrl}`);
    res.status(404);
    next(error);
}

//Error Handler

const ErrorHandler=(err,req,res,next)=>{
    const statuscode=res.statusCode ==200 ? 500 :req.statusCode;
    res.status(statuscode);
    res.json({
        message:err?.message   ,
        stack:err?.stack,
    });

};
module.exports={ErrorHandler,notFound};