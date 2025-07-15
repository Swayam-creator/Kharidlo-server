import { Product } from "../models/product.model.js";
import User from "../models/user.model.js"
import {Order} from "../models/order.model.js"
export const getAnalyticsData=async(req,res)=>{
    try {
        const totalUsers=await User.countDocument();
        const totalProduct=await Product.countDocument();
        const salesData=await Order.aggregate([
            {
                $group:{
                    _id:null, // select all products 
                    sales:{$sum:1},
                    revenue:{$sum:"$totalPrice"}
                },
            }
        ]);
        console.log(salesData);
        const {sales,revenue}=salesData[0] || {sales:0,revenue:0}
        return {
         users:totalUsers,
         sales:sales,
         revenue:revenue,
         totalProducts:totalProduct
        }

    } catch (error) {
        return res.status(500).json({message:error.message,success:false});
    }
}

export const getDailyAnalyticsData=async(startDate,endDate)=>{
    try {
        const dailySalesData=await Order.aggregrate(
        [{
              $match:{
                createdAt:{
                    $gte:startDate,
                    $lte:endDate,
                },
              },
              $group:{
                _id:{$dateToString:{ format: "%Y-%m-%d", date: "$createdAt" } },
                sales:{$sum:1},
                revenue:{$sum:"$totalPrice"}
              },
        },
        {$sort:{_id:1} }
        ]
    );
    
//   {   
//    _id : "15-7-2025"
//    sales:123,
//     revenue:123  
//  }
  
    const dateArray=getDatesInRange(startDate,endDate);

      return dateArray.map((date)=>{
        const foundData=dailySalesData.find((item)=>item._id===date);
        return {
            date,
            revenue:foundData?.revenue,
            sales:foundData?.sales,
        }
      })
        
    } catch (error) {
        return res.status(500).json({message:error.message,success:false});
    }
}


const getDatesInRange=function(startDate,endDate){
    let dates=[];
    const currentDate=new Date(startDate);
    while(currentDate<=endDate){
       dates.push(currentDate.toISOString().split('T')[0]);
       currentDate=currentDate.set(currentDate.getDate()+1);
    }
  return dates;
}