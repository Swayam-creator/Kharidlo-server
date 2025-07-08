import { coupon } from "../models/coupon.model.js";
export const createCouponHandler=async(req,res)=>{
    try {
        const {couponcode,discountPercentage,availableCoupons,expiryTime}=req.body;
        const newCoupon=new coupon({couponcode,discountPercentage,availableCoupons,expiryTime,userId:req.user._id});
        await newCoupon.save();
        res.status(201).json(newCoupon);
    } catch (error) {
    res.status(500).json({message:error.message,success:false});   
    }
}
export const deleteCouponHandler=async(req,res)=>{
    try {
        const couponId=req.params.id;
        await coupon.findByIdAndDelete(couponId);
        res.status(200).json({message:"Coupon deleted successfully"});
    } catch (error) {
    res.status(500).json({message:error.message,success:false});
    }
}

export const getCouponHandler=async(req,res)=>{
    try {
        const coupons=await coupon.findOne({userId:req.user._id,isActive:true});
        res.status(200).json(coupons||null);
    } catch (error) {
     res.status(500).json({message:error.message,success:false});    
    }
}

export const validateCouponHandler=async(req,res)=>{
    try {
        const {code}=req.body;
        const coupon=await coupon.findOne({couponcode:code,userId:req.user._id,isActive:true});
        if(!coupon)return res.status(404).json({message:"No coupon found",success:false});
        if(coupon.expiryTime>new Date()){
            coupon.isActive=false;
            await coupon.save();
            return res.status(404).json({message:"Coupon is expired"})
        }
        res.status(200).json({
            message:"coupon available",
            discountPercentage:coupon.discountPercentage,
            code:coupon.code,
        });
    } catch (error) {
        console.log("Error in validator coupon",error);
        res.status(500).json({message:error.message,success:false});
    }
}