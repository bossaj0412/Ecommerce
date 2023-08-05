import dotenv from "dotenv";
import express, { urlencoded } from "express";
import productRouter from "./routes/productRoutes.js";
import { connectToDB } from "./config/db.js";

// required connections
dotenv.config();
connectToDB();

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", productRouter);

export default app;
