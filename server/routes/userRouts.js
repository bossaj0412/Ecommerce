import express from "express"
import { forgetPassword, loginUser, logoutUSer, registerUser, resetPassword } from "../controllers/userController.js";

const userRouter= express.Router();


userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/logout', logoutUSer );
userRouter.post('/password/forgot', forgetPassword);
userRouter.put ('/password/reset/:token', resetPassword);

export default userRouter