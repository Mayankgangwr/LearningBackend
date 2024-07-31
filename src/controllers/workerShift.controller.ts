import { Response } from "express";
import { AuthRequest } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import WorkerShift from "../models/worker/workerShift.model";
import { ApiResponse } from "../utils/apiResponse";
import mongoose from "mongoose";

// Controller to insert a new worker shift
const insertShift = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract displayName from the request body
        const { displayName } = req.body;
        if (!displayName) throw new ApiError(400, "Shift name is required.");

        // Extract restaurant ID from the authenticated user object
        const restroId = req.user.id;
        if (!restroId) throw new ApiError(401, "Invalid request: Restaurant ID is missing.");

        // Create the shift object
        const shiftObject = {
            displayName,
            restroId
        };

        // Insert the new worker shift into the database
        const response = await WorkerShift.create(shiftObject);
        if (!response) throw new ApiError(402, "Failed to insert worker shift.");

        // Return a success response
        return res.status(201).json(new ApiResponse(201, response, "Worker shift inserted successfully."));
    } catch (error) {
        throw new ApiError(500, "An unexpected error occurred while inserting the worker shift.");
    }
});

// Controller to fetch all worker shifts for a specific restaurant
const getAllWorkerShifts = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract the restaurant ID from the request params and convert to ObjectId format
        const restroId = req.params.restroId ? new mongoose.Types.ObjectId(req.params.restroId) : undefined;
        if (!restroId) throw new ApiError(401, "Restaurant ID is missing.");

        // Fetch all worker shifts associated with the restaurant ID
        const workerShifts = await WorkerShift.find({ restroId });
        if (!workerShifts) throw new ApiError(404, "Worker shifts not found.");

        // Return a success response
        return res.status(200).json(new ApiResponse(200, workerShifts, "List of worker shifts fetched successfully."));
    } catch (error) {
        throw new ApiError(500, "An unexpected error occurred while fetching the list of worker shifts.");
    }
});

// Controller to fetch a specific worker shift by ID
const getWorkerShift = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract the shift ID from the request params
        const id = req.params.id || undefined;
        if (!id) throw new ApiError(401, "Shift ID is missing.");

        // Fetch the worker shift by ID
        const workerShift = await WorkerShift.findById(id);
        if (!workerShift) throw new ApiError(404, "Worker shift not found.");

        // Return a success response
        return res.status(200).json(new ApiResponse(200, workerShift, "Worker shift fetched successfully."));
    } catch (error) {
        throw new ApiError(500, "An unexpected error occurred while fetching the worker shift.");
    }
});

// Controller to update a worker shift by ID
const updateWorkerShift = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract the new displayName from the request body
        const { id, displayName } = req.body;
        if (!id) throw new ApiError(401, "Shift ID is missing.");
        if (!displayName) throw new ApiError(400, "Shift name is required.");

        // Find the worker shift by ID
        const workerShift = await WorkerShift.findById(id);
        if (!workerShift) throw new ApiError(404, "Shift not found.");

        // Update the displayName
        workerShift.displayName = displayName || workerShift.displayName;
        await workerShift.save();

        // Return a success response
        return res.status(200).json(new ApiResponse(200, workerShift, "Worker shift updated successfully."));
    } catch (error) {
        throw new ApiError(500, "An unexpected error occurred while updating the worker shift.");
    }
});

// Controller to delete a worker shift by ID
const deleteWorkerShift = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract the shift ID from the request params
        const { id } = req.params;
        if (!id) throw new ApiError(400, "Worker shift ID is missing.");

        // Delete the worker shift by ID
        await WorkerShift.findByIdAndDelete(id);

        // Return a success response
        return res.status(200).json(new ApiResponse(200, true, "Worker shift deleted successfully."));
    } catch (error) {
        throw new ApiError(500, "An unexpected error occurred while deleting the worker shift.");
    }
});

export {
    insertShift,
    getAllWorkerShifts,
    getWorkerShift,
    updateWorkerShift,
    deleteWorkerShift
}
