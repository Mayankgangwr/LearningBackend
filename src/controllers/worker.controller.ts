import { Response } from "express";
import { AuthRequest } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import { IWorker } from "../models/worker/interface";
import Worker from "../models/worker/worker.model";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { ApiResponse } from "../utils/apiResponse";
import mongoose from "mongoose";
import { options } from "../constants";
import jwt, { JwtPayload } from "jsonwebtoken";

// Controller to insert a new worker
const insertWorker = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract worker details from the request body
        const {
            shiftId,
            roleId,
            displayName,
            username,
            password,
            position,
            phoneNumber,
            dob,
            aadharCard,
            panCard,
            address,
            city,
            state,
            country,
            pincode,
        }: IWorker = req.body;

        // Validate that required fields are present
        if (![shiftId, roleId, displayName, username, password, position, phoneNumber].every((field) => field)) {
            throw new ApiError(400, "All required fields (shift, role, displayName, username, password, position, phoneNumber) must be provided.");
        }

        // Check if a worker with the same username or phone number already exists
        const existedWorker = await Worker.findOne({
            $or: [{ username }, { phoneNumber }],
        });

        if (existedWorker) {
            throw new ApiError(409, "Worker with phone number or username already exists.");
        }

        // Check if an avatar file is provided and upload it to Cloudinary
        const imageFile = req.file?.path;
        if (!imageFile) {
            throw new ApiError(400, "Worker avatar is required.");
        }

        const avatar = await uploadOnCloudinary(imageFile);

        // Ensure the avatar was uploaded successfully
        if (!avatar?.url) {
            throw new ApiError(400, "Failed to upload worker avatar to Cloudinary.");
        }

        // Create a worker object to save to the database
        const workerRequest = {
            restroId: req.user?._id,
            roleId,
            shiftId,
            displayName,
            username,
            password,
            position,
            avatar: avatar.url,
            phoneNumber,
            dob: Number(dob) || null,
            aadharCard: aadharCard || null,
            panCard: panCard || null,
            address: address || null,
            city: city || null,
            state: state || null,
            country: country || null,
            pincode: pincode || null,
        };

        // Save the worker to the database
        const createdWorker = await Worker.create(workerRequest);

        // Retrieve the created worker, excluding the password field
        const workerResponse = await Worker.findById(createdWorker._id).select("-password -refreshToken");

        // Check if the worker was created successfully
        if (!workerResponse) {
            throw new ApiError(500, "Something went wrong while registering the worker.");
        }

        // Return a successful response with the created worker data
        return res.status(201).json(new ApiResponse(201, workerResponse, "Restaurant worker inserted successfully."));
    } catch (error) {
        throw new ApiError(500, `An unexpected error occurred while inserting the worker: ${error}`);
    }
});

// Controller to get all workers for a specific restaurant
const getAllWorkers = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract and validate the restaurant ID
        const restroId = new mongoose.Types.ObjectId(req.user?._id);
        if (!restroId) {
            throw new ApiError(400, "Restaurant ID is required.");
        }

        // Fetch all workers for the restaurant from the database
        const workers = await Worker.find({ restroId }).select("-password -refreshToken");

        // Return the successful response of the workers list
        return res.status(200).json(new ApiResponse(200, workers, "Restaurant workers list fetched successfully."));
    } catch (error) {
        throw new ApiError(500, "An unexpected error occurred while fetching the list of workers.");
    }
});

// Controller to get a specific worker or get current logged worker details
const getWorker = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract worker ID from the request params or middleware
        const { id } = req.params;
        if (!id) {
            throw new ApiError(400, "Worker ID is required.");
        }

        // Fetch worker from the database
        const worker = await Worker.findById(id).select("-password -refreshToken");

        // Return the successful response of the worker
        return res.status(200).json(new ApiResponse(200, worker, "Restaurant worker fetched successfully."));
    } catch (error) {
        throw new ApiError(500, "An unexpected error occurred while fetching the worker.");
    }
});

