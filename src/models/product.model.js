import mongoose from 'mongoose';
const ProDuct=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    isFeatured:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    }
},{timestamps:true});

export const Product=new mongoose.model('product',ProDuct);
