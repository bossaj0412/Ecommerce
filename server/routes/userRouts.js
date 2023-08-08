import express from "express";
import {
  changePassword,
  deleteUserViaAdmin,
  forgetPassword,
  getAllUser,
  getUserDetail,
  getUserViaAdmin,
  loginUser,
  logoutUSer,
  registerUser,
  resetPassword,
  updateProfile,
  updateUserViaAdmin,
} from "../controllers/userController.js";
import { authorizeRoles, isAuthenticated } from "../middleware/auth.js";

const userRouter = express.Router();

// authentication routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", logoutUSer);
userRouter.post("/password/forgot", forgetPassword);
userRouter.put("/password/reset/:token", resetPassword); // not yet tested

// user routes

userRouter.get("/me", isAuthenticated, getUserDetail);
userRouter.put("/me/changepassword", isAuthenticated, changePassword);
userRouter.put("/me/update", isAuthenticated, updateProfile);
// admin have access of all user
userRouter.get("/admin/users", isAuthenticated, authorizeRoles("admin"), getAllUser);
// admin have access of single user
userRouter.get("/admin/user/:id",isAuthenticated, authorizeRoles("admin"), getUserViaAdmin);
// admin have accescc to update a user
userRouter.put("/admin/user/update/:id",isAuthenticated, authorizeRoles("admin"), updateUserViaAdmin);
// admin have accescc to delete a user
userRouter.delete("/admin/user/delete/:id",isAuthenticated, authorizeRoles("admin"), deleteUserViaAdmin);



export default userRouter;
