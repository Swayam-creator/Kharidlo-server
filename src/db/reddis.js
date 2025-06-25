import Redis from "ioredis"
import dotenv from 'dotenv';
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), './src/config/.env') });
if(!process.env.UPSTASH_REDIS_URI){
    console.log(process.env.UPSTASH_REDIS_URI)
    console.log(path.resolve(process.cwd(), './src/config/.env'))
    throw new Error("Env variable UPSTASH_REDIS_URI not set");
}
export const redis = new Redis(process.env.UPSTASH_REDIS_URI);
redis.on("error",(err)=>{console.log(err)});
redis.on("connect",(err)=>{console.log("Redis connected successfully")});
