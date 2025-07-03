import express from 'express';
import { adminRoute, protectedRoute } from '../middleware/auth.middleware.js';
import { createProductHandler, deleteProductHandler, getAllProductsHandler, getFeaturedProduct, getProductByCategory, getRecommendations, toggleFeature, updateProductHandler } from '../controllers/product.controller.js'
const router=express();
router.get('/',protectedRoute,adminRoute,getAllProductsHandler);
router.get('/featured',getFeaturedProduct);
router.get('/category/:category',getProductByCategory);
router.get('/recomendation',getRecommendations);
router.post('/create',protectedRoute,adminRoute,createProductHandler);
router.patch('/update',protectedRoute,adminRoute,updateProductHandler);
router.post('/featured/:toggle',protectedRoute,adminRoute,toggleFeature)
router.delete('/:id',protectedRoute,adminRoute,deleteProductHandler);
export default router;