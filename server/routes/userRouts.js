import express from "express"
import { loginUser, logoutUSer, registerUser } from "../controllers/userController.js";

const userRouter= express.Router();


userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/logout', logoutUSer )


export default userRouter