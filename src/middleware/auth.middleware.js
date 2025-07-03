import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
export const protectedRoute=async(req,res,next)=>{
    try {
    const accesstoken=req.cookies.accessToken;
    if(!accesstoken){
        return res.status(401).json({message:"No access token found - access denied"});
    }
    try {
        const decode=jwt.verify(accesstoken,process.env.access_token);
        const user=await User.findById(decode._id).select("-password");
        req.user=user;
        next();
    } catch (error) {
        if(error.name==="TokenExpiredError"){
          res.status(400).json({message:"Unauthorized Invalid access token"});
        }
       throw error;
    }
    } catch (error) {
        console.log("Error in protectedRoute",error.message);
        return res.status(401).json({message:"Access denied Unauthorized"});
      
    }
}

export const adminRoute=async(req,res,next)=>{
    try {
        if(req.user && req.user.role==="admin"){
            next();
        }
    } catch (error) {
        res.status(200).json({error:error.message})
    }
}