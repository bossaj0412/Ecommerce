import mongoose from "mongoose";
import asyncHandler from "../services/asyncHandler.js";
import User from "../model/userModel.schems.js";
import CustomError from "../utils/customError.js";
import { receiveToken } from "../utils/getJwtToken.js";

/******************************************************
 * @REGISTER
 * @REQUEST     POST
 * @route http://localhost:4000/api/v1/register
 * @description register/ signup
 * @parameters name, email, password....
 * @returns User Object
 ******************************************************/

export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email })) {
    throw new CustomError(" user already exist ", 404);
  }
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is id url",
      url: "thi is",
    },
  });
  //   const token = user.getJwtToken();
  //   res.status(201).json({
  //     sucess: true,

  //     token,
  //   });

  receiveToken(user, 201, res);
});

/******************************************************
 * @LOGIN
 * @REQUEST     POST
 * @route http://localhost:4000/api/v1/register
 * @description register/ signup
 * @parameters name, email, password....
 * @returns User Object
 ******************************************************/

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError("please enter email and password ", 404);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new CustomError(" incorrect email ", 401);
  }

  if (!(await user.comparePassword(password))) {
    throw new CustomError("incorrect password ", 401);
  }

  receiveToken(user, 200, res);
});


/******************************************************
 * @LOGOUT
 * @REQUEST     POST
 * @route http://localhost:4000/api/v1/register
 * @description register/ signup
 * @parameters name, email, password....
 * @returns User Object
 ******************************************************/

export const  logoutUSer = asyncHandler(async(req,res,next)=>{

    res.cookie('token',null,{
        expires: new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        sucess:true,
        message: "logged out "
    })

})