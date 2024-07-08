import { IRestaurant } from "../models/restaurant/interface";
import Restaurant from "../models/restaurant/restaurant.model";
import ApiError from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { ApiResponse } from "../utils/apiResponse";
import { AuthRequest } from "../types";
import jwt, { JwtPayload } from "jsonwebtoken";
import { options } from "../constants";

// Controller for registering a new restaurant
const registerRestaurant = asyncHandler(async (req: Request, res: Response) => {
    try {
        // Extract restaurant details from the request body
        const {
            displayName, username, password, managerName,
            phoneNumber, address, city, state, country, pincode
        }: IRestaurant = req.body;

        // Validate that none of the required fields are empty
        if ([displayName, username, password, managerName, phoneNumber, address,
            city, state, country, pincode].some((field) => !field || field.trim() === "")) {
            throw new ApiError(400, "All fields are required");
        }

        // Check if a restaurant with the same username or phone number already exists
        const existedRestaurant = await Restaurant.findOne({
            $or: [{ username }, { phoneNumber }]
        });

        if (existedRestaurant) {
            throw new ApiError(409, "Restaurant with phone number or username already exists");
        }

        // Check if an image file is provided and upload it to Cloudinary
        const imageFile = req.file ? req.file.path : '';
        if (!imageFile) {
            throw new ApiError(400, "Avatar file is required");
        }

        const avatar = await uploadOnCloudinary(imageFile);
        if (!avatar) {
            throw new ApiError(400, "Failed to upload avatar to Cloudinary");
        }

        // Create a restaurant object to save to the database
        const restaurantRequest = {
            displayName,
            username: username.toLowerCase(),
            avatar: avatar.url,
            password,
            managerName,
            phoneNumber,
            address,
            city,
            state,
            country,
            pincode,
            status: true
        };

        // Save the restaurant to the database
        const restaurantResponse = await Restaurant.create(restaurantRequest);

        // Retrieve the created restaurant, excluding the password field
        const createdRestaurant = await Restaurant.findById(restaurantResponse._id).select("-password -refreshToken");

        // Check if the restaurant was created successfully
        if (!createdRestaurant) {
            throw new ApiError(500, "Something went wrong while registering the restaurant");
        }

        // Return a successful response with the created restaurant data
        res.status(201).json(
            new ApiResponse(201, createdRestaurant, "Restaurant registered successfully")
        );
    } catch (error) {
        throw new ApiError(500, "An error occurred during registration");
    }
});

// Function to generate access and refresh tokens
const generateAccessAndRefereshToken = async (restaurantId: any) => {
    try {
        // Find the restaurant based on restaurant id
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            throw new ApiError(400, "Restaurant does not exist!");
        }

        // Generate access and refresh tokens
        const accessToken = restaurant.generateAccessToken();
        const refreshToken = restaurant.generateRefreshToken();

        // Save refresh token into restaurants collection
        restaurant.refreshToken = refreshToken;
        await restaurant.save({ validateBeforeSave: false })

        return { refreshToken, accessToken };

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
}

// Controller for logging in a restaurant
const loginRestaurant = asyncHandler(async (req: Request, res: Response) => {
    try {
        // Extract login details from the request body
        const { username, phoneNumber, password } = req.body;

        // Validate input: Ensure either username or phone number is provided
        if (!username && !phoneNumber) {
            throw new ApiError(400, "Username or phone number is required");
        }
        if (!password) {
            throw new ApiError(400, "Password is required");
        }

        // Find the restaurant based on username or phone number
        const restaurant = await Restaurant.findOne({
            $or: [{ username }, { phoneNumber }]
        });

        if (!restaurant) {
            throw new ApiError(400, "Restaurant does not exist!");
        }

        // Check if the provided password is correct
        const isPasswordValid = await restaurant.isPasswordCorrect(password);

        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid user credentials");
        }

        // Generate access and refresh tokens
        const { accessToken, refreshToken } = await generateAccessAndRefereshToken(restaurant._id);

        const restaurantResponse = await Restaurant.findById(restaurant._id).select("-password -refreshToken");

        // Return a successful response after logging in with restaurant data
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(
                200,
                { restaurant: restaurantResponse, accessToken, refreshToken },
                "Restaurant logged in successfully"
            ));
    } catch (error) {
        throw new ApiError(500, "An error occurred during login");
    }
});

// Controller for logging out a restaurant
const logoutRestaurant = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Update the restaurant's refreshToken to undefined
        await Restaurant.findByIdAndUpdate(
            req.user._id,
            { $set: { refreshToken: undefined } },
            { new: true }
        );

        // Clear cookies and return a successful response
        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "Restaurant logged out successfully"));
    } catch (error) {
        throw new ApiError(500, "An error occurred during logout");
    }
});

// Controller for refreshing access token for a restaurant
const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
        if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized request");

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            String(process.env.REFRESH_TOKEN_SECRET)
        ) as JwtPayload;

        // Find the restaurant based on restaurant id
        const restaurant = await Restaurant.findById(decodedToken._id);

        if (!restaurant) throw new ApiError(401, "Invalid refresh token");

        if (incomingRefreshToken !== restaurant?.refreshToken) throw new ApiError(401, "Refresh token is expired or used");

        // Generate access and refresh tokens
        const { accessToken, refreshToken } = await generateAccessAndRefereshToken(restaurant._id);

        // Return a successful response after generating refresh and access token
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(
                200,
                { accessToken, refreshToken },
                "Access token refreshed"
            ));
    } catch (error) {
        throw new ApiError(401, "Invalid refresh token");
    }
});



export {
    registerRestaurant,
    loginRestaurant,
    logoutRestaurant,
    refreshAccessToken,   
};
