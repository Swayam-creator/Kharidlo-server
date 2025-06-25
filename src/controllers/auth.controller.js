import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import {redis} from '../db/reddis.js'
const generateToken=(userId)=>{
    const accessToken=jwt.sign({id:userId},process.env.access_token,{
        expiresIn:'15m'
    });
    const refreshToken=jwt.sign({id:userId},process.env.refresh_token,{
        expiresIn:'7d'
    });
    return {accessToken,refreshToken};
}
export const storefreshToken=async(userId,refreshToken)=>{ 
      await redis.set(`refresh_token:${userId}`,refreshToken,"EX",7*24*60*60);
     
}
const setCookies=(res,accessToken,refreshToken)=>{
    res.cookie("accessToken",accessToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict",
        maxAge:15*60*1000 // 15minutes 
    });
    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict",
        maxAge:7*24*60*60*1000// 7 days
    })
}
export const authsignup=async(req,res)=>{
    // check whether entered credentials are valid or not
    // check whether email exists in database or not
    // generate both refresh and access token
    // store refresh token in reddis
    // and then set setcookies for refresh and access token both
    const {email,password,name}=req.body;
    try {
         const userExists=await User.findOne({email});
         if(userExists){
            return res.status(400).json({message:"Email already exists",success:false});
         }
         const user=await User.create({name,email,password});
         const {accessToken,refreshToken} = generateToken(user._id);
         await storefreshToken(user._id,refreshToken);
         setCookies(res,accessToken,refreshToken);
         res.status(201).json({message:"User created successfully"});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message:error.message,success:false});

    }
}

export const authlogin=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if([email,password].some((field)=>field?.trim()==="")){
            res.status(400).json({message:"All fields are required",success:false});
        }
        const user=await User.findOne({email});
        if(user && (await user.comparePassword(password))){
            const {accessToken,refreshToken}=generateToken(user._id);
            await storefreshToken(user._id,refreshToken);
            setCookies(accessToken,refreshToken);
            res.status(200).json({
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
            });
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
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}
