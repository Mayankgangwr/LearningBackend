// // Controller to get all products for a specific restaurant with filtering, pagination, and sorting
// const getAllProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
//   try {
//     // Extract the restaurant ID from the request params object and convert to ObjectId format
//     const restroId = req.params.restroId ? new mongoose.Types.ObjectId(req.params.restroId) : undefined;

//     // Ensure the restaurant ID is available
//     if (!restroId) {
//       throw new ApiError(401, "Unauthorized request. Restaurant ID is missing.");
//     }

//     // Log the restaurant ID for debugging purposes
//     console.log("Restaurant ID:", restroId);

//     // Extract filter, pagination, and sorting options from the query parameters
//     const { page = 1, limit = 10, sortBy = 'createdAt', order = 'asc', ...filters }: any = req.query;

//     // Build the match stage for the aggregation pipeline
//     const matchStage = { restroId, ...filters };

//     // Convert limit and page to numbers
//     const limitNumber = Number(limit);
//     const pageNumber = Number(page);

//     // Calculate the skip value for pagination
//     const skip = (pageNumber - 1) * limitNumber;

//     // Build the sort stage for the aggregation pipeline
//     const sortStage = { [sortBy]: order === 'asc' ? 1 : -1 };

//     // Fetch products for the restaurant from the database with filtering, pagination, and sorting
//     const products = await Product.aggregate([
//       { $match: matchStage },
//       { $skip: skip },
//       { $limit: limitNumber }
//     ]);

//     // Get the total count of products for pagination
//     const totalProducts = await Product.countDocuments(matchStage);

//     // Respond with a success message and the list of products, including pagination details
//     return res.status(200).json(
//       new ApiResponse(200, { products, totalProducts, page: pageNumber, limit: limitNumber }, "All products fetched successfully.")
//     );
//   } catch (error) {
//     // Handle and log errors during the data retrieval process
//     console.error("Error fetching products:", error);
//     throw new ApiError(500, "An error occurred while retrieving the products.");
//   }
// });

import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { IProduct } from "../models/product/interface";
import ApiError from "../utils/apiError";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { AuthRequest } from "../types";
import Product from "../models/product/product.model";
import { ApiResponse } from "../utils/apiResponse";
import mongoose from "mongoose";

// Controller to add a new product
const addProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    // Extract product details from the request body
    const { categoryId, displayName, description, price, mrp }: IProduct = req.body;

    // Validate that required fields are present
    if (![displayName, description, price].every(field => field)) {
      throw new ApiError(400, "All required fields (displayName, description, price) must be provided.");
    }

    // Check if an image file is provided and upload it to Cloudinary
    const imageFile = req.file?.path;
    if (!imageFile) {
      throw new ApiError(400, "Product image is required.");
    }

    const avatar = await uploadOnCloudinary(imageFile);

    // Ensure the image was uploaded successfully
    if (!avatar) {
      throw new ApiError(400, "Failed to upload product image to Cloudinary.");
    }

    // Convert categoryId to ObjectId format if provided
    const catId = categoryId ? new mongoose.Types.ObjectId(categoryId) : undefined;

    // Create a product object to save in the database
    const productRequest = {
      restroId: req.user?._id,
      categoryId: catId,
      displayName,
      description,
      price: Number(price),
      mrp: Number(mrp),
      avatar: avatar.url,
    };

    // Save the new product to the database
    const productResponse = await Product.create(productRequest);

    // Respond with a success message and the created product data
    return res.status(201).json(new ApiResponse(201, productResponse, "Product added successfully."));
  } catch (error) {
    // Handle and log errors during the process
    console.error("Error adding product:", error);
    throw new ApiError(500, "An error occurred while adding the product.");
  }
});

// Controller to get all products for a specific restaurant
const getAllProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    // Extract and validate the restaurant ID
    const restroId = req.params.restroId ? new mongoose.Types.ObjectId(req.params.restroId) : undefined;
    if (!restroId) {
      throw new ApiError(400, "Restaurant ID is required.");
    }

    // Fetch all products for the restaurant from the database
    const products = await Product.find({ restroId });

    // Respond with a success message and the list of products
    return res.status(200).json(new ApiResponse(200, products, "All products fetched successfully."));
  } catch (error) {
    // Handle and log errors during the data retrieval process
    console.error("Error fetching products:", error);
    throw new ApiError(500, "An error occurred while retrieving the products.");
  }
});

// Controller to get a specific product
const getProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    // Extract the product ID from the request params
    const id = req.params.id;
    if (!id) {
      throw new ApiError(400, "Product ID is required.");
    }

    // Fetch the product from the database
    const product = await Product.findById(id);
    if (!product) {
      throw new ApiError(404, "Product not found.");
    }

    // Respond with a success message and the product details
    return res.status(200).json(new ApiResponse(200, product, "Product fetched successfully."));
  } catch (error) {
    // Handle and log errors during the data retrieval process
    console.error("Error fetching product:", error);
    throw new ApiError(500, "An error occurred while retrieving the product.");
  }
});

// Controller to update an existing product
const updateProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    // Extract product ID from the request params
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "Product ID is required.");
    }

    // Extract product details from the request body
    const { categoryId, displayName, description, price, mrp, status } = req.body;

    // Check if at least one field to update is provided
    const isAnyFieldFilled = [categoryId, displayName, description, price, mrp, status]
      .some(field => field !== undefined && field !== null && field !== '');
    if (!isAnyFieldFilled) {
      throw new ApiError(400, "At least one field must be provided for update.");
    }

    // Find the existing product by ID
    const product = await Product.findById(id);
    if (!product) {
      throw new ApiError(404, "Product not found.");
    }

    // Update product details with provided values
    if (categoryId) product.categoryId = new mongoose.Types.ObjectId(categoryId);
    if (displayName) product.displayName = displayName;
    if (description) product.description = description;
    if (price) product.price = Number(price);
    if (mrp) product.mrp = Number(mrp);
    if (status !== undefined) product.status = status;

    // Save the updated product details to the database
    await product.save();

    // Respond with the updated product details
    return res.status(200).json(new ApiResponse(200, product, "Product updated successfully."));
  } catch (error) {
    // Handle and log errors during the update process
    console.error("Error updating product:", error);
    throw new ApiError(500, "An error occurred while updating the product.");
  }
});

// Controller to delete an existing product
const deleteProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    // Extract the product ID from the request params
    const id = req.params.id;
    if (!id) {
      throw new ApiError(400, "Product ID is required.");
    }

    // Delete the existing product from the database
    const result = await Product.findByIdAndDelete(id);
    if (!result) {
      throw new ApiError(404, "Product not found.");
    }

    // Respond with a success message indicating the product was deleted
    return res.status(200).json(new ApiResponse(200, true, "Product deleted successfully."));
  } catch (error) {
    // Handle and log errors during the delete process
    console.error("Error deleting product:", error);
    throw new ApiError(500, "An error occurred while deleting the product.");
  }
});

export {
  addProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct
};
