import express from 'express';
import { protectedRoute } from '../middleware/auth.middleware.js';

const router=express.Router();
// router.post('/create-checkout-session',protectedRoute,createCheckout);
// router.post('/create-success',protectedRoute,createSuccessCheckout);

export default router;