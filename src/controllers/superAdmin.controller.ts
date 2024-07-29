import { Response, Request } from "express";
import { AuthRequest } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import SuperAdmin from "../models/SuperAdmin/SuperAdmin.model";
import { options } from "../constants";
import { ApiResponse } from "../utils/apiResponse";
import { ISuperAdmin } from "../models/SuperAdmin/interface";
import jwt, { JwtPayload } from "jsonwebtoken";

// Function to generate access and refresh tokens
const generateAccessAndRefereshToken = async (adminId: any) => {
    try {
        // Find the super admin based on the admin ID
        const superAdmin = await SuperAdmin.findById(adminId);
        if (!superAdmin) {
            throw new ApiError(400, "Super admin does not exist.");
        }

        // Generate access and refresh tokens
        const accessToken = superAdmin.generateAccessToken();
        const refreshToken = superAdmin.generateRefreshToken();

        // Save refresh token into SuperAdmin collection
        superAdmin.refreshToken = refreshToken;
        await superAdmin.save({ validateBeforeSave: false });

        return { refreshToken, accessToken };
    } catch (error) {
        throw new ApiError(500, "Error generating refresh and access token.");
    }
}

// Controller to register super admin
const registerSuperAdmin = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract super admin details from request body
        const { displayName, username, password }: ISuperAdmin = req.body;

        // Ensure all required fields are provided
        if ([displayName, username, password].some((field) => !field)) {
            throw new ApiError(400, "All fields are required.");
        }

        // Check if a super admin with the same username already exists
        const existedSuperAdmin = await SuperAdmin.findOne({ username });
        if (existedSuperAdmin) {
            throw new ApiError(409, "Super admin with username already exists.");
        }

        // Create a super admin object to save to the database
        const superAdminRequest = {
            displayName,
            username: username.toLowerCase(),
            password,
            status: true
        };

        // Save the super admin to the database
        const superAdminResponse = await SuperAdmin.create(superAdminRequest);

        // Retrieve the created super admin, excluding the password and refreshToken fields
        const createdSuperAdmin = await SuperAdmin.findById(superAdminResponse._id).select("-password -refreshToken");
        if (!createdSuperAdmin) {
            throw new ApiError(500, "Error registering the super admin.");
        }

        // Return a successful response with the created super admin data
        res.status(201).json(
            new ApiResponse(201, createdSuperAdmin, "Super admin registered successfully.")
        );
    } catch (error) {
        console.error("Error registering super admin:", error);
        throw new ApiError(500, "An error occurred while registering the super admin.");
    }
});

// Controller to login super admin
const loginSuperAdmin = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract admin login credentials from request body
        const { username, password } = req.body;

        // Ensure username and password are provided
        if (!username) throw new ApiError(401, "Username is required.");
        if (!password) throw new ApiError(401, "Password is required.");

        // Find the admin from the database using username
        const superAdmin = await SuperAdmin.findOne({ username });
        if (!superAdmin) {
            throw new ApiError(400, "Admin does not exist.");
        }

        // Check if the provided password is correct
        const isPasswordValid = await superAdmin.isPasswordCorrect(password);
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid admin credentials.");
        }

        // Generate access and refresh tokens
        const { refreshToken, accessToken } = await generateAccessAndRefereshToken(superAdmin._id);

        const superAdminResponse = await SuperAdmin.findById(superAdmin._id).select("-password -refreshToken");

        // Return a successful response after logging in with admin data
        return res
            .status(200)
            .cookie("refreshToken", refreshToken, options)
            .cookie("accessToken", accessToken, options)
            .json(new ApiResponse(
                200,
                { superAdmin: superAdminResponse, refreshToken, accessToken },
                "Super admin logged in successfully."
            ));
    } catch (error) {
        console.error("Error logging in super admin:", error);
        throw new ApiError(500, "An error occurred while logging in the super admin.");
    }
});

