import express from "express";
import { createProduct, deleteProduct, getAllProduct, getProductDetails, updateProduct } from "../controllers/productController.js";
import { isAuthenticated } from "../middleware/auth.js";

const productRouter = express.Router();

productRouter.get("/product" ,isAuthenticated,getAllProduct );
productRouter.post("/product/new", createProduct)
productRouter.put("/product/:id", updateProduct)
productRouter.delete("/product/:id", deleteProduct)
productRouter.get("/product/:id", getProductDetails)

export default productRouter;
