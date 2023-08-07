import User from "../model/userModel.schems.js";
import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/customError.js";
import  JWT  from "jsonwebtoken";

export const isAuthenticated= asyncHandler(async(req,res,next)=>{

    const {token} = req.cookies;

    if(!token){
        throw new CustomError(" login to continue", 401);
    }

    
        const data =   JWT.verify(token, process.env.JWT_SECRET)
        //_id, find user based on id, set this in req.user
        req.user = await User.findById(data._id);
        console.log(req.user);
        next();
    // } catch (error) {
    //     throw new CustomError('NOt authorized to access this route', 401)
    // }

    // next();

})

export const authorizeRoles= (...roles)=> asyncHandler( async (req,res,next)=>{

    if( ! roles.includes(req.user.role)){
        throw new CustomError(`role : ${req.user.role } is not allowed to acess this page`, 404);
    }

    next();

})


