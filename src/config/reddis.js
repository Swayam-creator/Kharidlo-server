import Redis from "ioredis"
import dotenv from 'dotenv';
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), './src/config/.env') });
export const redis = new Redis(process.env.UPSTASH_REDIS_URI);

