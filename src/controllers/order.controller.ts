import { Response } from "express";
import { AuthRequest } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { IOrder } from "../models/order/interface";
import Order from "../models/order/order.model";
import mongoose from "mongoose";

// Controller to place a new order
const placeOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Determine restaurant ID based on logged-in user or body
        const restroId = req.params.restroId || req.user.restroId || req.user._id;
        if (!restroId) {
            throw new ApiError(401, "Restaurant ID is missing.");
        }

        // Destructure required fields from the request body
        const { statusId, items, customerName, customerNumber, tableNumber, totalAmount }: IOrder = req.body;

        // Check if all required fields are provided
        if (![statusId, customerName, tableNumber, items, totalAmount].every((field) => field)) {
            throw new ApiError(400, "All required fields (restroId, statusId, customerName, tableNumber, items, totalAmount) must be provided.");
        }

        // Validate each item in the order
        items.map((item) => {
            if (![item.productId, item.quantity, item.price].every((field) => field)) {
                throw new ApiError(400, "All required fields (productId, quantity, price) must be provided for each item.");
            }
        });


        // Create the request object to insert into the database
        const requestObject = {
            restroId,
            statusId,
            items,
            customerName,
            customerNumber: customerNumber || null, // Optional field
            tableNumber,
            totalAmount
        };

        // Insert the new order into the database
        const response = await Order.create(requestObject);

        // Check if the order insertion was successful
        if (!response) throw new ApiError(402, "Failed to place the order.");

        // Return a success response
        return res.status(200)
            .json(new ApiResponse(200, response, "Your order was placed successfully."));
    } catch (error) {
        // Handle unexpected errors
        throw new ApiError(500, "An unexpected error occurred while placing the order.");
    }
});

// Controller to fetch a specific order by ID
const getOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract order ID from request params
        const id = req.params.id;
        if (!id) {
            throw new ApiError(400, "Order ID is missing.");
        }

        // Fetch the order by ID
        const response = await Order.findById(id);
        if (!response) throw new ApiError(404, "Order not found.");

        // Return a success response
        return res.status(200).json(
            new ApiResponse(200, response, "Order data fetched successfully.")
        );
    } catch (error) {
        // Handle unexpected errors
        throw new ApiError(500, "An unexpected error occurred while fetching the order.");
    }
});

// Controller to fetch all orders for a specific restaurant
const getAllOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Determine restaurant ID based on logged-in user
        const restroId = req.user.restroId ? new mongoose.Types.ObjectId(req.user.restroId) : new mongoose.Types.ObjectId(req.user._id);
        if (!restroId) {
            throw new ApiError(400, "Restaurant ID is missing.");
        }

        // Fetch all orders associated with the restaurant ID
        const response = await Order.find({ restroId });
        if (!response) throw new ApiError(404, "Orders not found.");

        // Return a success response
        return res.status(200).json(
            new ApiResponse(200, response, "List of orders fetched successfully.")
        );
    } catch (error) {
        // Handle unexpected errors
        throw new ApiError(500, "An unexpected error occurred while fetching the list of orders.");
    }
});

// Controller to update an order by ID
const updateOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Determine restaurant ID based on logged-in user
        const restroId = req.user.restroId || req.user._id;

        // Destructure the necessary fields from the request body
        const { id, statusId, items, customerName, customerNumber, tableNumber, totalAmount }: IOrder = req.body;

        // Validate that the order ID is provided
        if (!id) throw new ApiError(401, "Order ID is missing.");

        // Find the order by ID
        const order = await Order.findById(id);

        // Check if the order exists
        if (!order) throw new ApiError(404, "Order not found.");

        // Check if the request is valid based on restaurant ID or customer details
        if ((order.restroId.toString() !== restroId.toString()) && !(order.customerNumber === customerNumber && order.customerName === customerName)) {
            throw new ApiError(401, "Invalid request.");
        }

        // Ensure at least one field for update is provided
        const isAnyFieldFilled = [statusId, items, customerName, customerNumber, tableNumber, totalAmount].some((field) => field !== undefined && field !== null);

        if (!isAnyFieldFilled) throw new ApiError(400, "At least one of the following fields must be provided: status, items, customerName, customerNumber, tableNumber, totalAmount.");

        // Validate each item in the order if items are provided
        if (items) {
            items.forEach((item) => {
                if (![item.productId, item.quantity, item.price].every((field) => field !== undefined && field !== null)) {
                    throw new ApiError(400, "All required fields (productId, quantity, price) must be provided for each item.");
                }
            });
        }

        // Update the order fields if provided
        if (statusId) order.statusId = statusId;
        if (items) order.items = items;
        if (totalAmount) order.totalAmount = totalAmount;

        // Update only these fields if restaurant or worker updating
        if (order.restroId.toString() === restroId.toString()) {
            if (customerName) order.customerName = customerName;
            if (customerNumber) order.customerNumber = customerNumber;
            if (tableNumber) order.tableNumber = tableNumber;
        }

        // Save the updated order
        await order.save();

        // Respond with the updated order
        return res.status(200).json(
            new ApiResponse(200, order, "Order data has been updated successfully.")
        );
    } catch (error) {
        // Handle unexpected errors
        throw new ApiError(500, "An unexpected error occurred while updating the order.");
    }
});

// Controller to delete an order by ID
const deleteOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract order ID from request params
        const { id } = req.params;

        // Validate that the order ID is provided
        if (!id) throw new ApiError(400, "Order ID is missing.");

        // Delete the order by ID
        await Order.findByIdAndDelete(id);

        // Return a success response
        return res.status(200).json(
            new ApiResponse(200, {}, "Order has been deleted successfully.")
        );
    } catch (error) {
        // Handle unexpected errors
        throw new ApiError(500, "An unexpected error occurred while deleting the order.");
    }
});

export {
    placeOrder,
    getAllOrder,
    getOrder,
    updateOrder,
    deleteOrder
};
