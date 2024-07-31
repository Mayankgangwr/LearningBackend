import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import jwt, { JwtPayload } from "jsonwebtoken";
import Restaurant from "../models/restaurant/restaurant.model";
import { AuthRequest, Roles } from "../types";
import Worker from "../models/worker/worker.model";
import SuperAdmin from "../models/SuperAdmin/SuperAdmin.model";


// Function to decode JWT and return the payload
const decodedJWT = async (accessToken: string, accessTokenSecret: string): Promise<JwtPayload> => {
    if (!accessToken) throw new ApiError(401, "Unauthorized request");
    try {
        const decodedToken = jwt.verify(accessToken, accessTokenSecret) as JwtPayload;
        return decodedToken;
    } catch (error) {
        throw new ApiError(401, "Invalid access token");
    }
};

// Middleware to verify JWT and attach SuperAdmin(user) to request
export const verifySuperAdminJWT = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    const decodedToken = await decodedJWT(accessToken, String(process.env.SUPERADMIN_ACCESS_TOKEN_SECRET));
    // Check if _id is present
    if (!decodedToken._id) throw new ApiError(401, "Invalid access token");

    // Find the super admin by the decoded _id
    const superAdmin = await SuperAdmin.findById(decodedToken._id).select("-password -refreshToken");
    if (!superAdmin) throw new ApiError(401, "Invalid access token");
    // Attach super admin to request
    req.user = superAdmin;
    next();
});

// Middleware to verify JWT and attach Restaurant(user) to request
export const verifyRestaurantJWT = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    const decodedToken = await decodedJWT(accessToken, String(process.env.RESTAURANT_ACCESS_TOKEN_SECRET));
    // Check if _id is present
    if (!decodedToken._id) throw new ApiError(401, "Invalid access token");

    // Find the restaurant by the decoded _id
    const restaurant = await Restaurant.findById(decodedToken._id).select("-password -refreshToken");
    if (!restaurant) throw new ApiError(401, "Invalid access token");
    // Attach restaurant to request
    req.user = restaurant;
    next();
});

// Middleware to verify JWT and attach Worker(user) to request
export const verifyWorkerJWT = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    const decodedToken = await decodedJWT(accessToken, String(process.env.WORKER_ACCESS_TOKEN_SECRET));
    // Check if _id is present
    if (!decodedToken._id) throw new ApiError(401, "Invalid access token");

    // Find the worker by the decoded _id
    const worker = await Worker.findById(decodedToken._id).select("-password -refreshToken");
    if (!worker) throw new ApiError(401, "Invalid access token");

    // Attach worker to request
    req.user = worker;
    next();
});