// Controller to delete an existing worker
const deleteWorker = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract worker ID from the request params
        const { id } = req.params;
        if (!id) {
            throw new ApiError(400, "Invalid request.");
        }

        // Find the worker in the database
        const worker = await Worker.findById(id);
        if (!worker) {
            throw new ApiError(404, "Worker not found.");
        }

        // Check if the requester is authorized to delete the worker
        if (worker.restroId.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "You are not authorized to delete this worker.");
        }

        // Delete the worker
        await Worker.findByIdAndDelete(id);

        // Return the successful response
        return res.status(200).json(new ApiResponse(200, true, "Worker has been deleted successfully."));
    } catch (error) {
        throw new ApiError(500, "An unexpected error occurred while deleting the worker.");
    }
});

// Function to generate access and refresh tokens

const generateAccessAndRefreshToken = async (workerId: any) => {
    try {
        // Find the worker based on the worker ID
        const worker = await Worker.findById(workerId);
        if (!worker) {
            throw new ApiError(400, "Worker does not exist!");
        }

        // Generate access and refresh tokens
        const accessToken = worker.generateAccessToken();
        const refreshToken = worker.generateRefreshToken();

        // Save the refresh token into the worker's collection
        worker.refreshToken = refreshToken;
        await worker.save({ validateBeforeSave: false });

        return { refreshToken, accessToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token.");
    }
}

// Controller to login worker
const loginWorker = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Extract login credentials from the request body
        const { username, phoneNumber, password } = req.body;

        // Validate input: Ensure either username or phone number is provided
        if (!username && !phoneNumber) {
            throw new ApiError(400, "Username or phone number is required.");
        }

        // Validate input: Ensure password is provided
        if (!password) {
            throw new ApiError(400, "Password is required.");
        }

        // Find the worker based on username or phone number
        const worker = await Worker.findOne({
            $or: [{ username }, { phoneNumber }],
        });

        // Ensure the worker exists
        if (!worker) {
            throw new ApiError(401, "Worker does not exist.");
        }

        // Check if the password is correct
        const isPasswordCorrect = await worker.isPasswordCorrect(password);

        // Ensure the password is correct
        if (!isPasswordCorrect) {
            throw new ApiError(401, "Invalid worker credentials.");
        }

        // Generate access and refresh tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(worker._id);

        // Get updated data of the worker
        const workerResponse = await Worker.findById(worker._id).select("-password -refreshToken");

        // Return the response
        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { worker: workerResponse, accessToken, refreshToken }, "Worker logged in successfully."));
    } catch (error) {
        throw new ApiError(500, "An error occurred during login.");
    }
});

// Controller to log out the worker
const logoutWorker = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Update the worker's refresh token to undefined in the database
        const worker = await Worker.findByIdAndUpdate(req.user?._id, { $set: { refreshToken: undefined } }, { new: true });

        // Ensure the worker exists
        if (!worker) {
            throw new ApiError(400, "Worker does not exist!");
        }

        // Clear the authentication cookies and return a successful response
        return res.status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, true, "Worker logged out successfully."));
    } catch (error) {
        throw new ApiError(500, "An error occurred during logout");
    }
});

// Controller to refresh the worker's access token
const refreshAccessToken = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Get the refresh token from cookies or request body
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

        // Ensure the refresh token is provided
        if (!incomingRefreshToken) throw new ApiError(400, "Unauthorized request");

        // Verify and decode the refresh token
        const decodedToken = jwt.verify(incomingRefreshToken, String(process.env.WORKER_REFRESH_TOKEN_SECRET)) as JwtPayload;

        // Find the worker using the ID from the decoded token
        const worker = await Worker.findById(decodedToken._id);

        // Ensure the worker exists and the refresh token matches
        if (!worker || incomingRefreshToken !== worker?.refreshToken) throw new ApiError(401, "Invalid or expired refresh token");

        // Generate new access and refresh tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(worker._id);

        // Return a successful response with the new tokens
        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken }, "Access token refreshed successfully."));
    } catch (error) {
        throw new ApiError(401, "Invalid refresh token");
    }
});

