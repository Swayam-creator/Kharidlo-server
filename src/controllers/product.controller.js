import { redis } from "../config/reddis.js";
import { Product } from "../models/product.model.js";
import cloudinary from "../config/cloudinary.js";
// getAllProducts
export const getAllProductsHandler=async(req,res)=>{
    try {
     const product=await Product.find({});
     return res.status(200).json({product});       
    } catch (error) {
        res.status(500).json({message:error.message,success:true});
    }
}

// getFeaturedProducts
export const getFeaturedProduct=async(req,res)=>{
    try {
        let featuredProduct=await redis('featured_product');
        if(featuredProduct){
            return res.status(200).json(JSON.parse(featuredProduct));
        }
         featured=await Product.find({isFeatured:true}).lean();
         // lean returns js object
        if(!featuredProduct){
            return res.status(400).json({message:"No products found in featured"});
        }
        await redis.set('featured_product',JSON.stringify(featuredProduct));
        res.status(200).json(featuredProduct);
    } catch (error) {
        res.status(500).json({message:"Error in featured controller",error:error.message});
        console.log(error.message);
    }
}

//create handle product
export const createProductHandler=async(req,res)=>{
    try {
        const {name,description,price,image,category}=req.body;
        let cloudinaryResponse=null;
        if(image){
           cloudinaryResponse= await cloudinary.uploader.upload(image,{folder:"products"});
        }
        const product=await Product.create({
            name,
            description,
            price,
            image:cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category
        });
        res.status(201).json(product);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:error.message,success:false});
    }
}
// deleteProduct 
export const deleteProductHandler=async(req,res)=>{
    try {
        const productId=req.params.id;
        const product=await Product.findById(productId);
        if(!product){
          return res.status(404).json({message:"Product not found"});
        }
        if(product.image){
            const productId=product.image.split('/').pop().split('.')[0];
            try {
                await cloudinary.uploader.destroy(`products/${productId}`);
                console.log('Product image deleted successfully');
            } catch (error) {
                res.status(400).json({error:error.message,success:false});
            }
        }
        await Product.findByIdAndDelete(productId);
        res.status(200).json({message:"Product deleted successfully"});
    } catch (error) {
        res.status(500).json({message:error.message,success:false});
    }
}
// product by category
export const getProductByCategory=async(req,res)=>{
    try {
        const category=req.params.category;
        const product=await Product.find({category});
        res.status(200).json({product});

    } catch (error) {
        res.status(500).json({message:error.message,success:false});
    }
}
// recommendations
export const getRecommendations=async(req,res)=>{
    try {
        const product=await db.Product.aggregate([
            {
                $sample:{size:4}
            },
            {
                $project:{
                    _id:1,
                    name:1,
                    description:1,
                    price:1,
                    image:1,
                    category:1,
                },
            }
        ]);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message:error.message,success:false});
    }
}
// toggle isfeatured feature
export const toggleFeature=async(req,res)=>{
    try {
        const feature=req.params.toggle;
        const product = await Product.findById(feature);
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }
        product.isFeatured=!product.isFeatured;
        const updateProduct=await product.save();
        await updateFeatureProductCache();
        res.status(200).json(updateProduct);
    } catch (error) {
        return res.staus(500).json({message:error.message,success:false});
    }
}
// update product handler
export const updateProductHandler=async(req,res)=>{
    try {
        const {name,description,price,category}=req.body;

    } catch (error) {
        return res.staus(500).json({message:error.message,success:false});
    }
}

export const updateFeatureProductCache=async(req,res)=>{
    try {
        const product=await Product.find({isFeatured:true}).lean();
        await redis.set('featured_product',JSON.stringify(product));
        res.status(200).json({message:"Added to cache successfully",success:true});
    } catch (error) {
        console.log(error);
        res.status(400).json({error:error.message,success:false});
    }
}