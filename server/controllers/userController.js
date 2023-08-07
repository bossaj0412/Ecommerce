import mongoose from "mongoose";
import asyncHandler from "../services/asyncHandler.js";
import User from "../model/userModel.schems.js";
import CustomError from "../utils/customError.js";
import { receiveToken } from "../utils/getJwtToken.js";
import { sendEmail } from "../utils/sendMail.js";

/******************************************************
 * @REGISTER
 * @REQUEST     POST
 * @route http://localhost:4000/api/v1/register
 * @description register/ signup
 * @parameters name, email, password....
 * @returns User Object
 ******************************************************/

export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
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
    role,
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

export const logoutUSer = asyncHandler(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    sucess: true,
    message: "logged out ",
  });
});

export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new CustomError("user not found ", 404);

  // get reset password token

  const token = user.generateForgotPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${token}`;

  const message = ` your reset password token is :- \n\n ${resetUrl} \n if you have not requested this url then please ignore`;

  try {
    await sendEmail({
      email: user.email,
      subject: "password recovery",
      message,
    });

    res.status(200).json({
      sucess: true,
      message: "email send sucessfully ",
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    throw new CustomError(error.message, 500);
  }
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if(!user){
    throw new CustomError("reset password is invalid/ token expire ", 400);
  }

  if(req.body.password != req.body.comparePassword){
     throw new CustomError(" password does not match " , 400);
  }

  user.password= req.body.password;
  user.forgotPasswordToken=undefined;
  user.forgotPasswordExpiry=undefined;
  await user.save();
  

});
