import mongoose from 'mongoose';

const CouponSchema=new mongoose.Schema({
couponcode:{
    type:String,
    require:true,
},
discountPercentage:{
    type:Number,
    require:true,
    min:0,
    max:100
},
availableCoupons:{
    type:Number,
    require:true,
},
expiryTime:{
    type:Date,
    require:true
},
isActive:{
    type:Boolean,
    require:true,
},
userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    require:true,
    unique:true
}

},{timestamps:true});

export const coupon=new mongoose.model('Coupon',CouponSchema);