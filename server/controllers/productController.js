import mongoose from "mongoose";
import Product from "../model/product.schema.js";
import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/customError.js";
import { apiFeatures } from "../features/apiFeture.js";

/******************************************************
 * @CREATE_PRODUCT  --ADMIN
 * @REQUEST     POST
 * @route http://localhost:4000/api/v1/product/new
 * @description User can create product
 * @parameters name, description, image....
 * @returns User Object
 ******************************************************/

export const createProduct = asyncHandler(async (req, res, next) => {
  // req. user contains data about user

  req.body.user = req.user.id;

  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

/******************************************************
 * @GET_ALL_PRODUCT
 * @REQUEST GET
 * @route http://localhost:4000/api/v1/product
 * @description User fetch all products details
 * @parameters  In case you want to search you can send your quesries to
 * @returns User Object
 ******************************************************/

export const getAllProduct = asyncHandler(async (req, res, next) => {
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();

  const apiFeature = new apiFeatures(Product.find(), req.query)
    .search()
    .filter();

  apiFeature.pagination(resultPerPage);

  let products = await apiFeature.query;
  let filteredProductsCount = products.length;

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});

/******************************************************
 * @GET_SINGLE_PRODUCT_DETAILS
 * @REQUEST GET
 * @route http://localhost:4000/api/v1/product/:id
 * @description Use to get product details
 * @parameters __
 * @returns User Object
 ******************************************************/

export const getProductDetails = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new CustomError("No product was found", 404);
  }

  res.status(200).json({
    success: true,
    product,
  });
});

/******************************************************
 * @UPDATE_PRODUCT
 * @REQUEST PUT
 * @route http://localhost:4000/api/v1/product/:id
 * @description Use to update product details
 * @parameters __
 * @returns User Object
 ******************************************************/

export const updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    throw new CustomError("No product was found", 404);
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    // useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

/******************************************************
 * @DELETE_PRODUCT
 * @REQUEST DELETE
 * @route http://localhost:4000/api/v1/product/:id
 * @description Admin delete products details
 * @parameters __
 * @returns deleted product
 ******************************************************/

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new CustomError(" invalid id", 404);
  }

  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "product deleted sucessfully",
  });
});

/******************************************************
 * @REVIEW_PRODUCT
 * @REQUEST POST
 * @route http://localhost:4000/api/v1/review
 * @description Admin delete products details
 * @parameters __
 * @returns deleted product
 ******************************************************/

export const createProductReview = async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  // console.log("hii");
  const isReviewed = product.reviews.find(
    (rev) => ( console.log(rev.user.toString()), rev.user.toString() === req.user._id.toString())
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
};

/******************************************************
 * @ALL_REVIEW_OF_PRODUCT
 * @REQUEST GET
 * @route http://localhost:4000/api/v1/review?productId
 * @description Admin delete products details
 * @parameters __
 * @returns deleted product
 ******************************************************/

export const getProductReviews = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
     throw new CustomError("Product not found", 404);
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
export const deleteReview = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
