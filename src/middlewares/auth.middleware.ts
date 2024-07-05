import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import jwt, { JwtPayload } from "jsonwebtoken";
import Restaurant from "../models/restaurant/restaurant.model";
import { AuthRequest } from "../types";



// Function to decode JWT and return the payload
const decodedJWT = async (req: AuthRequest, res: Response, next: NextFunction): Promise<JwtPayload> => {
    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!accessToken) throw new ApiError(401, "Unauthorized request");
    try {
        const decodedToken = jwt.verify(accessToken, String(process.env.ACCESS_TOKEN_SECRET)) as JwtPayload;
        return decodedToken;
    } catch (error) {
        throw new ApiError(401, "Invalid access token");
    }
};

// Middleware to verify JWT and attach user to request
export const verifyRestaurantJWT = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const decodedToken = await decodedJWT(req, res, next);
    // Check if _id is present
    if (!decodedToken._id) throw new ApiError(401, "Invalid access token");

    // Find the restaurant by the decoded _id
    const restaurant = await Restaurant.findById(decodedToken._id).select("-password -refreshToken");
    if (!restaurant) throw new ApiError(401, "Invalid access token");

    // Attach restaurant to request
    req.user = restaurant;
    next();
});

