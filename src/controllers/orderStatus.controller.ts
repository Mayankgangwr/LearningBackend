import { Response } from "express";
import { AuthRequest } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import OrderStatus from "../models/order/orderStatus.model";
import { ApiResponse } from "../utils/apiResponse";
import mongoose from "mongoose";

// Controller to insert a new order status
const insertOrderStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        const { displayName } = req.body;

        // Ensure displayName is provided
        if (!displayName) throw new ApiError(400, "Order status name is required.");

        const restroId = req.user?.id;

        // Ensure restaurant ID is available from the authenticated user
        if (!restroId) throw new ApiError(401, "Invalid request: Restaurant ID is missing.");

        // Create the order status object
        const requestObject = { displayName, restroId };

        // Insert the order status into the database
        const response = await OrderStatus.create(requestObject);

        // Ensure the insertion was successful
        if (!response) throw new ApiError(402, "Failed to insert order status.");

        // Return a successful response with the inserted order status
        return res.status(201)
            .json(new ApiResponse(201, response, "Order status inserted successfully."));
    } catch (error) {
        throw new ApiError(500, "An unexpected error occurred while inserting the order status.");
    }
});

const getAllOrderStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract restaurant ID from the request
        const restroId = req.user?._id;
        // Ensure restaurant ID is provided
        if (!restroId) {
            throw new ApiError(400, "Invalid or missing Restaurant ID.");
        }

        // Find all order statuses for the given restaurant
        const orderStatuses = await OrderStatus.find({ restroId });

        // Check if any order statuses were found
        if (orderStatuses.length === 0) {
            return res.status(404).json(new ApiResponse(404, [], "No order statuses found for the specified restaurant."));
        }

        // Return a successful response with the list of order statuses
        return res.status(200).json(new ApiResponse(200, orderStatuses, "List of order statuses fetched successfully."));
    } catch (error) {
        // Handle any unexpected errors
        console.error(error); // Log the error for debugging
        throw new ApiError(500, "An unexpected error occurred while fetching the list of order statuses.");
    }
});
// Controller to fetch a specific order status by ID
const getOrderStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id;

        // Ensure order status ID is provided
        if (!id) throw new ApiError(401, "Order status ID is missing.");

        // Find the order status by ID
        const orderStatus = await OrderStatus.findById(id);

        // Ensure the order status was found
        if (!orderStatus) throw new ApiError(404, "Order status not found.");

        // Return a successful response with the order status
        return res.status(200)
            .json(new ApiResponse(200, orderStatus, "Order status fetched successfully."));
    } catch (error) {
        throw new ApiError(500, "An unexpected error occurred while fetching the order status.");
    }
});

// Controller to update an order status by ID
const updateOrderStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        const { id, displayName } = req.body;

        // Ensure order status ID and displayName are provided
        if (!id) throw new ApiError(401, "Order status ID is missing.");
        if (!displayName) throw new ApiError(400, "Order status name is required.");

        // Find the order status by ID
        const orderStatus = await OrderStatus.findById(id);

        // Ensure the order status was found
        if (!orderStatus) throw new ApiError(404, "Order status not found.");

        // Update the order status display name
        orderStatus.displayName = displayName;

        // Save the updated order status to the database
        await orderStatus.save();

        // Return a successful response with the updated order status
        return res.status(200)
            .json(new ApiResponse(200, orderStatus, "Order status updated successfully."));
    } catch (error) {
        throw new ApiError(500, "An unexpected error occurred while updating the order status.");
    }
});

// Controller to delete an order status by ID
const deleteOrderStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // Ensure order status ID is provided
        if (!id) throw new ApiError(400, "Order status ID is missing.");

        // Delete the order status by ID
        const isDelete = await OrderStatus.findByIdAndDelete(id);
        
        // Return a successful response indicating the order status was deleted
        return res.status(200)
            .json(new ApiResponse(200, true, "Order status deleted successfully."));
    } catch (error) {
        throw new ApiError(500, "An unexpected error occurred while deleting the order status.");
    }
});

export {
    insertOrderStatus,
    getAllOrderStatus,
    getOrderStatus,
    updateOrderStatus,
    deleteOrderStatus
};
