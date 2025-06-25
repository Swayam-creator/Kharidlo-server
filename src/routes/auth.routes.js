import express from 'express';
import { authlogin, authlogout, authsignup } from '../controllers/auth.controller.js';
const authRouter=express.Router();
authRouter.post('/register',authsignup);
authRouter.post('/login',authlogin);
authRouter.get('/logout',authlogout);
export default authRouter;