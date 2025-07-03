import express from 'express';
import { authlogin, authlogout, authsignup, refreshTokenHandler } from '../controllers/auth.controller.js';
const authRouter=express.Router();
authRouter.post('/register',authsignup);
authRouter.post('/login',authlogin);
authRouter.post('/logout',authlogout);
authRouter.get('/refresh-token',refreshTokenHandler);
export default authRouter;