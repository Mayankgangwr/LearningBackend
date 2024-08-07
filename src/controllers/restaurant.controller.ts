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
        throw new ApiError(500, `An error occurred during registration: ${error}`);
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
            String(process.env.RESTAURANT_REFRESH_TOKEN_SECRET)
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

// Controller for changing the current logged restaurant password
const changeCurrentPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract old password and new password from request body
        const { oldPassword, newPassword } = req.body;

        // Get restaurant by using user id pushed at middleware
        const restaurant = await Restaurant.findById(req.user._id);

        if (!restaurant) throw new ApiError(401, "Restaurant not found.");

        // Check if the old password is correct
        const isPasswordCorrect = await restaurant.isPasswordCorrect(oldPassword);

        if (!isPasswordCorrect) throw new ApiError(400, "Invalid password");

        // Update the restaurant's password
        restaurant.password = newPassword;

        await restaurant.save({ validateBeforeSave: false });

        // Return a successful response after changing password
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Password changed successfully"));
    } catch (error) {
        throw new ApiError(500, "An error occurred while changing the password");
    }
});

// Controller for getting the current logged restaurant
const getCurrentRestaurant = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Get restaurant by using user id pushed at middleware
        const restaurant = await Restaurant.findById(req.user._id).select("-password -refreshToken");
        if (!restaurant) throw new ApiError(401, "Invalid refresh token");

        // Return a successful response of the current logged restaurant
        return res
            .status(200)
            .json(new ApiResponse(200, restaurant, "Current user fetched successfully"));
    } catch (error) {
        throw new ApiError(500, "An error occurred while fetching the current restaurant");
    }
});

// Controller to update the details of the currently logged-in restaurant
const updateRestaurantDetails = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Destructure the request body to get the restaurant details
        const {
            displayName, managerName, address, city, state, country, pincode, status = true
        }: IRestaurant = req.body;

        // Check if at least one field is provided
        const isAnyFieldFilled = [displayName, managerName, address, city, state, country, pincode]
            .some(field => field !== undefined && field !== null && field !== '');

        // If no field is provided, throw an error
        if (!isAnyFieldFilled) throw new ApiError(400, "At least one of the following fields must be provided");


        // Get the restaurant using the user ID stored in the request object by middleware
        const restaurant = await Restaurant.findById(req.user._id).select("-password -refreshToken");

        // If the restaurant is not found, throw an error
        if (!restaurant) throw new ApiError(401, "Restaurant not found.");

        // Update the restaurant details with the provided fields
        restaurant.displayName = displayName || restaurant.displayName;
        restaurant.managerName = managerName || restaurant.managerName;
        restaurant.address = address || restaurant.address;
        restaurant.city = city || restaurant.city;
        restaurant.state = state || restaurant.state;
        restaurant.country = country || restaurant.country;
        restaurant.pincode = pincode || restaurant.pincode;
        restaurant.status = status || restaurant.status;

        // Save the updated restaurant details to the database
        await restaurant.save();

        // Respond with the updated restaurant details
        return res
            .status(200)
            .json(new ApiResponse(200, restaurant, "Restaurant details updated successfully."));
    } catch (error) {
        throw new ApiError(500, "An error occurred while updating restaurant details");
    }
});

// Controller to update the avatar of the currently logged-in restaurant
const updateRestaurantAvatar = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Get the file path from the request file property added by middleware
        const avatarLocalPath = req.file?.path;

        // Check if an image file is provided
        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar file is missing");
        }

        // Upload the image to Cloudinary
        const avatar = await uploadOnCloudinary(avatarLocalPath);

        // Check if the upload was successful
        if (!avatar?.url) {
            throw new ApiError(400, "Failed to upload avatar to Cloudinary");
        }

        // Get the restaurant by using the user ID added by middleware
        const restaurant = await Restaurant.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    avatar: avatar.url
                }
            },
            { new: true }
        ).select("-password -refreshToken"); // Exclude the password field from the result

        // Check if the restaurant was found and updated
        if (!restaurant) {
            throw new ApiError(404, "Restaurant not found");
        }

        // Respond with the updated restaurant avatar
        return res
            .status(200)
            .json(new ApiResponse(200, restaurant, "Restaurant avatar updated successfully."));
    } catch (error) {
        throw new ApiError(500, "An error occurred while updating the avatar");
    }
});

// Controller to get profile of the currently logged-in restaurant
const getRestaurantProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {

        const { username } = req.params;

        if (!username?.trim()) throw new ApiError(400, "Username is missing");

        const restaurant = await Restaurant.aggregate([
            {
                $match: { username }
            },
            {
                $lookup: {
                    from: "plans",
                    localField: "_id",
                    foreignField: "planId",
                    as: "activePlan"

                }
            },
            {
                $lookup: {
                    from: "workers",
                    localField: "restroId",
                    foreignField: "_id",
                    as: "totalEmployees"

                }
            },
            {
                $addFields: {
                    totalEmployeesCount: { $size: "$totalEmployees" }
                }
            },
            {
                $project: {
                    _id: 1,
                    displayName: 1,
                    username: 1,
                    avatar: 1,
                    managerName: 1,
                    phoneNumber: 1,
                    address: 1,
                    city: 1,
                    state: 1,
                    country: 1,
                    pincode: 1,
                    activePlan: 1,
                    totalEmployees: 1,
                    totalEmployeesCount: 1,

                }
            }
        ])

        // Respond with the updated restaurant avatar
        return res
            .status(200)
            .json(new ApiResponse(200, restaurant, "Restaurant avatar updated successfully."));
    } catch (error) {
        throw new ApiError(500, "An error occurred while  fetching restaurant profile data.");
    }
});

export {
    registerRestaurant,
    loginRestaurant,
    logoutRestaurant,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentRestaurant,
    updateRestaurantDetails,
    updateRestaurantAvatar,
    getRestaurantProfile
};
