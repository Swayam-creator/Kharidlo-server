import {Product} from '../models/product.model.js';
//getProductHandler
export const getProductFromCartHandler=async(req,res)=>{
    try {
        const products=await Product.find({_id:{$in:req.user.cartItems } });
        const cartItem=products.map((product)=>{
            const item=req.user.cartItems.find(item=>item.id===product.id);
            return {...product.toJSON(),quantity:item.quantity};
        });
         res.status(200).json(cartItem);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message,success:false});
    }
}
// addtoCart 
export const addToCartProductHandler=async(req,res)=>{
    try {
        const {productId}=req.body;
        const user=req.user;
        const existingItem=user.cartItems.find(item=>item.id===productId);
        if(existingItem){
            existingItem.quantity+=1;
        }
        else{
            await user.cartItems.push(productId);
        }
       await user.save();
       res.status(201).json(user.cartItems);
    } catch (error) {
        return res.status(500).json({error:error.message,success:false});
    }
}

export const removeCartProductHandler=async(req,res)=>{
    try {
        const {productId}=req.body;
        const user=req.user;
        if(!productId){
            user.cartItems=[];
        }
        else{
           user.cartItems.filter(item=>item.id!==productId);
        }       
        await user.save();
        res.status(200).json({message:"Product deleted successfully",success:true});
    } catch (error) {
    return res.status(500).json({error:error.message,success:false});
    }
}
export const updateCartHandler=async(req,res)=>{
    try {
        const productId=req.params.id;
        const {qty}=req.body;
        const user=req.user;
        const existingItem=user.cartItems.find(item=>item.id===productId);
        if(existingItem){
            if(qty===0){
                user.cartItems.filter(item=>item.id!==productId);
                await user.save();
                return res.json(user.cartItems);
            }
              user.cartItems.quantity=qty;
              await user.save();
              res.status(201).json(user.cartItems);
        }
        else{
            return res.status(404).json({message:"product not found",success:false});
        }
    } catch (error) {
        console.log("Error in updateController")
    return res.status(500).json({error:error.message,success:false});

    }
}
