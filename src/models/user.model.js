import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv';
dotenv.config({path:'../config/.env'});

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"],
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        lowercase:true,
    },
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    cartItems:[
        {
            quantity:{
                type:Number,
                default:1
            },
            products:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Products"
            }
        }
    ],
    role:{
        type:String,
        enum:["customer","admin"],
        default:"customer",
    },
},{timestamps:true});
userSchema.pre('save',async function(next){
    
    try {
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,10);
    }
    } catch (error) {
       next(error);
    }
next();
});
userSchema
.methods
.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
}
const User=new mongoose.model('User',userSchema);
export default User;