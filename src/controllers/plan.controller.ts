import { Response } from "express";
import { AuthRequest } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import { IPlan } from "../models/plans/interface";
import Plan from "../models/plans/plan.model";
import { ApiResponse } from "../utils/apiResponse";

/**
 * Controller to add a new plan.
 * @param req - Authenticated request object
 * @param res - Response object
 */
const insertPlan = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract plan details from the request body
        const { displayName, duration, mrp, price }: IPlan = req.body;

        // Validate that all required fields are present
        if ([displayName, duration, mrp, price].some((field) => !field)) {
            throw new ApiError(400, "All required fields must be provided.");
        }

        // Create plan object to save in the database
        const requestPlan = { displayName, duration, mrp, price };

        // Save the plan to the database
        const responsePlan = await Plan.create(requestPlan);

        // Return a successful response with the created plan data
        return res.status(201).json(new ApiResponse(201, responsePlan, "Plan inserted successfully."));
    } catch (error) {
        // Handle and log errors during the insert process
        console.error("Error inserting plan:", error);
        throw new ApiError(500, "An error occurred while inserting the plan.");
    }
});

/**
 * Controller to get all existing plans.
 * @param req - Authenticated request object
 * @param res - Response object
 */
const getAllPlans = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Fetch all plans from the database
        const responsePlans = await Plan.find();

        // Ensure plans are available
        if (!responsePlans.length) {
            throw new ApiError(404, "No plans found.");
        }

        // Return a successful response with the list of plans
        return res.status(200).json(new ApiResponse(200, responsePlans, "List of plans fetched successfully."));
    } catch (error) {
        // Handle and log errors during the fetch process
        console.error("Error fetching plans:", error);
        throw new ApiError(500, "An error occurred while fetching the list of plans.");
    }
});

/**
 * Controller to get a specific plan.
 * @param req - Authenticated request object
 * @param res - Response object
 */
const getPlan = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // Ensure the ID is provided
        if (!id) {
            throw new ApiError(400, "Plan ID is required.");
        }

        // Find the plan by ID
        const responsePlan = await Plan.findById(id);

        // Ensure the plan exists
        if (!responsePlan) {
            throw new ApiError(404, "Plan not found.");
        }

        // Return a successful response with the plan details
        return res.status(200).json(new ApiResponse(200, responsePlan, "Plan details fetched successfully."));
    } catch (error) {
        // Handle and log errors during the fetch process
        console.error("Error fetching plan:", error);
        throw new ApiError(500, "An error occurred while fetching the plan.");
    }
});

/**
 * Controller to update an existing plan.
 * @param req - Authenticated request object
 * @param res - Response object
 */
const updatePlan = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract plan details from the request body
        const { displayName, duration, mrp, price, status } = req.body;

        // Ensure at least one field is provided for update
        const isAnyFieldFilled = [displayName, duration, mrp, price, status].some(
            (field) => field !== undefined && field !== null && field !== ''
        );
        if (!isAnyFieldFilled) {
            throw new ApiError(400, "At least one field must be provided for update.");
        }

        const { id } = req.params;

        // Ensure the ID is provided
        if (!id) {
            throw new ApiError(400, "Plan ID is required.");
        }

        // Find the existing plan by ID
        const plan = await Plan.findById(id);

        // Ensure the plan exists
        if (!plan) {
            throw new ApiError(404, "Plan not found.");
        }

        // Update plan details
        plan.displayName = displayName || plan.displayName;
        plan.duration = duration || plan.duration;
        plan.mrp = mrp || plan.mrp;
        plan.price = price || plan.price;
        plan.status = status || plan.status;

        // Save the updated plan details to the database
        await plan.save();

        // Return a successful response with the updated plan data
        return res.status(200).json(new ApiResponse(200, plan, "Plan updated successfully."));
    } catch (error) {
        // Handle and log errors during the update process
        console.error("Error updating plan:", error);
        throw new ApiError(500, "An error occurred while updating the plan.");
    }
});

/**
 * Controller to delete an existing plan.
 * @param req - Authenticated request object
 * @param res - Response object
 */
const deletePlan = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // Ensure the ID is provided
        if (!id) {
            throw new ApiError(400, "Plan ID is required.");
        }

        // Find the plan by ID and delete it
        const isDeleted = await Plan.findByIdAndDelete(id);

        // Ensure the plan was deleted
        if (!isDeleted) {
            throw new ApiError(404, "Plan not found.");
        }

        // Return a successful response indicating the plan was deleted
        return res.status(200).json(new ApiResponse(200, true, "Plan deleted successfully."));
    } catch (error) {
        // Handle and log errors during the delete process
        console.error("Error deleting plan:", error);
        throw new ApiError(500, "An error occurred while deleting the plan.");
    }
});

export {
    insertPlan,
    getAllPlans,
    getPlan,
    updatePlan,
    deletePlan
};
