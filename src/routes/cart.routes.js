import express from 'express';
import { protectedRoute } from '../middleware/auth.middleware.js';
import { addToCartProductHandler, getProductFromCartHandler, removeCartProductHandler, updateCartHandler } from '../controllers/cart.controller.js';
const router=express.Router();
router.get('/',protectedRoute,getProductFromCartHandler);
router.post('/',protectedRoute,addToCartProductHandler);
router.delete('/',protectedRoute,removeCartProductHandler);
router.put('/:id',protectedRoute,updateCartHandler);



export default router;