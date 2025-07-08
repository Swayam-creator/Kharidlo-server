import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import {redis} from '../config/reddis.js'
const generateToken=(userId)=>{
  const accesstoken=jwt.sign({_id:userId},process.env.access_token,{
    expiresIn:'15m'
  });
  const refreshtoken=jwt.sign({_id:userId},process.env.refresh_token,{
    expiresIn:'7d'
  });
 return {accesstoken,refreshtoken};
}
export const storefreshToken=async(userId,refreshToken)=>{ 
    // console.log('yaha pe hu')
    await redis.set(`refresh_token:${userId}`,refreshToken,"EX",7*24*60*60);
     
}
const setCookies=(res,accesstoken,refreshtoken)=>{
 res.cookie("accessToken",accesstoken,{
    httpOnly:true,
    sameSite:"Strict",
    secure:process.env.NODE_ENV==="production",
    maxAge:15*60*1000
 });
 res.cookie("refreshToken",refreshtoken,{
    httpOnly:true,
    sameSite:"Strict",
    secure:process.env.NODE_ENV==="production",
    maxAge:7*24*60*1000
 })
}
export const authsignup=async(req,res)=>{
    // check whether entered credentials are valid or not
    // check whether email exists in database or not
    // generate both refresh and access token
    // store refresh token in reddis
    // and then set setcookies for refresh and access token both
    try {
        const {email,password,name}=req.body;
        if([email,password,name].some((field)=>field?.trim()==="")){
            res.status(400).json({message:"Invalid credentials"});
        }
        const userexist=await User.findOne({email});
        if(userexist){
            return res.status(400).json({message:"Email id already exists"});
        }
        const user=await User.create({name,email,password});
        const {accessToken,refreshToken}=generateToken(user._id);
            await storefreshToken(user._id,refreshToken);
            setCookies(res,accessToken,refreshToken);
            res.status(201).json({
                message:"User registered successfully",
               _id:user._id, 
                name:user.name,
                email:user.email,
                role:user.role
                });
      
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message,success:false});
    }
}

export const authlogin=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if([email,password,name].some((field)=>field?.trim()==="")){
            res.status(400).json({message:"All fields are required",success:false});
        }
        const user=await User.findOne({email});
        if(user && (await user.comparePassword(password))){
            const {accessToken,refreshToken}=generateToken(user._id);
            await storefreshToken(user._id,refreshToken);
           
            setCookies(res,accessToken,refreshToken);
            res.status(201).json({
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
            });
        }
        else{
            res.status(400).json({message:"Invalid credentials",success:false});
        }   
    } catch (error) {
        console.log("Login error:=>",error);
        res.status(500).json({message:error.message});
    }
}

export const authlogout=async(req,res)=>{
    try {
        const refreshtoken=req.cookies.refreshToken;
        if(refreshtoken){
            const decode=jwt.verify(refreshtoken,process.env.refresh_token);
            await redis.del(`refresh_token:${decode.userId}`);
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
        }
        res.status(200).json({message:"Logged out successfully"});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}
// this helps in increasing the validity of access token
export const refreshTokenHandler=async(req,res)=>{
    try {
        const refreshtoken=req.cookies.refreshToken;
        if(!refreshtoken) return  res.status(400).json({message:"No token data found"});
        const decode=jwt.verify(refreshtoken,process.env.refresh_token);
        const storedToken=redis.get(`refresh_token:${decode._id}`,refreshtoken);
        if(refreshtoken!==storedToken) res.status(400).json({message:"No match found"});
        const accessToken=jwt.sign({userId:decode._id},process.env.access_token,{
            expiresIn:'15m'
        });
        const refreshToken=jwt.sign({userId:decode._id},process.env.refresh_token,{
            expiresIn:'7d'
        });
        setCookies(res,accessToken,refreshToken);
        storefreshToken(decode._id,refreshToken)
       res.status(200).json({
        message:"Token refreshed successfully",
        _id:decode._id,
        name:decode.name,
        email:decode.eamil,
        role:decode.role,
       });
    } catch (error) {
        res.status(500).json({message:error.message,success:false});
    }
}