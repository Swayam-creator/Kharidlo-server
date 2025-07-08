import { Product } from "../models/product.model.js";
import User from "../models/user.model.js"
export const getAnalyticsData=async(req,res)=>{
    try {
        const totalUsers=await User.countDocument();
        const totalProduct=await Product.countDocument();
        const salesDat=await db.aggregate([
            {
                $group:{
                    _id:null,
                    sales:{$sum:1},
                    revenue:{$sum:"$totalPrice"}
                },
            }
        ]);
        const {sales,revenue}=salesDat() || {sales:0,revenue:0}
        return {
         users:totalUser,
         sales:totalSales,
         
        }

    } catch (error) {
        
    }
}