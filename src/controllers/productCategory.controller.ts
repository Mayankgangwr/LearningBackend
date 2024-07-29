import { Response } from "express";
import { AuthRequest } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import ApiError from "../utils/apiError";
import ProductCategory from "../models/product/productCategory.model"; 
import mongoose from "mongoose";

// Controller to add a new product category
const addProductCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract product category detail from the request body
        const { displayName } = req.body;

        // Category name is required and must be provided
        if (!displayName) {
            throw new ApiError(400, "Category name is required and must be provided.");
        }

        // Extract the restaurant ID from the request object
        const restroId = req.user?._id;

        // Ensure the restaurant ID is available
        if (!restroId) {
            throw new ApiError(401, "Restaurant ID is missing.");
        }

        // Create a product category object to save to the database
        const categoryRequest = {
            restroId,
            displayName
        };

        // Save the new category to the database
        const categoryResponse = await ProductCategory.create(categoryRequest);

        // Respond with a success message and the created product category data
        return res.status(200)
            .json(new ApiResponse(200, categoryResponse, "Product category inserted successfully."));
    } catch (error) {
        // Handle and log errors during the insert process
        console.error("Error inserting product category:", error);
        throw new ApiError(500, "An error occurred while inserting the product category.");
    }
});

// Controller to get all product categories for a specific restaurant
const getAllProductCategories = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract the restaurant ID from the request params object and convert to ObjectId format
        const restroId = req.params.restroId ? new mongoose.Types.ObjectId(req.params.restroId) : undefined;

        // Ensure the restaurant ID is available
        if (!restroId) {
            throw new ApiError(401, "Restaurant ID is missing.");
        }

        // Retrieve all product categories for the given restaurant ID
        const productCategories = await ProductCategory.aggregate([
            { $match: { restroId } }
        ]);

        // Ensure the product categories are available
        if (!productCategories.length) {
            throw new ApiError(404, "No product categories found.");
        }

        // Respond with a success message and the list of product categories
        return res.status(200).json(
            new ApiResponse(200, productCategories, "All product categories fetched successfully.")
        );
    } catch (error) {
        // Handle and log errors during the fetch process
        console.error("Error fetching product categories:", error);
        throw new ApiError(500, "An error occurred while fetching the product categories.");
    }
});

// Controller to get a specific product category
const getProductCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract the product category ID from the request params
        const id = req.params.id;

        // Ensure the ID is provided
        if (!id) {
            throw new ApiError(400, "Product category ID is required.");
        }

        // Fetch the product category from the database
        const productCategory = await ProductCategory.findById(id);

        // Ensure the product category is available
        if (!productCategory) {
            throw new ApiError(404, "Product category not found.");
        }

        // Respond with a success message and the product category data
        return res.status(200)
            .json(new ApiResponse(200, productCategory, "Product category fetched successfully."));
    } catch (error) {
        // Handle and log errors during the fetch process
        console.error("Error fetching product category:", error);
        throw new ApiError(500, "An error occurred while fetching the product category.");
    }
});

// Controller to update a specific product category
const updateProductCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract product category detail from the request body
        const { displayName } = req.body;

        // Category name is required and must be provided
        if (!displayName) {
            throw new ApiError(400, "Category name is required and must be provided.");
        }

        // Extract product category ID from the request params
        const { id } = req.params;

        // Ensure the product category ID is provided
        if (!id) {
            throw new ApiError(400, "Product category ID is required.");
        }

        // Find the product category by ID
        const productCategory = await ProductCategory.findById(id);

        // Ensure the product category exists
        if (!productCategory) {
            throw new ApiError(404, "Product category not found.");
        }

        // Update the product category details
        productCategory.displayName = displayName || productCategory.displayName;

        // Save the updated product category to the database
        await productCategory.save();

        // Respond with a success message and the updated product category data
        return res.status(200)
            .json(new ApiResponse(200, productCategory, "Product category updated successfully."));
    } catch (error) {
        // Handle and log errors during the update process
        console.error("Error updating product category:", error);
        throw new ApiError(500, "An error occurred while updating the product category.");
    }
});

// Controller to delete a specific product category
const deleteProductCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract product category ID from the request params
        const { id } = req.params;

        // Ensure the ID is provided
        if (!id) {
            throw new ApiError(400, "Product category ID is required.");
        }

        // Delete the product category by ID
        const isDeleted = await ProductCategory.findByIdAndDelete(id);

        // Ensure the product category was deleted
        if (!isDeleted) {
            throw new ApiError(404, "Product category not found.");
        }

        // Respond with a success message indicating deletion
        return res.status(200)
            .json(new ApiResponse(200, true, "Product category deleted successfully."));
    } catch (error) {
        // Handle and log errors during the delete process
        console.error("Error deleting product category:", error);
        throw new ApiError(500, "An error occurred while deleting the product category.");
    }
});

export {
    addProductCategory,
    getAllProductCategories,
    getProductCategory,
    updateProductCategory,
    deleteProductCategory
};
