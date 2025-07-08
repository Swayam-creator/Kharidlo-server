import dotenv from 'dotenv';
dotenv.config({path:'./src/config/.env'});
import express from 'express';
import cors from 'cors';
import { connectDb } from './db/db.js';
import authRoutes from './routes/auth.routes.js';
import cartRoutes from './routes/cart.routes.js'
import productroutes from './routes/product.routes.js'
import couponRoutes from './routes/coupon.routes.js'
import paymentRoutes from './routes/payment.route.js'
import analyticsRoutes from './routes/analytics.routes.js'
import  cookieparser from 'cookie-parser'
const app = express();
app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({extended:false}));
const port=process.env.PORT || 5000;
console.log(port);
const options={

}
app.use(cors(options));
app.use('/api/auth/',authRoutes);
app.use('/api/product',productroutes);
app.use('/api/cart',cartRoutes);
app.use('/api/coupon',couponRoutes);
app.use('/api/payment',paymentRoutes);
app.use('/api/analytics',analyticsRoutes);
connectDb().then(()=>{
     app.listen(port,()=>{
        console.log(`Server is listening on port no ${port}`);
    })
}).catch(err=>{
    console.log(err);
})