// Controller to logout super admin
const logoutSuperAdmin = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Update the super admin's refreshToken to undefined
        await SuperAdmin.findByIdAndUpdate(
            req.user._id,
            { $set: { refreshToken: undefined } },
            { new: true }
        );

        // Clear cookies and return a successful response
        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "Super admin logged out successfully."));
    } catch (error) {
        throw new ApiError(500, "An error occurred during the logout process.");
    }
});

// Controller to update super admin's username or displayName
const updateSuperAdminDetails = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract super admin details from request body
        const { displayName, username } = req.body;

        // Ensure at least one field is provided
        if (!displayName && !username) {
            throw new ApiError(400, "At least one of the following fields must be provided: displayName, username.");
        }

        // Check if the username already exists
        if (username) {
            const existingSuperAdmin = await SuperAdmin.findOne({ username });
            if (existingSuperAdmin) {
                throw new ApiError(400, "Username already exists.");
            }
        }

        // Get the super admin using the user ID stored in the request object by middleware
        const superAdmin = await SuperAdmin.findById(req.user._id);
        if (!superAdmin) throw new ApiError(401, "Super admin not found.");

        // Update the provided values in the document
        superAdmin.displayName = displayName || superAdmin.displayName;
        superAdmin.username = username || superAdmin.username;

        // Save the updated document to the database
        await superAdmin.save();

        // Return the updated response
        return res
            .status(200)
            .json(new ApiResponse(200, superAdmin, "Super admin details updated successfully."));
    } catch (error) {
        console.error("Error updating super admin details:", error);
        throw new ApiError(500, "An error occurred while updating super admin details.");
    }
});

// Controller to change super admin's current password
const changeCurrentPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract new and old password from request body
        const { newPassword, oldPassword } = req.body;

        // Ensure new and old password fields are provided
        if (!newPassword || !oldPassword) {
            throw new ApiError(400, "New and old passwords are required.");
        }

        // Get the super admin using the user ID stored in the request object by middleware
        const superAdmin = await SuperAdmin.findById(req.user._id);
        if (!superAdmin) throw new ApiError(401, "Super admin not found.");

        // Check if the old password is correct
        const isPasswordCorrect = await superAdmin.isPasswordCorrect(oldPassword);
        if (!isPasswordCorrect) throw new ApiError(400, "Invalid old password.");

        // Update the super admin's password
        superAdmin.password = newPassword;

        // Save the document after updating the password
        await superAdmin.save({ validateBeforeSave: false });

        // Return a successful response after changing the password
        return res
            .status(200)
            .json(new ApiResponse(200, true, "Password changed successfully."));
    } catch (error) {
        console.error("Error changing super admin password:", error);
        throw new ApiError(500, "An error occurred while changing the super admin password.");
    }
});

// Controller for refreshing the access token for a super admin
const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    try {
        // Extract refresh token from cookies or request body
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
        if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized request.");

        // Verify the refresh token
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            String(process.env.SuperAdmin_REFRESH_TOKEN_SECRET)
        ) as JwtPayload;

        // Find the super admin based on the decoded token ID
        const superAdmin = await SuperAdmin.findById(decodedToken._id);
        if (!superAdmin) throw new ApiError(401, "Invalid refresh token.");

        // Check if the incoming refresh token matches the stored refresh token
        if (incomingRefreshToken !== superAdmin.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or invalid.");
        }

        // Generate new access and refresh tokens
        const { accessToken, refreshToken } = await generateAccessAndRefereshToken(superAdmin._id);

        // Return a successful response after generating new tokens
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(
                200,
                { accessToken, refreshToken },
                "Access token refreshed successfully."
            ));
    } catch (error) {
        console.error("Error refreshing access token:", error);
        throw new ApiError(401, "Invalid refresh token.");
    }
});

export {
    registerSuperAdmin,
    loginSuperAdmin,
    logoutSuperAdmin,
    updateSuperAdminDetails,
    changeCurrentPassword,
    refreshAccessToken
}
