import express from 'express';
import { adminRoute, protectedRoute } from '../middleware/auth.middleware.js';
import { createCouponHandler, deleteCouponHandler, getCouponHandler, validateCouponHandler } from '../controllers/coupon.controller.js';

const router=express.Router();
router.post('/create-coupon',protectedRoute,adminRoute,createCouponHandler);
router.delete('/delete-coupon',protectedRoute,adminRoute,deleteCouponHandler);
router.get('/',protectedRoute,getCouponHandler);
router.post('/validate',protectedRoute,validateCouponHandler);

export default router;