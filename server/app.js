import dotenv from "dotenv";
import express, { urlencoded } from "express";
import productRouter from "./routes/productRoutes.js";
import { connectToDB } from "./config/db.js";
import userRouter from "./routes/userRouts.js";
import cookieParser from "cookie-parser";
// required connections
dotenv.config();
connectToDB();

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1", productRouter);
app.use("/api/v1", userRouter);

export default app;