// Controller to change the current password of the worker
const changeCurrentPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        const id = req.user._id;
        const { oldPassword, newPassword } = req.body;

        // Ensure both old and new passwords are provided
        if (!oldPassword || !newPassword) throw new ApiError(400, "Old password and new password must be provided");

        // Find the worker by ID
        const worker = await Worker.findById(id);

        // Ensure the worker exists
        if (!worker) throw new ApiError(401, "Worker does not exist.");

        // Check if the old password is correct
        const isPasswordCorrect = await worker.isPasswordCorrect(oldPassword);
        if (!isPasswordCorrect) throw new ApiError(400, "Incorrect password.");

        // Update the worker's password
        worker.password = newPassword;
        await worker.save({ validateBeforeSave: false });

        return res.status(200)
            .json(new ApiResponse(200, true, "Worker password has been changed successfully."));
    } catch (error) {
        throw new ApiError(500, "An error occurred while changing the password");
    }
});

// Controller to update an existing worker
const updateWorker = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        const {
            shiftId,
            roleId,
            displayName,
            position,
            dob,
            aadharCard,
            panCard,
            address,
            city,
            state,
            country,
            pincode,
            isLoggedIn,
            status
        }: IWorker = req.body;

        // Check if at least one field is provided
        const isAnyFieldFilled = [shiftId, roleId, displayName, position, dob, aadharCard, panCard, address, city, state, country, pincode]
            .some(field => field !== undefined && field !== null && field !== '');

        if (!isAnyFieldFilled) throw new ApiError(400, "At least one field must be provided");

        // Find the worker using the user ID from the request
        const worker = await Worker.findById(req.user?._id).select("-password -refreshToken");

        if (!worker) throw new ApiError(401, "Worker not found.");

        // Update the worker's details
        worker.shiftId = shiftId || worker.shiftId;
        worker.roleId = roleId || worker.roleId;
        worker.displayName = displayName || worker.displayName;
        worker.position = position || worker.position;
        worker.dob = dob || worker.dob;
        worker.aadharCard = aadharCard || worker.aadharCard;
        worker.panCard = panCard || worker.panCard;
        worker.address = address || worker.address;
        worker.city = city || worker.city;
        worker.state = state || worker.state;
        worker.country = country || worker.country;
        worker.pincode = pincode || worker.pincode;
        worker.isLoggedIn = isLoggedIn || worker.isLoggedIn;
        worker.status = status || worker.status;

        // Save the updated worker details to the database
        await worker.save();

        return res.status(200)
            .json(new ApiResponse(200, worker, "Worker updated successfully."));
    } catch (error) {
        throw new ApiError(500, "An unexpected error occurred while updating the worker.");
    }
});

// Controller to update the avatar of an existing worker
const updateAvatar = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        // Get the file path from the request
        const avatarLocalPath = req.file?.path;

        // Ensure an image file is provided
        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar file is missing");
        }

        // Upload the image to Cloudinary
        const avatar = await uploadOnCloudinary(avatarLocalPath);

        // Ensure the upload was successful
        if (!avatar?.url) {
            throw new ApiError(400, "Failed to upload avatar to Cloudinary");
        }

        // Find and update the worker's avatar
        const worker = await Worker.findByIdAndUpdate(req.user?._id, { $set: { avatar: avatar.url } }, { new: true }).select("-password -refreshToken");

        // Ensure the worker was found and updated
        if (!worker) {
            throw new ApiError(404, "Worker not found");
        }

        return res.status(200)
            .json(new ApiResponse(200, worker, "Worker avatar updated successfully."));
    } catch (error) {
        throw new ApiError(500, "An unexpected error occurred while updating the worker's avatar.");
    }
});

