const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt=require("jsonwebtoken");
const User=require("../models/userModel")

exports.isAuthenticatedUser= catchAsyncErrors(async(req,res,next)=>{
    const {token}=req.cookies;
    if(!token){
        return next(new ErrorHander("Please Login to access this resource",401));
    }
    // console.log(token);
    const decodedData=jwt.verify(token,process.env.JWT_SECRET);
    // console.log(token);
    
    req.user=await User.findById(decodedData.id);
    // console.log(req.user);
    next(); 
    
});

exports.authorizeRoles=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
           return next(new ErrorHander(`Role: ${req.user.role} is not allowed to access this resource`,403));
        }
        next();
    }
}