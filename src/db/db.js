import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({path:'../src/config/.env'})
export const connectDb=async()=>{
 try {
    const connectionInstance=await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDb connected successfully')
 } catch (error) {
    console.log('Error connecting to mongodb');
    process.exit(1);
 }
}