// Controller to get the current logged worker's profile
const getWorkerProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        const { username } = req.params;

        // Ensure the username is provided
        if (!username?.trim()) throw new ApiError(400, "Username is missing");

        // Aggregate worker profile data
        const workerProfile = await Worker.aggregate([
            { $match: { username } },
            {
                $lookup: {
                    from: "restaurants",
                    localField: "restroId",
                    foreignField: "_id",
                    as: "restaurant"
                }
            },
            {
                $lookup: {
                    from: "workershifts",
                    localField: "shiftId",
                    foreignField: "_id",
                    as: "shift"
                }
            },
            {
                $lookup: {
                    from: "workerroles",
                    localField: "roleId",
                    foreignField: "_id",
                    as: "role"
                }
            },
            {
                $project: {
                    _id: 1,
                    restaurant: {
                        $map: {
                            input: "$restaurant",
                            as: "restaurant",
                            in: { _id: "$$restaurant._id", displayName: "$$restaurant.displayName" }
                        }
                    },
                    shift: {
                        $map: {
                            input: "$shift",
                            as: "shift",
                            in: { _id: "$$shift._id", displayName: "$$shift.displayName" }
                        }
                    },
                    role: {
                        $map: {
                            input: "$role",
                            as: "role",
                            in: { _id: "$$role._id", displayName: "$$role.displayName" }
                        }
                    },
                    displayName: 1,
                    username: 1,
                    position: 1,
                    phoneNumber: 1,
                    dob: 1,
                    aadharCard: 1,
                    panCard: 1,
                    address: 1,
                    city: 1,
                    state: 1,
                    country: 1,
                    pincode: 1
                }
            }
        ]);

        return res.status(200)
            .json(new ApiResponse(200, workerProfile, "Worker profile fetched successfully."));
    } catch (error) {
        throw new ApiError(500, "An error occurred while fetching worker profile data.");
    }
});

// Controller to change the current password of a worker by the restaurant
const changeCurrentPasswordByRestaurant = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        const { id, oldPassword, newPassword } = req.body;

        // Ensure both old and new passwords are provided
        if (!oldPassword || !newPassword) throw new ApiError(400, "Old password and new password must be provided");

        // Find the worker by ID
        const worker = await Worker.findById(id);

        // Ensure the worker exists
        if (!worker) throw new ApiError(401, "Worker does not exist.");

        // Check if the requester is authorized to change the worker's password
        if (worker.restroId.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "You are not authorized to change the password.");
        }

        // Check if the old password is correct
        const isPasswordCorrect = await worker.isPasswordCorrect(oldPassword);
        if (!isPasswordCorrect) throw new ApiError(400, "Incorrect password.");

        // Update the worker's password
        worker.password = newPassword;
        await worker.save({ validateBeforeSave: false });

        return res.status(200)
            .json(new ApiResponse(200, true, "Worker password has been changed successfully."));
    } catch (error) {
        throw new ApiError(500, "An error occurred while changing the password");
    }
});

// Controller to update an existing worker by the restaurant
const updateWorkerByRestaurant = asyncHandler(async (req: AuthRequest, res: Response) => {
    try {
        const {
            id,
            shiftId,
            roleId,
            displayName,
            position,
            dob,
            aadharCard,
            panCard,
            address,
            city,
            state,
            country,
            pincode,
            isLoggedIn,
            status
        }: IWorker = req.body;

        // Check if at least one field is provided
        const isAnyFieldFilled = [shiftId, roleId, displayName, position, dob, aadharCard, panCard, address, city, state, country, pincode]
            .some(field => field !== undefined && field !== null && field !== '');

        if (!isAnyFieldFilled) throw new ApiError(400, "At least one field must be provided");

        // Find the worker using the ID from the request
        const worker = await Worker.findById(id).select("-password -refreshToken");

        if (!worker) throw new ApiError(401, "Worker not found.");

        // Update the worker's details
        worker.shiftId = shiftId || worker.shiftId;
        worker.roleId = roleId || worker.roleId;
        worker.displayName = displayName || worker.displayName;
        worker.position = position || worker.position;
        worker.dob = dob || worker.dob;
        worker.aadharCard = aadharCard || worker.aadharCard;
        worker.panCard = panCard || worker.panCard;
        worker.address = address || worker.address;
        worker.city = city || worker.city;
        worker.state = state || worker.state;
        worker.country = country || worker.country;
        worker.pincode = pincode || worker.pincode;
        worker.isLoggedIn = isLoggedIn || worker.isLoggedIn;
        worker.status = status || worker.status;

        // Save the updated worker details to the database
        await worker.save();

        return res.status(200)
            .json(new ApiResponse(200, worker, "Worker updated successfully."));
    } catch (error) {
        throw new ApiError(500, "An unexpected error occurred while updating the worker.");
    }
});


export {
    insertWorker,
    getAllWorkers,
    getWorker,
    loginWorker,
    logoutWorker,
    refreshAccessToken,
    changeCurrentPassword,
    changeCurrentPasswordByRestaurant,
    getWorkerProfile,
    updateWorker,
    updateWorkerByRestaurant,
    updateAvatar,
    deleteWorker
}