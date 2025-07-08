import mongoose from 'mongoose';

const orderSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    products:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"product",
                required:true,
            },
            price:{
                type:Number,
                min:0,
                required:true,
            },
            quantity:{
                type:Number,
                min:1,
                required:true,
            },
        }
    ],
    totalPrice:{
        type:Number,
        required:true
    },
    paymentSessionId:{
        type:String,
        unique:true,
    }
},{
    timestamps:true
});

export const Order=new mongoose.model('order',orderSchema);
