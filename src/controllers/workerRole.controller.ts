import { Response } from "express";
import { AuthRequest } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import WorkerRole from "../models/worker/workerRole.model";
import { ApiResponse } from "../utils/apiResponse";
import mongoose from "mongoose";

// Controller to insert a new worker role
const insertRole = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract displayName from the request body
        const { displayName } = req.body;
        if (!displayName) throw new ApiError(400, "Role name is required.");

        // Extract restaurant ID from the authenticated user object
        const restroId = req.user.id;
        if (!restroId) throw new ApiError(401, "Invalid request: Restaurant ID is missing.");

        // Create the request object
        const requestObject = {
            displayName,
            restroId
        };

        // Insert the new worker role into the database
        const response = await WorkerRole.create(requestObject);
        if (!response) throw new ApiError(402, "Failed to insert worker role.");

        // Return a success response
        return res.status(201)
            .json(new ApiResponse(201, response, "Worker role inserted successfully."));
    } catch (error) {
        throw new ApiError(500, "An unexpected error occurred while inserting the worker role.");
    }
});

// Controller to fetch all worker roles for a specific restaurant
const getAllWorkerRole = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract the restaurant ID from the request params and convert to ObjectId format
        const restroId = req.params.restroId ? new mongoose.Types.ObjectId(req.params.restroId) : undefined;
        if (!restroId) throw new ApiError(401, "Restaurant ID is missing.");

        // Fetch all worker roles associated with the restaurant ID
        const workerRoles = await WorkerRole.find({ restroId });
        if (!workerRoles) throw new ApiError(404, "Worker roles not found.");

        // Return a success response
        return res.status(200)
            .json(new ApiResponse(200, workerRoles, "List of worker roles fetched successfully."));
    } catch (error) {
        throw new ApiError(500, "An unexpected error occurred while fetching the list of worker roles.");
    }
});

// Controller to fetch a specific worker role by ID
const getWorkerRole = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract the role ID from the request params
        const id = req.params.id || undefined;
        if (!id) throw new ApiError(401, "Role ID is missing.");

        // Fetch the worker role by ID
        const workerRole = await WorkerRole.findById(id);
        if (!workerRole) throw new ApiError(404, "Worker role not found.");

        // Return a success response
        return res.status(200)
            .json(new ApiResponse(200, workerRole, "Worker role fetched successfully."));
    } catch (error) {
        throw new ApiError(500, "An unexpected error occurred while fetching the worker role.");
    }
});

// Controller to update a worker role by ID
const updateWorkerRole = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract the new displayName from the request body
        const { id, displayName } = req.body;

        // Extract the role ID from the request params
        if (!id) throw new ApiError(401, "Role ID is missing.");

        if (!displayName) throw new ApiError(400, "Role name is required.");


        // Find the worker role by ID
        const workerRole = await WorkerRole.findById(id);
        if (!workerRole) throw new ApiError(404, "Role not found.");

        // Update the displayName
        workerRole.displayName = displayName || workerRole.displayName;
        await workerRole.save();

        // Return a success response
        return res.status(200)
            .json(new ApiResponse(200, workerRole, "Worker role updated successfully."));
    } catch (error) {
        throw new ApiError(500, "An unexpected error occurred while updating the worker role.");
    }
});

// Controller to delete a worker role by ID
const deleteWorkerRole = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract the role ID from the request params
        const { id } = req.params;
        if (!id) throw new ApiError(400, "Worker role ID is missing.");

        // Delete the worker role by ID
        await WorkerRole.findByIdAndDelete(id);

        // Return a success response
        return res.status(200)
            .json(new ApiResponse(200, true, "Worker role deleted successfully."));
    } catch (error) {
        throw new ApiError(500, "An unexpected error occurred while deleting the worker role.");
    }
});

export {
    insertRole,
    getAllWorkerRole,
    getWorkerRole,
    updateWorkerRole,
    deleteWorkerRole
}
