import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { IProduct } from "../models/product/interface";
import ApiError from "../utils/apiError";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { AuthRequest } from "../types";
import Product from "../models/product/product.model";
import { ApiResponse } from "../utils/apiResponse";
import mongoose from "mongoose";

// Controller for insert a new product
const addProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    // Extract restaurant details from the request body
    const { categoryId, displayName, description, price, mrp }: IProduct =
      req.body;
    console.log(req.body);
    // Validate that none of the required fields are empty
    if ([displayName, description, price].some((field) => !field)) {
      throw new ApiError(400, "All fields are required");
    }

    // Check if an image file is provided and upload it to Cloudinary
    const imageFile = req.file?.path;
    if (!imageFile) throw new ApiError(400, "Avatar file is required");

    const avatar = await uploadOnCloudinary(imageFile);

    // Check is image uploaded successful on Cloudinary
    if (!avatar) {
      throw new ApiError(400, "Failed to upload avatar to Cloudinary");
    }

    //convert category Id in Object Id
    const catId = categoryId ? new mongoose.Types.ObjectId(categoryId) : "";

    // create product object to save into db
    const productRequest = {
      restroId: req.user?._id,
      categoryId: catId,
      displayName,
      description,
      price: Number(price),
      mrp: Number(mrp),
      avatar: avatar.url,
    };

    // Save the product to the database
    const productResponse = await Product.create(productRequest);

    // Return a successful response with the created product data
    res
      .status(201)
      .json(
        new ApiResponse(201, productResponse, "Product inserted successfully")
      );
  } catch (error) {
    throw new ApiError(500, "An error occurred during inserting product");
  }
});


export { addProduct };
