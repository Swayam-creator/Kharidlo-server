import express from 'express';
import { adminRoute, protectedRoute } from '../middleware/auth.middleware.js';
import { getAnalyticsData, getDailyAnalyticsData } from '../controllers/analytics.controller.js';

const router=express.Router();
router.get('/',protectedRoute,adminRoute,async(req,res)=>{

try {
    const analyticsData=await getAnalyticsData();
    const endDate=new Date();
    const startDate=new Date(endDate.getTime() - '7*24*60*60*1000');
    const dailyanalyticsData=await getDailyAnalyticsData(startDate,endDate);
    res.status(200).json({
        analyticsData,
        dailyanalyticsData
    });
} catch (error) {
    res.status(error.statusCode).json({message:error.message,success:false});
}
})

export default router;