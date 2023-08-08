import express from "express";
import {
  createProduct,
  createProductReview,
  deleteProduct,
  deleteReview,
  getAllProduct,
  getProductDetails,
  getProductReviews,
  updateProduct,
} from "../controllers/productController.js";
import { authorizeRoles, isAuthenticated } from "../middleware/auth.js";

const productRouter = express.Router();

productRouter.get("/product", getAllProduct);
productRouter.post(
  "/product/new",
  isAuthenticated,
  authorizeRoles("admin"),
  createProduct
);
productRouter.put(
  "/product/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateProduct
);
productRouter.delete(
  "/product/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteProduct
);

productRouter.get("/product/:id", getProductDetails);
productRouter.put("/review", isAuthenticated, createProductReview);
productRouter.get('/reviews',getProductReviews).delete(isAuthenticated,deleteReview)
export default productRouter;
